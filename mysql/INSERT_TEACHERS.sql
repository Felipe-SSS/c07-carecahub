USE `carecahub`;

DROP PROCEDURE IF EXISTS `sp_insert_teacher`;

DELIMITER //
CREATE PROCEDURE `sp_insert_teacher`(
  IN p_id INT,
  IN p_consultation_hours VARCHAR(40)
)
BEGIN
  INSERT INTO `Teacher` (`id`, `consultation_hours`)
  VALUES (p_id, p_consultation_hours);
END //
DELIMITER ;

CALL `sp_insert_teacher`(7, 'Terças, 10h às 12h');
CALL `sp_insert_teacher`(8, 'Quintas, 15h às 17h');

DROP PROCEDURE IF EXISTS `sp_insert_teacher`;
