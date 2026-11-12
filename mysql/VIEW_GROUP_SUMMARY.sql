USE carecahub;

CREATE OR REPLACE VIEW view_group_summary AS
SELECT
    g.id AS group_id,
    g.friendlyId AS group_name,
    MAX(
        CASE
            WHEN gm.is_leader = 1 THEN u.name
            ELSE NULL
        END
    ) AS leader_name,
    COUNT(DISTINCT gm.student_id) AS member_count,
    p.name AS project_name,
    COUNT(DISTINCT r.id) AS repository_count
FROM `Group` g

-- Relacionamento N:M entre grupos e estudantes
LEFT JOIN GroupMember gm
    ON gm.group_id = g.id

-- Relacionamento 1:1 entre Student e User
LEFT JOIN Student s
    ON s.id = gm.student_id
LEFT JOIN `User` u
    ON u.id = s.id

-- Relacionamento 1:1 entre Group e Project
LEFT JOIN Project p
    ON p.id = g.project_id

-- Relacionamento 1:N entre Project e Repository
LEFT JOIN Repository r
    ON r.project_id = p.id

GROUP BY
    g.id,
    g.friendlyId,
    p.id,
    p.name;
