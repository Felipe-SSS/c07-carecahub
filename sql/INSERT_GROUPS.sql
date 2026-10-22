USE `carecahub`;

DROP PROCEDURE IF EXISTS `sp_insert_group`;

DELIMITER //
CREATE PROCEDURE `sp_insert_group`(
  IN p_friendly_id VARCHAR(30),
  IN p_project_id INT,
  IN p_created_at DATETIME,
  IN p_updated_at DATETIME
)
BEGIN
  INSERT INTO `Group` (`friendlyId`, `project_id`, `created_at`, `updated_at`)
  VALUES (p_friendly_id, p_project_id, p_created_at, p_updated_at);
END //
DELIMITER ;

CALL `sp_insert_group`('C07-CarecaHub', 1, '2026-01-20 10:00:00', '2026-01-20 10:00:00');
CALL `sp_insert_group`('C07-CampusVerde', 2, '2026-01-20 10:05:00', '2026-01-20 10:05:00');
CALL `sp_insert_group`('C07-SaborLocal', 3, '2026-01-20 10:10:00', '2026-01-20 10:10:00');

DROP PROCEDURE IF EXISTS `sp_insert_group`;
