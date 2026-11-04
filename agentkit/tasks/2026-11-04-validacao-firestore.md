# Validação do Firestore

## Resultado

As regras do Firestore foram publicadas no projeto Firebase e o fluxo
principal foi validado manualmente.

## Cenários testados

- Login com usuário cadastrado no Firebase;
- Criação de uma venda;
- Exibição da venda no histórico;
- Estorno da venda;
- Remoção da venda após o estorno.

## Decisão sobre o estorno

O estorno continuará excluindo definitivamente o documento neste momento. Essa
decisão foi considerada adequada para a operação independente atual.

Uma futura evolução poderá substituir a exclusão por um status de estorno com
data, usuário e motivo, caso seja necessário manter auditoria.
