USE carecahub;

-- Iniciar transação
START TRANSACTION;

-- Consultar os membros antes da exclusão
SELECT
    student_id,
    group_id,
    is_leader
FROM GroupMember
WHERE group_id = 1;

-- Remover Bruno Lima do grupo CarecaHub
DELETE FROM GroupMember
WHERE student_id = 3
  AND group_id = 1;

-- Consultar os membros após a exclusão
SELECT
    student_id,
    group_id,
    is_leader
FROM GroupMember
WHERE group_id = 1;

-- Restaurar os dados originais
ROLLBACK;

-- Confirmar a restauração
SELECT
    student_id,
    group_id,
    is_leader
FROM GroupMember
WHERE group_id = 1;