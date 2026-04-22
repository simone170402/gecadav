INSERT INTO subscription_plans (name, billing_cycle, price, duration_in_days, active, description, created_at)
VALUES
('Mensuel', 'MONTHLY', 19.90, 30, true, 'Accès mensuel à la revue juridique premium', NOW()),
('Annuel', 'YEARLY', 179.90, 365, true, 'Accès annuel à la revue juridique premium avec tarif avantageux', NOW())
ON CONFLICT (name, billing_cycle) DO NOTHING;


INSERT INTO users (email, password, role)
VALUES
('admin@cabinet-tsapy.com', '$2a$10$xK1aS8niWbsduN8HUT3jeuxyWDwYzK7YlLDyMQPLa5u8OCkyQcO/m', 'ADMIN'),
('junior@cabinet-tsapy.com', '$2a$10$GPoU4eUMhjRJZhr0v/Qqvu0cb7vdUlIpiqf4DSVyFqJA5F31Ba2zu', 'AVOCAT')
ON CONFLICT (email) DO NOTHING;