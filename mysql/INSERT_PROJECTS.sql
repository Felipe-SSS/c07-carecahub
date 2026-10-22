USE `carecahub`;

DROP PROCEDURE IF EXISTS `sp_insert_project`;

DELIMITER //
CREATE PROCEDURE `sp_insert_project`(
  IN p_name VARCHAR(45),
  IN p_description TEXT,
  IN p_dependency_manager VARCHAR(15),
  IN p_tecnologies JSON,
  IN p_repository_type VARCHAR(15),
  IN p_created_at DATETIME,
  IN p_updated_at DATETIME
)
BEGIN
  INSERT INTO `Project` (
    `name`, `description`, `dependency_manager`, `tecnologies`, `repository_type`, `created_at`, `updated_at`
  ) VALUES (
    p_name, p_description, p_dependency_manager, p_tecnologies, p_repository_type, p_created_at, p_updated_at
  );
END //
DELIMITER ;

CALL `sp_insert_project`('CarecaHub', 'Plataforma para acompanhar projetos acadêmicos.', 'npm', JSON_ARRAY('Node.js', 'React', 'MySQL'), 'Multirepo', '2026-01-15 09:00:00', '2026-01-15 09:00:00');
CALL `sp_insert_project`('Campus Verde', 'Aplicação para registrar iniciativas de sustentabilidade.', 'pnpm', JSON_ARRAY('TypeScript', 'Next.js', 'PostgreSQL'), 'Monorepo', '2026-01-16 09:00:00', '2026-01-16 09:00:00');
CALL `sp_insert_project`('Sabor Local', 'Catálogo colaborativo de produtores locais.', 'Composer', JSON_ARRAY('PHP', 'Laravel', 'MySQL'), 'Multirepo', '2026-01-17 09:00:00', '2026-01-17 09:00:00');

DROP PROCEDURE IF EXISTS `sp_insert_project`;
