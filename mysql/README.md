# Banco de Dados CarecaHub

O banco `carecahub` centraliza usuários, seus papéis acadêmicos, projetos, grupos, repositórios e tickets. Os arquivos `INSERT_*.sql` criam uma procedure reutilizável para cada entidade, executam uma massa demonstrativa e a removem ao terminar. Assim, cada arquivo pode ser estudado ou executado separadamente, sem deixar procedures auxiliares no schema.

```mermaid
erDiagram
    User ||--o| Mentor : "especializa"
    User ||--o| Student : "especializa"
    User ||--o| Teacher : "especializa"
    Project ||--o| Group : "possui"
    Project ||--o{ Repository : "possui"
    Project ||--o{ Ticket : "contém"
    User ||--o{ Ticket : "cria"
    User o|--o{ Ticket : "recebe"
    Student ||--o{ GroupMember : "participa"
    Group ||--o{ GroupMember : "possui"
```

## Entidades

| Entidade | Chave e campos principais | Dependências |
|---|---|---|
| `User` | `id`, nome, e-mail, GitHub e datas | — |
| `Mentor` | `id`, matrícula, horário de atendimento | `User` |
| `Student` | `id`, matrícula, turma | `User` |
| `Teacher` | `id`, horário de atendimento | `User` |
| `Project` | `id`, nome, tecnologias JSON e tipo de repositório | — |
| `Group` | `id`, `friendlyId`, `project_id` | `Project` |
| `Repository` | `id`, URL GitHub, organização e `project_id` | `Project` |
| `Ticket` | `id`, projeto, criador, responsável, coluna e prazo | `Project`, `User` |
| `GroupMember` | `student_id`, `group_id`, liderança e data de entrada | `Student`, `Group` |

## Criar o banco

Requer MySQL 8 ou superior. A partir deste diretório, crie o schema e as tabelas:

```bash
mysql -u <usuario> -p < CREATE_SCHEMA_AND_TABLES.sql
```

Para recriar o banco do zero, execute antes ``DROP SCHEMA IF EXISTS `carecahub`;`` em um cliente MySQL e depois execute `CREATE_SCHEMA_AND_TABLES.sql`. Esse comando apaga todos os dados da base. A carga não deve ser executada duas vezes sobre a mesma base, pois e-mails, matrículas e relações possuem restrições de unicidade.

## Popular o banco

### Carga completa (recomendada)

Ainda no diretório `sql`, execute o orquestrador:

```bash
mysql -u <usuario> -p < RUN_ALL_INSERTS.sql
```

`RUN_ALL_INSERTS.sql` usa o comando `SOURCE`, suportado pelo cliente `mysql`, e deve ser executado a partir deste diretório para encontrar os arquivos individuais.

### Carga por etapa

Também é possível executar os scripts individualmente. Use esta ordem para respeitar todas as foreign keys:

| Ordem | Arquivo | Entidade | Depende de |
|---:|---|---|---|
| 1 | `INSERT_USERS.sql` | `User` | — |
| 2 | `INSERT_MENTORS.sql` | `Mentor` | `User` |
| 3 | `INSERT_STUDENTS.sql` | `Student` | `User` |
| 4 | `INSERT_TEACHERS.sql` | `Teacher` | `User` |
| 5 | `INSERT_PROJECTS.sql` | `Project` | — |
| 6 | `INSERT_GROUPS.sql` | `Group` | `Project` |
| 7 | `INSERT_REPOSITORIES.sql` | `Repository` | `Project` |
| 8 | `INSERT_TICKETS.sql` | `Ticket` | `Project`, `User` |
| 9 | `INSERT_GROUP_MEMBERS.sql` | `GroupMember` | `Student`, `Group` |

Exemplo de execução de uma etapa:

```bash
mysql -u <usuario> -p < INSERT_USERS.sql
```

Cada procedure é chamada pelo próprio arquivo. Os valores de IDs usados pelas especializações e relacionamentos correspondem à massa criada pelos scripts anteriores; por isso, em uma instalação nova, siga a sequência apresentada.

## Function: contagem de tickets por projeto

Os arquivos `FUNCTION_TICKET_COUNT.sql` e `TEST_FUNCTION_TICKET_COUNT.sql` tratam da function `function_project_ticket_count(p_project_id)`. Ela recebe o id de um projeto e devolve quantos tickets ativos ele possui. Um ticket é ativo quando `deleted_at` é nulo, então tickets removidos logicamente não entram na contagem.

```sql
SELECT function_project_ticket_count(1) AS total_tickets;
```

Ela também pode ser usada dentro de uma consulta maior, por exemplo para listar todos os projetos com a quantidade de tickets de cada um:

```sql
SELECT p.id, p.name, function_project_ticket_count(p.id) AS active_tickets
FROM Project p
WHERE p.deleted_at IS NULL;
```

A vantagem é concentrar em um só lugar a regra de contagem com o filtro de remoção lógica, em vez de repetir o `COUNT(*)` em várias consultas. Diferente dos scripts `INSERT_*.sql`, a function permanece no schema depois da execução.

O arquivo de teste faz cinco verificações: três consultas individuais (projetos 1, 2 e 3, com 2 tickets cada na massa de dados), uma listagem de todos os projetos e uma comparação entre o resultado da function e um `COUNT(*)` direto, cujas duas colunas devem ser iguais. Execute-o depois da carga completa e de `FUNCTION_TICKET_COUNT.sql`.

## View: resumo dos grupos

O arquivo `VIEW_GROUP_SUMMARY.sql` cria a view `view_group_summary`, que mostra os dados principais de cada grupo em uma única consulta:

- `group_id`: id do grupo.
- `group_name`: identificador amigável do grupo (`friendlyId`).
- `leader_name`: nome do líder, ou `NULL` se o grupo ainda não tiver líder.
- `member_count`: quantidade de membros do grupo.
- `project_name`: nome do projeto associado, ou `NULL` se o grupo não tiver projeto.
- `repository_count`: quantidade de repositórios do projeto do grupo.

```sql
SELECT * FROM view_group_summary;
```

Ela evita reescrever os JOINs entre `Group`, `GroupMember`, `Student`, `User`, `Project` e `Repository` sempre que for preciso listar os grupos. Como usa `LEFT JOIN`, grupos sem membros ou sem projeto continuam aparecendo, e `COUNT(DISTINCT ...)` impede que membros e repositórios sejam contados em duplicidade. Para ver dados úteis, execute-a depois da carga completa.
