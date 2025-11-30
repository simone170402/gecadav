package com.cabinetavocat.backend.News;
import com.cabinetavocat.backend.News.NewsItem;
import com.cabinetavocat.backend.News.LegalNewsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/news")
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


