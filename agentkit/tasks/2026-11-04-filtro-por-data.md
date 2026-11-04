# Filtro diário de vendas

## Decisão

Não criar sessões de caixa neste momento. Como a operação é independente, a
separação por dia resolve o problema principal com menos complexidade.

## Solução implementada

- Vendas novas recebem `operationDate` no formato `AAAA-MM-DD`.
- A data usa o horário local do navegador.
- O listener do Firestore consulta somente a data de operação atual.
- Os totais e o histórico passam a considerar somente as vendas do dia.
- O UID e o e-mail do usuário autenticado continuam registrados em cada venda.

Vendas antigas, criadas antes de `operationDate`, não aparecem no histórico
diário até que sejam migradas.

## Validação

- `npm run lint` passou.
- `npm run build` passou.
