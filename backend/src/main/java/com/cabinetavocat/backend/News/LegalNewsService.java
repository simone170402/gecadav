package com.cabinetavocat.backend.News;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class LegalNewsService {

    private List<NewsItem> cache = new ArrayList<>();
    private Instant lastUpdate = Instant.EPOCH;
    private static final Duration CACHE_DURATION = Duration.ofMinutes(30);

    public synchronized List<NewsItem> getNews() {
        if (cache.isEmpty() || Duration.between(lastUpdate, Instant.now()).compareTo(CACHE_DURATION) > 0) {
            refreshCache();
        }
        return cache;
    }

    @Scheduled(fixedRate = 30 * 60 * 1000) // toutes les 30 minutes
    public void autoRefresh() {
        refreshCache();
    }

    private synchronized void refreshCache() {
        List<NewsItem> result = new ArrayList<>();

        try { result.addAll(scrapeCameroonTribune()); } catch (Exception ignored) {}
        try { result.addAll(scrapeActuCameroun()); } catch (Exception ignored) {}
        try { result.addAll(scrapeJournalOfficiel()); } catch (Exception ignored) {}
        try { result.addAll(scrapeBarreauCameroun()); } catch (Exception ignored) {}

        if (result.size() > 20) result = result.subList(0, 20);

        cache = result;
        lastUpdate = Instant.now();
    }

    /* ============================ */
    /*  SCRAPERS DES 4 SOURCES     */
    /* ============================ */

    // Cameroon Tribune - Justice
    private List<NewsItem> scrapeCameroonTribune() throws Exception {
        List<NewsItem> list = new ArrayList<>();
        String url = "https://www.cameroon-tribune.cm/articles/category/justice";

        Document doc = Jsoup.connect(url).get();
        Elements articles = doc.select("article");

        for (Element el : articles) {
            Element a = el.selectFirst("a");
            if (a == null) continue;

            String title = a.text();
            String link = a.absUrl("href");
            String date = el.select("time").text();

            list.add(new NewsItem(title, link, "Cameroon Tribune", "Cameroon", date));
        }
        return list;
    }

    // Actu Cameroun
    private List<NewsItem> scrapeActuCameroun() throws Exception {
        List<NewsItem> list = new ArrayList<>();
        String url = "https://actucameroun.com/category/justice/";

        Document doc = Jsoup.connect(url).get();
        Elements posts = doc.select("article, .post");

        for (Element post : posts) {
            Element a = post.selectFirst("a");
            if (a == null) continue;

            String title = a.text();
            String link = a.absUrl("href");
            String date = post.select("time").text();

            list.add(new NewsItem(title, link, "Actu Cameroun", "Cameroon", date));
        }
        return list;
    }

    // Journal Officiel (SPM)
    private List<NewsItem> scrapeJournalOfficiel() throws Exception {
        List<NewsItem> list = new ArrayList<>();
        String url = "https://www.spm.gov.cm/page/texte-loi";

        Document doc = Jsoup.connect(url).get();
        Elements items = doc.select(".item");

        for (Element it : items) {
            Element a = it.selectFirst("a");
            if (a == null) continue;

            String title = a.text();
            String link = a.absUrl("href");
            String date = it.select(".date, time").text();

            list.add(new NewsItem(title, link, "Journal Officiel", "Cameroon", date));
        }
        return list;
    }

    // Barreau du Cameroun
    private List<NewsItem> scrapeBarreauCameroun() throws Exception {
        List<NewsItem> list = new ArrayList<>();
        String url = "https://barreau.cm/category/actualites/";

        Document doc = Jsoup.connect(url).get();
        Elements articles = doc.select("article");

        for (Element el : articles) {
            Element a = el.selectFirst("a");
            if (a == null) continue;

            String title = a.text();
            String link = a.absUrl("href");
            String date = el.select("time").text();

            list.add(new NewsItem(title, link, "Barreau du Cameroun", "Cameroon", date));
        }
        return list;
    }
}

