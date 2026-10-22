USE `carecahub`;

DROP PROCEDURE IF EXISTS `sp_insert_repository`;

DELIMITER //
CREATE PROCEDURE `sp_insert_repository`(
  IN p_project_id INT,
  IN p_github_url VARCHAR(50),
  IN p_included_in_organization TINYINT,
  IN p_created_at DATETIME,
  IN p_updated_at DATETIME
)
BEGIN
  INSERT INTO `Repository` (`project_id`, `github_url`, `included_in_organization`, `created_at`, `updated_at`)
  VALUES (p_project_id, p_github_url, p_included_in_organization, p_created_at, p_updated_at);
END //
DELIMITER ;

CALL `sp_insert_repository`(1, 'https://github.com/c07/carecahub-api', 1, '2026-01-21 09:00:00', '2026-01-21 09:00:00');
CALL `sp_insert_repository`(2, 'https://github.com/c07/campus-verde', 1, '2026-01-21 09:05:00', '2026-01-21 09:05:00');
CALL `sp_insert_repository`(3, 'https://github.com/c07/sabor-local-web', 0, '2026-01-21 09:10:00', '2026-01-21 09:10:00');

DROP PROCEDURE IF EXISTS `sp_insert_repository`;
