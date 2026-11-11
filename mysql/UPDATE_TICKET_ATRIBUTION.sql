USE carecahub;

-- Consultar o responsável atual
SELECT
    id,
    title,
    assignee_id
FROM Ticket
WHERE project_id = 1
  AND title = 'Criar API de tickets';

-- Atualizar o responsável pelo ticket
UPDATE Ticket
SET
    assignee_id = 2,
    updated_at = NOW()
WHERE project_id = 1
  AND title = 'Criar API de tickets';

-- Verificar a alteração
SELECT
    t.id,
    t.title,
    u.name AS responsible_name
FROM Ticket t
LEFT JOIN `User` u
    ON u.id = t.assignee_id
WHERE t.project_id = 1
  AND t.title = 'Criar API de tickets';