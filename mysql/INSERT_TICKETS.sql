USE `carecahub`;

DROP PROCEDURE IF EXISTS `sp_insert_ticket`;

DELIMITER //
CREATE PROCEDURE `sp_insert_ticket`(
  IN p_project_id INT,
  IN p_assignee_id INT,
  IN p_creator_id INT,
  IN p_title VARCHAR(45),
  IN p_description TEXT,
  IN p_due_date DATETIME,
  IN p_column VARCHAR(15),
  IN p_created_at DATETIME,
  IN p_updated_at DATETIME
)
BEGIN
  INSERT INTO `Ticket` (
    `project_id`, `assignee_id`, `creator_id`, `title`, `description`, `due_date`, `column`, `created_at`, `updated_at`
  ) VALUES (
    p_project_id, p_assignee_id, p_creator_id, p_title, p_description, p_due_date, p_column, p_created_at, p_updated_at
  );
END //
DELIMITER ;

CALL `sp_insert_ticket`(1, 2, 7, 'Modelar entidades', 'Revisar as relações entre usuários, grupos e projetos.', '2026-02-01 18:00:00', 'Concluído', '2026-01-22 09:00:00', '2026-01-24 14:00:00');
CALL `sp_insert_ticket`(1, 3, 7, 'Criar API de tickets', 'Implementar operações básicas para os tickets.', '2026-02-08 18:00:00', 'Em andamento', '2026-01-22 09:10:00', '2026-01-25 10:00:00');
CALL `sp_insert_ticket`(2, 4, 8, 'Desenhar painel verde', 'Criar a primeira versão do painel de indicadores.', '2026-02-05 18:00:00', 'A fazer', '2026-01-22 09:20:00', '2026-01-22 09:20:00');
CALL `sp_insert_ticket`(2, 5, 8, 'Integrar mapa', 'Exibir os pontos de coleta no mapa.', '2026-02-12 18:00:00', 'Em andamento', '2026-01-22 09:30:00', '2026-01-26 11:00:00');
CALL `sp_insert_ticket`(3, 6, 1, 'Cadastrar produtores', 'Criar formulário de cadastro para produtores.', '2026-02-10 18:00:00', 'A fazer', '2026-01-22 09:40:00', '2026-01-22 09:40:00');
CALL `sp_insert_ticket`(3, NULL, 1, 'Revisar catálogo', 'Planejar a revisão editorial do catálogo.', NULL, 'Backlog', '2026-01-22 09:50:00', '2026-01-22 09:50:00');

DROP PROCEDURE IF EXISTS `sp_insert_ticket`;
