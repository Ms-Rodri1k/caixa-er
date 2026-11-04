# Definição de escopo

## Decisões

- O sistema será um registrador de entradas de caixa.
- Não haverá cadastro de produtos.
- Não haverá estoque.
- Não haverá carrinho ou itens de venda.
- Não haverá leitura de código de barras.
- As vendas continuarão usando valor, descrição opcional e forma de pagamento.
- As formas atuais são Dinheiro, PIX e Cartão.
- Não serão criadas sessões de caixa neste momento.

## Limpeza realizada

Foram removidos os componentes que não pertencem ao fluxo definido:

- `CartTable.jsx`
- `CartSummary.jsx`
- `ProductCatalog.jsx`
- `BarcoderScanner.jsx`

## Melhorias implementadas depois da definição inicial

- A identidade autenticada passou a ser usada automaticamente como operador.
- O estorno passou a exigir confirmação.
- Foi adicionado o fechamento diário simples.

## Próximos pontos opcionais

- Avaliar suporte offline;
- Adicionar validações e testes automatizados;
- Adicionar conferência física, saldo inicial, sangria ou suprimento, se
  necessário.
