# Autenticação Firebase

## Problema

O aplicativo inicializava apenas o Firestore e não identificava os usuários.
Isso impedia o uso seguro das regras do Firestore e deixava indefinido o acesso
às vendas.

## Solução implementada

- Adicionado Firebase Authentication com login por e-mail e senha.
- Criada tela de login no aplicativo.
- Usuários não autenticados não acessam o caixa.
- Adicionado botão para sair da conta.
- Adicionado estado de carregamento enquanto a sessão é verificada.
- Cada nova venda registra:
  - `createdBy`: UID do usuário autenticado;
  - `createdByEmail`: e-mail do usuário autenticado.
- Criado `firestore.rules` com:
  - leitura somente para usuários autenticados;
  - criação somente quando o UID da venda corresponde ao usuário autenticado;
  - exclusão somente para usuários autenticados;
  - atualizações bloqueadas.
- Criado `.env.local` com a configuração do aplicativo Web do Firebase.
- Atualizada a documentação do projeto e a lista de problemas pendentes.

## Arquivos principais

- `caixa-comercial/src/firebase.js`
- `caixa-comercial/src/App.jsx`
- `caixa-comercial/src/App.css`
- `caixa-comercial/firestore.rules`
- `caixa-comercial/.env.local`
- `caixa-comercial/README.md`
- `caixa-comercial/questions/problemas-pendentes.md`

## Configuração externa necessária

No Firebase Console:

1. Habilitar o provedor **Email/Password** em Authentication.
2. Criar os usuários autorizados em **Authentication > Users**.
3. Publicar as regras do Firestore:

```bash
firebase deploy --only firestore:rules
```

O arquivo `.env.local` contém configuração local e não deve ser versionado.

## Validação

- `npm run lint` passou.
- `npm run build` passou.
- Servidor Vite iniciado em `http://127.0.0.1:5173`.
- Login testado com sucesso usando o usuário cadastrado no Firebase.
