# Finalização do MVP

## Melhorias implementadas

- O operador passou a ser preenchido automaticamente pelo usuário autenticado.
- O estorno exige confirmação antes de excluir a venda.
- Foi criado o fechamento diário simples:
  - salva totais e subtotais no Firestore;
  - registra data, horário e usuário responsável;
  - bloqueia novos lançamentos e estornos após o fechamento.
- As regras do Firestore também impedem novas vendas depois que o dia foi
  fechado.

## Limites mantidos

O fechamento ainda não inclui saldo inicial, conferência de dinheiro físico,
sangria ou suprimento. Esses recursos podem ser adicionados se a operação
precisar deles.
