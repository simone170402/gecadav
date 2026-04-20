package com.cabinetavocat.backend.auth;

import com.cabinetavocat.backend.auth.dto.LoginRequest;
import com.cabinetavocat.backend.auth.dto.LoginResponse;
import com.cabinetavocat.backend.model.User;
import com.cabinetavocat.backend.repository.UserRepository;
import com.cabinetavocat.backend.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        var authToken = new UsernamePasswordAuthenticationToken(
                request.email(),
                request.password()
        );

        authenticationManager.authenticate(authToken);

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        String jwt = jwtService.generateToken(user.getEmail());

        return new LoginResponse(
                jwt,
                user.getEmail(),
                user.getRole().name()
        );
    }
}