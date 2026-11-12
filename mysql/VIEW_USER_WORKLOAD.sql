USE carecahub;

CREATE OR REPLACE VIEW view_user_workload AS
SELECT
    u.id AS user_id,
    u.name AS user_name,
    u.email,
    u.github,
    CASE
        WHEN m.id IS NOT NULL THEN 'Mentor'
        WHEN t.id IS NOT NULL THEN 'Teacher'
        WHEN s.id IS NOT NULL THEN 'Student'
        ELSE 'User'
    END AS primary_role,
    COALESCE(ga.group_count, 0) AS group_count,
    COALESCE(ga.leader_group_count, 0) AS leader_group_count,
    ga.groups,
    COALESCE(ca.created_ticket_count, 0) AS created_ticket_count,
    COALESCE(aa.assigned_ticket_count, 0) AS assigned_ticket_count,
    COALESCE(aa.open_assigned_ticket_count, 0) AS open_assigned_ticket_count,
    COALESCE(aa.overdue_assigned_ticket_count, 0) AS overdue_assigned_ticket_count,
    aa.last_assigned_ticket_update
FROM `User` u
LEFT JOIN Mentor m
    ON m.id = u.id
LEFT JOIN Teacher t
    ON t.id = u.id
LEFT JOIN Student s
    ON s.id = u.id
LEFT JOIN (
    SELECT
        s.id AS user_id,
        COUNT(DISTINCT gm.group_id) AS group_count,
        COUNT(DISTINCT CASE WHEN gm.is_leader = 1 THEN gm.group_id END) AS leader_group_count,
        GROUP_CONCAT(DISTINCT g.friendlyId ORDER BY g.friendlyId SEPARATOR ', ') AS groups
    FROM Student s
    INNER JOIN GroupMember gm
        ON gm.student_id = s.id
    INNER JOIN `Group` g
        ON g.id = gm.group_id
        AND g.deleted_at IS NULL
    GROUP BY s.id
) ga
    ON ga.user_id = u.id
LEFT JOIN (
    SELECT
        t.creator_id AS user_id,
        COUNT(*) AS created_ticket_count
    FROM Ticket t
    WHERE t.deleted_at IS NULL
    GROUP BY t.creator_id
) ca
    ON ca.user_id = u.id
LEFT JOIN (
    SELECT
        t.assignee_id AS user_id,
        COUNT(*) AS assigned_ticket_count,
        SUM(CASE WHEN t.`column` <> 'Concluído' THEN 1 ELSE 0 END) AS open_assigned_ticket_count,
        SUM(
            CASE
                WHEN t.`column` <> 'Concluído'
                    AND t.due_date IS NOT NULL
                    AND t.due_date < CURRENT_TIMESTAMP
                THEN 1
                ELSE 0
            END
        ) AS overdue_assigned_ticket_count,
        MAX(t.updated_at) AS last_assigned_ticket_update
    FROM Ticket t
    WHERE t.deleted_at IS NULL
        AND t.assignee_id IS NOT NULL
    GROUP BY t.assignee_id
) aa
    ON aa.user_id = u.id
WHERE u.deleted_at IS NULL;
