package com.cabinetavocat.backend.News;

public class NewsItem {

    private String title;
    private String url;
    private String source;
    private String origin;
    private String date;

    public NewsItem() {}

    public NewsItem(String title, String url, String source, String origin, String date) {
        this.title = title;
        this.url = url;
        this.source = source;
        this.origin = origin;
        this.date = date;
    }

    public String getTitle() { return title; }
    public String getUrl() { return url; }
    public String getSource() { return source; }
    public String getOrigin() { return origin; }
    public String getDate() { return date; }

    public void setTitle(String title) { this.title = title; }
    public void setUrl(String url) { this.url = url; }
    public void setSource(String source) { this.source = source; }
    public void setOrigin(String origin) { this.origin = origin; }
    public void setDate(String date) { this.date = date; }
}
