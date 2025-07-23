# Discord Data Pipeline - Mini Projeto AWS

Pipeline simples que coleta mensagens do Discord e armazena no AWS S3.

## Formato dos dados

Cada linha é uma mensagem JSON:

```json
{"id": "123", "conteudo": "texto", "autor": {"nome": "usuario"}, "data": "2025-01-01"}
```

## Arquitetura

```
Discord API → Script Node.js → AWS S3
```

## Estrutura

```
├── config/s3.js           # Config AWS
├── scripts/
│   ├── fetchDiscordMessages.js  # Busca mensagens
│   └── uploadToS3.js            # Upload S3
├── index.js               # Executa tudo
└── .env                   # Variáveis
```

## Objetivos AWS

- Usar S3 para armazenamento
- Integrar com AWS SDK
- Criar pipeline de dados básico
