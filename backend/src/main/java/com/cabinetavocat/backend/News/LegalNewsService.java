package com.cabinetavocat.backend.News;

import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.*;

@Slf4j
@Service
public class LegalNewsService {

    private List<NewsItem> cachedNews = new ArrayList<>();

    // ===========================
    // 1. SCRAPER Cameroon Tribune
    // ===========================
    private List<NewsItem> fetchCameroonTribune() {
        List<NewsItem> list = new ArrayList<>();
        try {
            Document doc = Jsoup.connect(
                    "https://www.cameroon-tribune.cm/category2.html/1/fr.html/politique"
            ).get();

            // Correction : les articles sont dans ".article-wrapper" ou ".article-item"
            Elements articles = doc.select(".article-wrapper, .article-item, article");

            articles.forEach(a -> {
                String title = a.select("h3, h2, .article-title").text().trim();
                String href = a.select("a").attr("href").trim();

                if (href.startsWith("/")) {
                    href = "https://www.cameroon-tribune.cm" + href;
                }

                if (!title.isEmpty() && !href.isEmpty()) {
                    list.add(new NewsItem(title, href, null, "Cameroon Tribune", null));
                }
            });

        } catch (Exception e) {
            log.error("Erreur Cameroon Tribune", e);
        }
        return list;
    }

    // ===========================
    // 2. SCRAPER Actu Cameroun
    // ===========================
    private List<NewsItem> fetchActuCameroun() {
        List<NewsItem> list = new ArrayList<>();
        try {
            Document doc = Jsoup.connect(
                    "https://actucameroun.com/toute-lactualite/"
            ).get();

            // Correction : structure réelle = h2.entry-title a
            Elements articles = doc.select("h2.entry-title a, h3.entry-title a");

            articles.forEach(a -> {
                String title = a.text().trim();
                String url = a.attr("href").trim();

                if (!title.isEmpty() && !url.isEmpty()) {
                    list.add(new NewsItem(title, url, null, "Actu Cameroun", null));
                }
            });

        } catch (Exception e) {
            log.error("Erreur Actu Cameroun", e);
        }
        return list;
    }

    // ===========================
    // 3. SCRAPER Journal Officiel
    // ===========================
    private List<NewsItem> fetchJournalOfficiel() {
        List<NewsItem> list = new ArrayList<>();
        try {
            Document doc = Jsoup.connect(
                    "https://www.spm.gov.cm/site/?q=fr/news-categories/actualit%C3%A9s"
            ).get();

            // Correction : aucun ".jo-item", donc on prend les titres généraux
            Elements links = doc.select("h2 a, h3 a, .views-field-title a");

            links.forEach(l -> {
                String title = l.text().trim();
                String url = l.attr("href").trim();

                if (url.startsWith("/")) {
                    url = "https://www.spm.gov.cm" + url;
                }

                if (!title.isEmpty()) {
                    list.add(new NewsItem("Journal Officiel : " + title, url, null, "Journal Officiel", null));
                }
            });

        } catch (Exception e) {
            log.error("Erreur Journal Officiel", e);
        }
        return list;
    }

    // ===========================
    // 4. SCRAPER Barreau du Cameroun
    // ===========================
    private List<NewsItem> fetchBarreau() {
        List<NewsItem> list = new ArrayList<>();
        try {
            Document doc = Jsoup.connect(
                    "https://barreaucameroun.org/fr/en/archives-2/"
            ).get();

            Elements articles = doc.select(".post-title a");

            articles.forEach(a -> {
                String title = a.text().trim();
                String url = a.attr("href");

                if (!title.isEmpty() && !url.isEmpty()) {
                    list.add(new NewsItem(title, url, null, "Barreau du Cameroun", null));
                }
            });

        } catch (Exception e) {
            log.error("Erreur Barreau du Cameroun", e);
        }
        return list;
    }

    // ===========================
    // 5. SCRAPER Cour Suprême
    // ===========================
    private List<NewsItem> fetchCourSupreme() {
        List<NewsItem> list = new ArrayList<>();
        try {
            Document doc = Jsoup.connect(
                    "https://coursupreme.cm/publication/actuality"
            ).get();

            // Correction : ".block-news" peut ne pas exister -> fallback
            Elements blocks = doc.select(".block-news, article, .news-item, .col-md-4 a");

            blocks.forEach(b -> {
                String title = b.select("h4, h3, a").text().trim();
                String relativeUrl = b.select("a").attr("href").trim();

                if (!relativeUrl.startsWith("http")) {
                    relativeUrl = "https://coursupreme.cm" + relativeUrl;
                }

                if (!title.isEmpty()) {
                    list.add(new NewsItem(title, relativeUrl, null, "Cour Suprême", null));
                }
            });

        } catch (Exception e) {
            log.error("Erreur Cour Suprême", e);
        }
        return list;
    }

    // =====================================
    // INIT + CRON QUOTIDIEN
    // =====================================

    @PostConstruct
    public void init() {
        log.info("Initialisation : chargement immédiat des actualités...");
        refreshNews();
    }

    @Scheduled(cron = "0 0 7 * * *", zone = "Africa/Douala")
    public void refreshNews() {
        List<NewsItem> all = new ArrayList<>();

        all.addAll(fetchCameroonTribune());
        all.addAll(fetchActuCameroun());
        all.addAll(fetchJournalOfficiel());
        all.addAll(fetchBarreau());
        all.addAll(fetchCourSupreme());

        // Suppression doublons
        Set<String> seen = new HashSet<>();
        List<NewsItem> unique = new ArrayList<>();

        for (NewsItem n : all) {
            if (!seen.contains(n.getUrl())) {
                unique.add(n);
                seen.add(n.getUrl());
            }
        }

        cachedNews = unique;
        log.info("Actualités mises à jour : {}", unique.size());
    }

    public List<NewsItem> getNews() {
        return cachedNews;
    }

    // =====================================
    // Bypass SSL pour sites mal configurés
    // =====================================
    static {
        javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);
        try {
            javax.net.ssl.SSLContext sc = javax.net.ssl.SSLContext.getInstance("SSL");
            sc.init(null, new javax.net.ssl.TrustManager[]{ new javax.net.ssl.X509TrustManager() {
                public java.security.cert.X509Certificate[] getAcceptedIssuers() { return null; }
                public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
            }}, new java.security.SecureRandom());
            javax.net.ssl.HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
        } catch (Exception ignored) {}
    }
}
