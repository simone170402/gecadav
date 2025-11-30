package com.cabinetavocat.backend.News;
import com.cabinetavocat.backend.News.NewsItem;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

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
            Document doc = Jsoup.connect("https://www.cameroon-tribune.cm/articles/justice").get();

            Elements articles = doc.select(".article-wrapper"); // classe réelle

            articles.forEach(a -> {
                String title = a.select("h3").text();
                String url = "https://www.cameroon-tribune.cm" + a.select("a").attr("href");

                NewsItem item = new NewsItem();
                item.setTitle(title);
                item.setUrl(url);
                item.setOrigin("Cameroon Tribune");

                list.add(item);
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
            Document doc = Jsoup.connect("https://actucameroun.com/category/societe/justice/").get();

            Elements articles = doc.select("article");

            articles.forEach(a -> {
                String title = a.select("h3 a").text();
                String url = a.select("h3 a").attr("href");

                NewsItem item = new NewsItem();
                item.setTitle(title);
                item.setUrl(url);
                item.setOrigin("Actu Cameroun");

                list.add(item);
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
            Document doc = Jsoup.connect("https://www.spm.gov.cm/journal-officiel/").get();

            Elements links = doc.select(".jo-item a");

            links.forEach(l -> {
                NewsItem item = new NewsItem();
                item.setTitle("Journal Officiel : " + l.text());
                item.setUrl(l.attr("href"));
                item.setOrigin("Journal Officiel");

                list.add(item);
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
            Document doc = Jsoup.connect("https://barreau.cm/actualites").get();

            Elements articles = doc.select(".post-title");

            articles.forEach(a -> {
                String title = a.text();
                String url = a.select("a").attr("href");

                NewsItem item = new NewsItem();
                item.setTitle(title);
                item.setUrl(url);
                item.setOrigin("Barreau du Cameroun");

                list.add(item);
            });

        } catch (Exception e) {
            log.error("Erreur Barreau", e);
        }
        return list;
    }

    // ===========================
    // 5. SCRAPER Cour Suprême
    // ===========================
    private List<NewsItem> fetchCourSupreme() {
        List<NewsItem> list = new ArrayList<>();
        try {
            Document doc = Jsoup.connect("https://www.coursupreme.cm/actualites").get();

            Elements articles = doc.select(".item a");

            articles.forEach(a -> {
                NewsItem item = new NewsItem();
                item.setTitle(a.text());
                item.setUrl(a.attr("href"));
                item.setOrigin("Cour Suprême");

                list.add(item);
            });

        } catch (Exception e) {
            log.error("Erreur Cour Suprême", e);
        }
        return list;
    }

    // ===============
    // CRON : 1/jour
    // ===============
    @Scheduled(cron = "0 0 7 * * *", zone = "Africa/Douala")
    public void refreshNews() {
        List<NewsItem> all = new ArrayList<>();

        all.addAll(fetchCameroonTribune());
        all.addAll(fetchActuCameroun());
        all.addAll(fetchJournalOfficiel());
        all.addAll(fetchBarreau());
        all.addAll(fetchCourSupreme());

        // Retirer doublons
        Set<String> seen = new HashSet<>();
        List<NewsItem> unique = new ArrayList<>();

        for (NewsItem n : all) {
            if (!seen.contains(n.getUrl())) {
                unique.add(n);
                seen.add(n.getUrl());
            }
        }

        cachedNews = unique;
        log.info("Actualités mises à jour : " + unique.size());
    }

    public List<NewsItem> getNews() {
        return cachedNews;
    }
}

