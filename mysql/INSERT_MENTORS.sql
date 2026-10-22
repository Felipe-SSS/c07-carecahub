USE `carecahub`;

DROP PROCEDURE IF EXISTS `sp_insert_mentor`;

DELIMITER //
CREATE PROCEDURE `sp_insert_mentor`(
  IN p_id INT,
  IN p_registration INT,
  IN p_consultation_hours VARCHAR(40)
)
BEGIN
  INSERT INTO `Mentor` (`id`, `registration`, `consultation_hours`)
  VALUES (p_id, p_registration, p_consultation_hours);
END //
DELIMITER ;

CALL `sp_insert_mentor`(1, 10001, 'Segundas, 14h às 16h');

DROP PROCEDURE IF EXISTS `sp_insert_mentor`;
