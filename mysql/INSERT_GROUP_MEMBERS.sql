USE `carecahub`;

DROP PROCEDURE IF EXISTS `sp_insert_group_member`;

DELIMITER //
CREATE PROCEDURE `sp_insert_group_member`(
  IN p_student_id INT,
  IN p_group_id INT,
  IN p_is_leader TINYINT,
  IN p_joined_at DATETIME
)
BEGIN
  INSERT INTO `GroupMember` (`student_id`, `group_id`, `is_leader`, `joined_at`)
  VALUES (p_student_id, p_group_id, p_is_leader, p_joined_at);
END //
DELIMITER ;

CALL `sp_insert_group_member`(2, 1, 1, '2026-01-20 10:00:00');
CALL `sp_insert_group_member`(3, 1, 0, '2026-01-20 10:00:00');
CALL `sp_insert_group_member`(4, 2, 1, '2026-01-20 10:05:00');
CALL `sp_insert_group_member`(5, 2, 0, '2026-01-20 10:05:00');
CALL `sp_insert_group_member`(6, 3, 1, '2026-01-20 10:10:00');

DROP PROCEDURE IF EXISTS `sp_insert_group_member`;
