USE carecahub;

CREATE OR REPLACE VIEW view_project_dashboard AS
SELECT
    p.id AS project_id,
    p.name AS project_name,
    p.dependency_manager,
    p.repository_type,
    g.id AS group_id,
    g.friendlyId AS group_name,
    ga.leader_name,
    COALESCE(ga.member_count, 0) AS member_count,
    COALESCE(ra.repository_count, 0) AS repository_count,
    COALESCE(ta.active_ticket_count, 0) AS active_ticket_count,
    COALESCE(ta.open_ticket_count, 0) AS open_ticket_count,
    COALESCE(ta.overdue_ticket_count, 0) AS overdue_ticket_count,
    ta.next_due_date
FROM Project p
LEFT JOIN `Group` g
    ON g.project_id = p.id
    AND g.deleted_at IS NULL
LEFT JOIN (
    SELECT
        gm.group_id,
        COUNT(DISTINCT gm.student_id) AS member_count,
        MAX(CASE WHEN gm.is_leader = 1 THEN u.name END) AS leader_name
    FROM GroupMember gm
    INNER JOIN Student s
        ON s.id = gm.student_id
    INNER JOIN `User` u
        ON u.id = s.id
        AND u.deleted_at IS NULL
    GROUP BY gm.group_id
) ga
    ON ga.group_id = g.id
LEFT JOIN (
    SELECT
        r.project_id,
        COUNT(*) AS repository_count
    FROM Repository r
    WHERE r.deleted_at IS NULL
    GROUP BY r.project_id
) ra
    ON ra.project_id = p.id
LEFT JOIN (
    SELECT
        t.project_id,
        COUNT(*) AS active_ticket_count,
        SUM(CASE WHEN t.`column` <> 'Concluído' THEN 1 ELSE 0 END) AS open_ticket_count,
        SUM(
            CASE
                WHEN t.`column` <> 'Concluído'
                    AND t.due_date IS NOT NULL
                    AND t.due_date < CURRENT_TIMESTAMP
                THEN 1
                ELSE 0
            END
        ) AS overdue_ticket_count,
        MIN(
            CASE
                WHEN t.`column` <> 'Concluído' THEN t.due_date
            END
        ) AS next_due_date
    FROM Ticket t
    WHERE t.deleted_at IS NULL
    GROUP BY t.project_id
) ta
    ON ta.project_id = p.id
WHERE p.deleted_at IS NULL;
