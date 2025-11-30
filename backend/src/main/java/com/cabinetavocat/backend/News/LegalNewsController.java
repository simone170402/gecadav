package com.cabinetavocat.backend.News;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")
public class LegalNewsController {

    private final LegalNewsService service;

    public LegalNewsController(LegalNewsService service) {
        this.service = service;
    }

    @GetMapping
    public List<NewsItem> getNews() {
        return service.getNews();
    }
}
