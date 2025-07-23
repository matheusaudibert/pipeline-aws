<p align="center">
  <img src="https://static.cdnlogo.com/logos/d/64/discord.png" alt="Discord" height="50"/>
  <img src="https://cdn.worldvectorlogo.com/logos/amazon-s3-simple-storage-service.svg" alt="Amazon S3" height="50"/>
  <img src="https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/1/aws-glue-9ztw380gkkd1g54iwwsq7.png/aws-glue-g9i4j0s3igbjmai4vernz9.png?_a=DATAg1AAZAA0" alt="AWS Glue" height="50"/>
  <img src="https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/1/aws-athena-hv6gsv93ozj2o0gsxdtg6m.png/aws-athena-jan6k55udjsv6va5uwobn.png?_a=DATAg1AAZAA0" alt="AWS Athena" height="50"/>
  <img src="https://cdn.worldvectorlogo.com/logos/amazon-quicksight.svg" alt="Amazon QuickSight" height="50"/>
</p>

# Discord Data Pipeline - Mini Projeto AWS

Pipeline simples que coleta mensagens do Discord e armazena no AWS S3 e posteriormentes fazer fazer ETL com Glue, Querys com Athena e Dashboards com QuickSight.

## Formato dos dados

Cada linha é uma mensagem JSON:

```json
{"id": "123", "conteudo": "texto", "autor": {"nome": "usuario"}, "data": "2025-01-01"}
```

## Arquitetura

```
Discord API → Script Node.js → AWS S3 (→ Glue Crawler → Athena Query → QuickSight)
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
