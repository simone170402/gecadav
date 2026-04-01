package com.cabinetavocat.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SitemapController {

    @GetMapping(value = "/sitemap.xml", produces = "application/xml")
    public String sitemap() {
        return """
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

            <url>
                <loc>https://cabinet-tsapy.com/</loc>
            </url>

            <url>
                <loc>https://cabinet-tsapy.com/about</loc>
            </url>

            <url>
                <loc>https://cabinet-tsapy.com/services</loc>
            </url>

            <url>
                <loc>https://cabinet-tsapy.com/contact</loc>
            </url>

            <url>
                <loc>https://cabinet-tsapy.com/news</loc>
            </url>

        </urlset>
        """;
    }
}