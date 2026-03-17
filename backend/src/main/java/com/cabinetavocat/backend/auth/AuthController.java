package com.cabinetavocat.backend.auth;

import com.cabinetavocat.backend.auth.dto.*;
import com.cabinetavocat.backend.security.JwtService;

import jakarta.validation.Valid;
import org.springframework.security.authentication.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;

  public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
  }

  @PostMapping("/login")
  public LoginResponse login(@Valid @RequestBody LoginRequest request) {
    var authToken = new UsernamePasswordAuthenticationToken(request.email(), request.password());
    authenticationManager.authenticate(authToken);

    String jwt = jwtService.generateToken(request.email());
    return new LoginResponse(jwt);
  }
}
