USE carecahub;

SELECT
    student_id,
    group_id,
    is_leader
FROM GroupMember
WHERE group_id = 1;

UPDATE GroupMember
SET is_leader = 1
WHERE student_id = 3
  AND group_id = 1;

-- TEM QUE FALHAR COM `Error Code: 1644`.
-- E A MENSAGEM DE ERRO DEVE SER: "Este grupo ja possui um lider cadastrado."