USE `carecahub`;

DROP PROCEDURE IF EXISTS `sp_insert_student`;

DELIMITER //
CREATE PROCEDURE `sp_insert_student`(
  IN p_id INT,
  IN p_registration INT,
  IN p_classroom CHAR(1)
)
BEGIN
  INSERT INTO `Student` (`id`, `registration`, `classroom`)
  VALUES (p_id, p_registration, p_classroom);
END //
DELIMITER ;

CALL `sp_insert_student`(2, 20001, 'A');
CALL `sp_insert_student`(3, 20002, 'A');
CALL `sp_insert_student`(4, 20003, 'B');
CALL `sp_insert_student`(5, 20004, 'B');
CALL `sp_insert_student`(6, 20005, 'C');

DROP PROCEDURE IF EXISTS `sp_insert_student`;
