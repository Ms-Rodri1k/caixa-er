# Caixa PDV | comercial ER

Aplicação web de ponto de venda para registrar entradas de um caixa, acompanhar os totais por forma de pagamento e consultar ou estornar lançamentos.

## Requisitos

- Node.js e npm instalados.

## Como executar

Na pasta `caixa-comercial`, instale as dependências e inicie o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

Para verificar o lint do projeto:

```bash
npm run lint
```

## Uso do caixa

- O caixa abre automaticamente em uma sessão nova, sem saldo ou vendas de demonstração.
- Informe o nome do operador no campo do rodapé. O horário de abertura é preenchido automaticamente.
- Digite o valor da venda. O campo usa teclado numérico em dispositivos móveis e formata a entrada em reais.
- Selecione Dinheiro, PIX ou Cartão e, se desejar, informe uma descrição. Sem descrição, o lançamento recebe o nome “Venda no balcão”.
- Ao lançar uma entrada, o registro aparece no início do histórico e os totais são atualizados. O formulário limpa o valor e a descrição, mantém a forma de pagamento selecionada e devolve o foco ao campo de valor.
- Use o botão de estorno junto ao lançamento para removê-lo e recalcular os totais.
- Mensagens temporárias informam o resultado da operação ou pedem um valor válido.

## O que a tela apresenta

- Cabeçalho com a marca Caixa PDV, identificação “comercial ER”, data e horário atuais e indicador visual “Online”.
- Painel com o total acumulado e subtotais de Dinheiro, PIX e Cartão.
- Formulário de novo lançamento.
- Histórico recente com descrição, horário, forma de pagamento, valor e ação de estorno.
- Histórico em formato de lista em telas pequenas; tabela em telas maiores.
- Rodapé com horário de abertura, nome editável do operador e indicação de última sincronização.

## Dados e limitações desta versão

Esta primeira versão mantém lançamentos e nome do operador somente no estado local do React. Atualizar ou fechar a página apaga os dados da sessão; não há banco de dados nem persistência em `localStorage`.

O caixa começa com saldo inicial zero. Os subtotais refletem somente os lançamentos da sessão atual. O indicador “Online” e o texto de sincronização são elementos visuais: não há verificação de conexão nem sincronização com servidor.

Não estão incluídos autenticação, integração com maquininha, emissão de cupom fiscal, estoque ou cadastro de produtos.

## Tecnologias

- React
- Vite
- JavaScript (JSX)
- CSS
