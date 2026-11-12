USE carecahub;

-- =============================================
-- TESTE 1: Consultar tickets ativos do projeto 1
-- Resultado esperado: 2
-- =============================================

SELECT
    function_project_ticket_count(1) AS total_tickets_projeto_1;


-- =============================================
-- TESTE 2: Consultar tickets ativos do projeto 2
-- Resultado esperado: 2
-- =============================================

SELECT
    function_project_ticket_count(2) AS total_tickets_projeto_2;


-- =============================================
-- TESTE 3: Consultar tickets ativos do projeto 3
-- Resultado esperado: 2
-- =============================================

SELECT
    function_project_ticket_count(3) AS total_tickets_projeto_3;


-- =============================================
-- TESTE 4: Consultar todos os projetos
-- e suas respectivas quantidades de tickets
-- =============================================

SELECT
    p.id AS project_id,
    p.name AS project_name,
    function_project_ticket_count(p.id) AS active_tickets
FROM Project p
WHERE p.deleted_at IS NULL
ORDER BY p.id;


-- =============================================
-- TESTE 5: Comparar a Function com COUNT(*)
-- =============================================

SELECT
    p.id AS project_id,
    p.name AS project_name,

    function_project_ticket_count(p.id) AS function_result,

    (
        SELECT COUNT(*)
        FROM Ticket t
        WHERE t.project_id = p.id
          AND t.deleted_at IS NULL
    ) AS count_result

FROM Project p
WHERE p.deleted_at IS NULL
ORDER BY p.id;
