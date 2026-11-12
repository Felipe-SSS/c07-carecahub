USE carecahub;

CREATE OR REPLACE VIEW view_ticket_board AS
SELECT
    t.id AS ticket_id,
    t.title,
    t.description,
    t.`column` AS ticket_column,
    t.due_date,
    t.created_at,
    t.updated_at,
    CASE
        WHEN t.due_date IS NULL THEN 'Sem prazo'
        WHEN t.`column` = 'Concluído' THEN 'Concluído'
        WHEN t.due_date < CURRENT_TIMESTAMP THEN 'Atrasado'
        ELSE 'No prazo'
    END AS due_status,
    p.id AS project_id,
    p.name AS project_name,
    g.id AS group_id,
    g.friendlyId AS group_name,
    la.leader_name,
    creator.id AS creator_id,
    creator.name AS creator_name,
    creator.email AS creator_email,
    assignee.id AS assignee_id,
    assignee.name AS assignee_name,
    assignee.email AS assignee_email
FROM Ticket t
INNER JOIN Project p
    ON p.id = t.project_id
    AND p.deleted_at IS NULL
LEFT JOIN `Group` g
    ON g.project_id = p.id
    AND g.deleted_at IS NULL
INNER JOIN `User` creator
    ON creator.id = t.creator_id
    AND creator.deleted_at IS NULL
LEFT JOIN `User` assignee
    ON assignee.id = t.assignee_id
    AND assignee.deleted_at IS NULL
LEFT JOIN (
    SELECT
        gm.group_id,
        MAX(u.name) AS leader_name
    FROM GroupMember gm
    INNER JOIN Student s
        ON s.id = gm.student_id
    INNER JOIN `User` u
        ON u.id = s.id
        AND u.deleted_at IS NULL
    WHERE gm.is_leader = 1
    GROUP BY gm.group_id
) la
    ON la.group_id = g.id
WHERE t.deleted_at IS NULL;
