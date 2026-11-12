USE carecahub;

DELIMITER $$

CREATE TRIGGER trigger_validate_group_leader_insert
BEFORE INSERT ON GroupMember
FOR EACH ROW
BEGIN
    DECLARE leader_count INT;

    IF NEW.is_leader = 1 THEN

        SELECT COUNT(*)
        INTO leader_count
        FROM GroupMember
        WHERE group_id = NEW.group_id
          AND is_leader = 1;

        IF leader_count > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT =
                'Este grupo ja possui um lider cadastrado.';
        END IF;

    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trigger_validate_group_leader_update
BEFORE UPDATE ON GroupMember
FOR EACH ROW
BEGIN
    DECLARE leader_count INT;

    IF NEW.is_leader = 1 THEN

        SELECT COUNT(*)
        INTO leader_count
        FROM GroupMember
        WHERE group_id = NEW.group_id
          AND is_leader = 1
          AND NOT (
              student_id = OLD.student_id
              AND group_id = OLD.group_id
          );

        IF leader_count > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT =
                'Este grupo ja possui um lider cadastrado.';
        END IF;

    END IF;
END$$

DELIMITER ;