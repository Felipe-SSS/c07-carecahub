USE carecahub;

DROP FUNCTION IF EXISTS function_project_ticket_count;

DELIMITER $$

CREATE FUNCTION function_project_ticket_count(
    p_project_id INT
)
RETURNS INT
READS SQL DATA
BEGIN
    DECLARE ticket_count INT DEFAULT 0;

    SELECT COUNT(*)
    INTO ticket_count
    FROM Ticket
    WHERE project_id = p_project_id
      AND deleted_at IS NULL;

    RETURN ticket_count;
END$$

DELIMITER ;
