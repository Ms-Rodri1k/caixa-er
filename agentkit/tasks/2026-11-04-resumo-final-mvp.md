# Resumo final do MVP

## Escopo concluído

O projeto foi definido como um registrador simples de entradas de caixa, sem
produtos, estoque, carrinho, itens ou sessões de caixa.

## Funcionalidades entregues

- Autenticação por e-mail e senha com Firebase;
- Regras do Firestore exigindo autenticação;
- Vendas filtradas pela data de operação;
- Operador preenchido automaticamente pelo usuário autenticado;
- Totais por forma de pagamento;
- Estorno com confirmação;
- Fechamento diário simples;
- Bloqueio de vendas e estornos após o fechamento;
- Extrato diário em CSV;
- Documentação e registros das decisões no `agentkit`.

## Validações

- Login testado com sucesso;
- Venda criada e exibida no histórico;
- Estorno testado com sucesso;
- Regras do Firestore publicadas e testadas;
- `npm run lint` passou;
- `npm run build` passou.

## Fora do escopo

- Produtos e estoque;
- Carrinho e itens;
- Código de barras;
- Sessões de caixa;
- Modo offline;
- Auditoria detalhada de estornos.
