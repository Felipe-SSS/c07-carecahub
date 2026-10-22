USE `carecahub`;

DROP PROCEDURE IF EXISTS `sp_insert_user`;

DELIMITER //
CREATE PROCEDURE `sp_insert_user`(
  IN p_name VARCHAR(45),
  IN p_email VARCHAR(45),
  IN p_password TEXT,
  IN p_github VARCHAR(15),
  IN p_created_at DATETIME,
  IN p_updated_at DATETIME
)
BEGIN
  INSERT INTO `User` (`name`, `email`, `password`, `github`, `created_at`, `updated_at`)
  VALUES (p_name, p_email, p_password, p_github, p_created_at, p_updated_at);
END //
DELIMITER ;

CALL `sp_insert_user`('Marina Costa', 'marina.costa@example.com', 'senha_demo_mentor', 'marina-costa', '2026-01-10 08:00:00', '2026-01-10 08:00:00');
CALL `sp_insert_user`('Ana Beatriz', 'ana.beatriz@example.com', 'senha_demo_aluna', 'ana-beatriz', '2026-01-10 08:05:00', '2026-01-10 08:05:00');
CALL `sp_insert_user`('Bruno Lima', 'bruno.lima@example.com', 'senha_demo_aluno', 'bruno-lima', '2026-01-10 08:10:00', '2026-01-10 08:10:00');
CALL `sp_insert_user`('Carla Mendes', 'carla.mendes@example.com', 'senha_demo_aluna', 'carla-mendes', '2026-01-10 08:15:00', '2026-01-10 08:15:00');
CALL `sp_insert_user`('Diego Rocha', 'diego.rocha@example.com', 'senha_demo_aluno', 'diego-rocha', '2026-01-10 08:20:00', '2026-01-10 08:20:00');
CALL `sp_insert_user`('Elisa Nunes', 'elisa.nunes@example.com', 'senha_demo_aluna', 'elisa-nunes', '2026-01-10 08:25:00', '2026-01-10 08:25:00');
CALL `sp_insert_user`('Felipe Ramos', 'felipe.ramos@example.com', 'senha_demo_prof', 'felipe-ramos', '2026-01-10 08:30:00', '2026-01-10 08:30:00');
CALL `sp_insert_user`('Gabriela Alves', 'gabriela.alves@example.com', 'senha_demo_prof', 'gabi-alves', '2026-01-10 08:35:00', '2026-01-10 08:35:00');

DROP PROCEDURE IF EXISTS `sp_insert_user`;
