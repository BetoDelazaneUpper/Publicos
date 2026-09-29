# Google Wallet — Generic Pass com Node.js

Laboratório público de **Beto Delazane** para demonstrar um fluxo mínimo de emissão de **Generic Pass** no Google Wallet.

## O que este exemplo demonstra

- Backend Node.js/Express.
- Service Account carregada somente no servidor.
- JWT assinado com `RS256`.
- `genericClasses` + `genericObjects` no payload.
- Geração da Save URL oficial:
  `https://pay.google.com/gp/v/save/<JWT>`.
- Frontend sem acesso à chave privada.

## Pré-requisitos

1. Projeto no Google Cloud.
2. Google Wallet API habilitada.
3. Issuer no Google Wallet Business Console.
4. Service Account autorizada no Issuer.
5. Node.js 20+.

Documentação oficial:

- https://developers.google.com/wallet
- https://codelabs.developers.google.com/add-to-wallet-web
- https://github.com/google-wallet/google-wallet-rest-samples

## Rodar

```bash
cd google-wallet/example
npm install
cp .env.example .env
```

Configure:

```env
GOOGLE_APPLICATION_CREDENTIALS=/caminho/absoluto/service-account.json
GOOGLE_WALLET_ISSUER_ID=SEU_ISSUER_ID
APP_ORIGIN=http://localhost:8080
PORT=8080
```

Depois:

```bash
npm start
```

Abra:

```text
http://localhost:8080
```

## Segurança

- Nunca versione a Service Account.
- Nunca coloque `private_key` no frontend.
- Nunca registre o JWT completo em logs de produção.
- Use Secret Manager ou mecanismo equivalente em produção.
- Valide autenticação/autorização antes de emitir passes de usuários reais.
- Gere `objectId` único por passe.
- Reutilize a Class quando o layout e comportamento forem compartilhados.

## Merchant ID x Issuer ID

O **Merchant ID do Google Pay** e o **Issuer ID do Google Wallet** são identificadores diferentes.

Este exemplo exige:

```text
GOOGLE_WALLET_ISSUER_ID
```

obtido no Google Wallet Business Console.
