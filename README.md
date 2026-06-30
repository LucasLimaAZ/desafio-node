# Desafio Node

## Descrição

API RESTful para consultar os produtores com o menor e maior intervalo entre dois prêmios consecutivos na categoria "Pior Filme" do Golden Raspberry Awards.

## Estrutura

- `Movielist.csv`: dados originais dos filmes
- `src/db.js`: inicialização do banco em memória e consultas
- `src/app.js`: configuração das rotas Express
- `src/index.js`: ponto de entrada da aplicação
- `test/integration.test.js`: testes de integração

## Requisitos

- Node.js 18+ recomendado
- Nenhuma instalação externa de banco é necessária

## Instalação

```bash
cd c:/wamp64/www/desafio-node
npm install
```

## Executando a aplicação

```bash
npm start
```

A aplicação roda em `http://localhost:3000`.

## Endpoint

- `GET /producer-intervals`

Exemplo de resposta:

```json
{
  "min": [
    {
      "producer": "Producer 1",
      "interval": 1,
      "previousWin": 2008,
      "followingWin": 2009
    }
  ],
  "max": [
    {
      "producer": "Producer 1",
      "interval": 99,
      "previousWin": 1900,
      "followingWin": 1999
    }
  ]
}
```

## Testes de integração

```bash
npm test
```

## Observações

- O banco de dados é carregado em memória no startup.
- O CSV é lido apenas na inicialização.
