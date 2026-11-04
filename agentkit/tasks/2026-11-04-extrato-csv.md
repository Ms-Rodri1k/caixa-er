# Extrato diário em CSV

## Decisão

O extrato será baixado em CSV porque o formato abre no Excel e no Google
Planilhas, é leve e não exige dependências externas.

## Solução implementada

- Adicionado o botão **Extrato CSV** na área de lançamentos.
- O arquivo contém:
  - data do extrato;
  - total geral;
  - totais por forma de pagamento;
  - descrição, horário, pagamento, valor e operador de cada lançamento;
  - somente os lançamentos do dia exibidos na tela.
- O nome do arquivo segue o padrão:
  `extrato-caixa-AAAA-MM-DD.csv`.
- O download acontece localmente no navegador.

## Validação

- `npm run lint` passou.
- `npm run build` passou.
