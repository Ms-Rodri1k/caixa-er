# Problemas pendentes e perguntas de decisão

Este documento reúne os pontos que ainda precisam de definição ou implementação
antes de considerar o caixa pronto para uso real. O objetivo é servir como
checklist para uma revisão posterior.

## Resumo por prioridade

| Prioridade | Tema | Situação |
|---|---|---|
| Alta | Autenticação e regras do Firestore | Resolvido: login por e-mail/senha e regras que exigem usuário autenticado |
| Alta | Separação de caixas e dias | Resolvido parcialmente: vendas novas são filtradas pela data local; sessões de caixa não serão usadas neste momento |
| Alta | Estorno e auditoria | Aceito para o cenário atual: o estorno exclui o documento definitivamente |
| Alta | Falha de rede | Não existe fila local nem estratégia de reenvio |
| Média | Extrato diário | Resolvido: botão baixa CSV com resumo, totais e lançamentos do dia |
| Média | Fechamento de caixa | Resolvido parcialmente: fechamento diário simples bloqueia novos lançamentos e estornos |
| Média | Operador | Resolvido: cada venda usa automaticamente o usuário autenticado |
| Média | Modelo de pagamento | A tela usa três formas: Dinheiro, PIX e Cartão |
| Baixa | Limpeza e manutenção | Resolvido: componentes de carrinho, produtos e scanner removidos por decisão de escopo |

## 1. Autenticação e autorização

**Status:** resolvido. O aplicativo usa Firebase Authentication com e-mail e
senha, bloqueia a tela do caixa para usuários não autenticados e registra o UID
do usuário nas novas vendas. As regras padrão estão em
[`firestore.rules`](../firestore.rules).

**Risco tratado:** sem uma sessão autenticada, o aplicativo não libera o caixa
nem as operações do Firestore. As regras ainda precisam ser publicadas no
projeto Firebase e os usuários precisam ser cadastrados no Console.

**Perguntas futuras:**

- O caixa deverá exigir login?
- Quais perfis existirão (operador, gerente e administrador)?
- Quem poderá estornar uma venda?
- Um operador poderá visualizar vendas de todos os caixas ou apenas as próprias?
- A autenticação será por e-mail e senha, Google, PIN ou outro método?

**Próximo passo sugerido:** definir perfis e permissões mais granulares caso
sejam necessários além do acesso autenticado.

## 2. Sessão de caixa, loja e data de operação

**Status:** resolvido parcialmente. Como a operação é independente, não foi
criada uma entidade de sessão. Vendas novas recebem `operationDate` no formato
`AAAA-MM-DD`, e a consulta do histórico filtra a data local atual.

**Risco tratado:** lançamentos novos de dias anteriores não aparecem no total do
dia atual. Vendas antigas, criadas antes da implementação de `operationDate`,
precisam de migração caso devam voltar a aparecer no histórico.

**Perguntas:**

- Cada abertura deve criar uma sessão de caixa?
- O caixa deve começar com saldo inicial?
- O que acontece quando o operador fecha e abre o caixa no dia seguinte?
- Haverá mais de uma loja, terminal ou caixa?
- O histórico deverá mostrar somente a sessão atual ou permitir consultar períodos
  anteriores?
- Qual fuso horário deve definir o “dia” da operação?

**Próximo passo sugerido:** avaliar um fechamento diário simples antes de
considerar sessões, caso a operação precise de conferência.

## 3. Estorno, exclusão e auditoria

**Decisão:** para a operação independente atual, o estorno continuará removendo
definitivamente a venda do Firestore. O fluxo foi testado com sucesso após a
publicação das regras.

**Risco aceito por enquanto:** não existe histórico de quem estornou, quando
estornou ou por qual motivo. Se a operação crescer, o estorno deverá ser
alterado para preservar o lançamento com status e auditoria.

**Perguntas:**

- O estorno deve pedir confirmação?
- É obrigatório informar o motivo?
- Estorno deve ser permitido somente até o fechamento?
- O lançamento original deve permanecer como “estornado”?
- Gerentes precisam aprovar estornos?
- Deve existir uma operação separada para devolução parcial?

**Próximo passo sugerido:** trocar exclusão física por mudança de status, com
registro do usuário, horário e motivo do estorno.

## 4. Operação sem internet e sincronização

**Evidência:** quando o Firebase não está configurado ou a sincronização falha,
o formulário impede o salvamento. Não há persistência local de lançamentos
pendentes.

**Risco:** uma queda momentânea da internet impede registrar vendas e pode
causar retrabalho ou divergência no caixa. O indicador “Offline” informa o
estado, mas não oferece recuperação automática.

**Perguntas:**

- O caixa precisa continuar registrando vendas offline?
- Qual é a fonte de verdade em caso de conflito entre dois dispositivos?
- O usuário deve poder reenviar lançamentos pendentes manualmente?
- Como a aplicação deve informar que uma venda ainda não foi sincronizada?

**Próximo passo sugerido:** definir uma fila local com identificador idempotente,
estado de sincronização e reenvio seguro quando a conexão voltar.

## 5. Fechamento e conferência do caixa

**Status:** resolvido parcialmente. O botão de fechamento diário salva os
totais, formas de pagamento, data, horário e usuário responsável, bloqueando
novos lançamentos e estornos. Ainda não há conferência física, saldo inicial,
sangria ou suprimento.

**Perguntas:**

- O operador deverá informar quanto encontrou em dinheiro no fechamento?
- O sistema deve calcular sobra ou falta?
- Serão registrados depósitos, sangrias e suprimentos?
- O fechamento ficará bloqueado após confirmado?
- Será necessário emitir ou exportar um relatório?
- O fechamento deverá ser diário, por turno ou por sessão?

## 6. Identificação do operador

**Status:** resolvido. O operador da venda é preenchido automaticamente com o
nome do usuário autenticado ou, na ausência de nome, seu e-mail.

O campo manual foi removido para evitar identificação incorreta.

## 7. Formas de pagamento

**Evidência:** **Decisão:** a tela principal trabalha com `Dinheiro`, `PIX` e `Cartão`. Não
serão adicionados produtos, itens ou estoque neste projeto.

**Limite atual:** não há suporte a venda com mais de uma forma de pagamento,
parcelas ou separação entre débito e crédito.

**Perguntas:**

- O valor deve ser sempre uma entrada simples ou haverá itens, descontos e
  acréscimos?

## 8. Produtos, itens e estoque

**Decisão:** produtos, itens, catálogo, código de barras e estoque estão fora
do escopo. A aplicação continuará registrando entradas simples com valor,
forma de pagamento e descrição opcional.

Os componentes antigos relacionados a esse fluxo foram removidos.

## 9. Validações e limites operacionais

**Pontos para definir:**

- valor máximo por lançamento;
- limite de caracteres para descrição;
- permissão para valores muito altos;
- obrigatoriedade de descrição em operações não convencionais;
- tratamento de valores duplicados enviados por duplo clique;
- confirmação para sair ou recarregar com uma operação pendente.

## 10. Relatórios, exportação e retenção

Ainda não há relatório diário, busca, filtros, exportação CSV/PDF ou política de
retenção.

**Perguntas:**

- Quem precisa consultar os dados e por quanto tempo?
- O relatório deve ser por operador, sessão, forma de pagamento ou período?
- Será necessário exportar para contabilidade?
- Os dados deverão ser arquivados ou mantidos indefinidamente?

## 11. Componentes e manutenção

Os componentes antigos de carrinho, catálogo, produtos e leitura de código de
barras foram removidos, pois não fazem parte do escopo definido.

Também vale adicionar testes para:

- conversão e validação de valores em reais;
- cálculo dos totais por forma de pagamento;
- ordenação dos lançamentos;
- comportamento de erro e reconexão do Firestore;
- permissão e fluxo de estorno;
- separação de sessões e datas.

## Ordem recomendada para resolver

1. ~~Definir autenticação, perfis e regras do Firestore.~~ Login básico e regras
   de autenticação implementados; perfis granulares continuam como decisão futura.
2. Definir sessão de caixa, loja/terminal e regra de data.
3. Definir o modelo de estorno e auditoria.
4. Decidir se o modo offline é obrigatório.
5. Especificar fechamento, conferência e operações de caixa.
6. Fechar o domínio da venda: pagamentos, itens, produtos e estoque.
7. Implementar relatórios, exportação e testes de regressão.
