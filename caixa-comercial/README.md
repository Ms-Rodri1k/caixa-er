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

## Deploy no Netlify

No Netlify, importe o repositório do GitHub e configure:

- **Base directory:** `caixa-comercial`
- **Build command:** `npm run build`
- **Publish directory:** `caixa-comercial/dist`

O arquivo [`netlify.toml`](./netlify.toml) já contém o comando e a pasta de
publicação quando a base directory for definida como `caixa-comercial`.

Em **Site configuration > Environment variables**, cadastre as variáveis
`VITE_FIREBASE_*` usando os valores do arquivo `.env.local` local. Depois faça
um novo deploy. Não envie `.env.local` para o GitHub.

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

## Configuração do Firebase

Crie um arquivo `.env.local` na pasta `caixa-comercial` com a configuração do
aplicativo Web do Firebase:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

O aplicativo grava as vendas na coleção `sales`, escuta essa coleção com
`onSnapshot` e atualiza todas as páginas abertas em tempo real. O estorno
remove o documento correspondente no Firestore. O acesso exige autenticação por
e-mail e senha. Crie os usuários autorizados em **Authentication > Users** no
Firebase Console e habilite o provedor **Email/Password**.

As regras padrão estão em [`firestore.rules`](./firestore.rules). Publique-as
no projeto Firebase antes de usar a aplicação em produção:

```bash
firebase deploy --only firestore:rules
```

Cada lançamento também registra o UID e o e-mail do usuário autenticado.
As vendas novas recebem `operationDate` no formato `AAAA-MM-DD`, usando a data
local do navegador, e o histórico consulta somente os lançamentos do dia atual.
Vendas antigas criadas antes desse campo não aparecem no histórico diário.

O botão **Extrato CSV** baixa um arquivo com o resumo do dia, os totais por
forma de pagamento e todos os lançamentos exibidos no histórico. O arquivo pode
ser aberto no Excel ou no Google Planilhas.

O botão **Fechar dia** registra o resumo diário no Firestore e bloqueia novos
lançamentos e estornos para aquela data. O fechamento não pode ser alterado ou
excluído pelas regras padrão.

Sem essas variáveis, a aplicação exibe a tela de configuração e não libera o
acesso ao caixa.

Não estão incluídos integração com maquininha, emissão de cupom fiscal,
estoque ou cadastro de produtos.

## Tecnologias

- React
- Vite
- JavaScript (JSX)
- CSS
