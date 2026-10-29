# Guia para criar um CRUD de resource

Este guia descreve o processo adotado no resource `User` para que os demais
resources sejam implementados com o mesmo nível de consistência, segurança e
cobertura de testes. O schema SQL em `mysql/` continua sendo a fonte de
verdade; o schema Drizzle apenas fornece uma interface TypeScript tipada para
consultá-lo.

## 1. Conheça a persistência antes do endpoint

Leia a tabela correspondente no DDL e sua entidade Drizzle. Registre as
invariantes que a aplicação precisa respeitar: campos obrigatórios, limites,
defaults, enumerações, índices únicos, chaves estrangeiras e comportamento de
soft delete.

Redescubra essas regras para cada resource. Por exemplo, a existência de uma
FK pode exigir validar um resource relacionado; uma coluna `deleted_at` pode
alterar quais linhas são visíveis; e um índice único pode precisar ser
traduzido para `409 Conflict`.

## 2. Defina contratos de entrada e saída

Crie um DTO de criação com decorators de `class-validator` que expressem o
contrato HTTP, e derive o DTO de atualização com `PartialType` quando todos os
campos puderem ser opcionais em atualização. Configure no controller um
`ValidationPipe` local com `transform`, `whitelist` e
`forbidNonWhitelisted`.

Crie também uma entidade de resposta. Ela deve refletir a tipagem
`$inferSelect` do Drizzle, porém somente com os campos seguros e públicos.
Não retorne a linha do banco diretamente. No caso de `User`, a entidade omite
o hash de senha; outros resources devem avaliar seus próprios campos internos
ou sensíveis.

## 3. Escreva os testes antes da implementação

Para cada comportamento, faça o ciclo TDD:

1. escreva um teste de uma única regra observável;
2. execute-o e confirme que falha pelo comportamento ainda ausente;
3. implemente o menor código que o faça passar;
4. execute o teste focalizado e, ao concluir a tarefa, toda a suíte.

No serviço, use um fake de `DrizzleService` quando não houver banco de teste.
O fake deve representar a cadeia de consulta necessária e preservar os efeitos
que o teste observa, como valores inseridos ou atualizados. Não teste apenas a
existência de mocks: teste o resultado público, as exceções e os dados que
seriam persistidos.

## 4. Implemente o serviço com Drizzle

Injete o `DrizzleService` global; não crie pools ou conexões nos resources.
Selecione explicitamente os campos da entidade pública. Centralize consultas
repetidas, como buscar um registro ativo por identificador, e converta a linha
selecionada em sua entidade de resposta.

Defina as regras de consulta com base nas invariantes da etapa 1. Para recursos
com soft delete, leitura, update e delete normalmente filtram registros ativos;
o delete atualiza a data de remoção em vez de eliminar a linha. Avalie sempre
se uma verificação de unicidade deve considerar também registros removidos.

Capture violações de banco que tenham significado HTTP conhecido. O resource
`User`, por exemplo, converte a violação única MySQL `ER_DUP_ENTRY`/`1062` em
`ConflictException`, inclusive para disputas de concorrência que passam por
uma pré-verificação de e-mail.

## 5. Conecte o controller sem duplicar regras

O controller deve expor rotas REST, aplicar DTOs nos corpos e usar pipes de
parâmetro, como `ParseIntPipe` para identificadores numéricos. Ele delega as
regras de negócio e a persistência ao serviço. Use o status HTTP apropriado;
por exemplo, soft delete sem corpo responde `204 No Content`.

Teste a integração controller–serviço com um serviço fake: cada rota deve
encaminhar os argumentos corretos e devolver somente a entidade pública. Teste
também a configuração de validação e dos pipes que protegem a borda HTTP.

## 6. Faça a revisão de segurança e a validação final

Antes de concluir, revise:

- se cada resposta seleciona apenas campos públicos;
- se valores secretos ou internos não aparecem em listas, criações ou updates;
- se FKs, unicidade, enums e soft delete seguem o DDL;
- se exceções de infraestrutura foram traduzidas quando necessário;
- se atualizações parciais preservam campos não enviados;
- se as validações rejeitam entradas ausentes, inválidas e propriedades extras.

Execute sempre com Yarn:

```bash
yarn test
yarn build
yarn lint
yarn test:e2e
git diff --check
```

## Checklist de aceitação para um novo resource

- [ ] As invariantes da tabela e relações foram confirmadas no SQL e no
      schema Drizzle.
- [ ] DTOs validam entrada e respeitam os limites/formatos relevantes.
- [ ] A entidade de resposta deriva do select do Drizzle e expõe apenas
      campos públicos.
- [ ] Os testes foram escritos primeiro e observados em estado vermelho.
- [ ] O serviço usa o provider Drizzle global e não cria conexão própria.
- [ ] As queries respeitam relações, unicidade e a política de remoção do
      resource.
- [ ] Exceções de banco relevantes recebem uma resposta HTTP coerente.
- [ ] Campos confidenciais e valores internos não chegam à API.
- [ ] Testes, build, lint, e2e e `git diff --check` foram executados com
      Yarn.
