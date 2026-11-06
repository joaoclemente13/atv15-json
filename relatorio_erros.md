# Relatório de erros — Aula 15: Fetch API e XHR

## Ambiente e execução

O servidor da atividade usa somente a biblioteca padrão do Python e é iniciado
com `python servidor.py`. A página deve ser aberta por
`http://127.0.0.1:8000/` para que as chamadas à API usem a mesma origem.

## Cenário 1 — Resposta HTTP 404 com Fetch

**Requisição:** `GET /api/erro/404`

**Resposta esperada:** HTTP `404 Not Found` com um objeto JSON que explica que
o recurso não foi encontrado.

**Comportamento observado pela aplicação:** Fetch recebe normalmente a
resposta; o status 404, por si só, não rejeita a Promise. O código verifica
`response.ok` e apresenta a falha HTTP ao usuário.

**Correção/conceito:** verificar `response.ok` (ou `response.status`) antes de
tratar a resposta como sucesso.

## Cenário 2 — Corpo JSON malformado com XMLHttpRequest

**Requisição:** `GET /api/erro/json`

**Resposta esperada:** HTTP `200 OK`, com corpo intencionalmente incompleto:

```text
{"erro": "JSON intencionalmente malformado"
```

**Erro esperado no navegador:** `JSON.parse()` lança `SyntaxError` porque o
objeto JSON não foi fechado. O status HTTP continua sendo 200; o erro está no
formato do corpo, não no transporte HTTP.

**Correção/conceito:** devolver JSON válido no servidor e tratar erros de
análise separadamente dos erros HTTP e de rede.

## Cenário 3 — Falha de rede

Se o servidor estiver parado ou inacessível, as requisições não recebem um
status HTTP. XHR mostra uma falha de rede e Fetch trata a rejeição da Promise.
Inicie `servidor.py` e acesse a página pela URL local indicada no README.

## Resultado

Os cenários de erro são intencionais e podem ser reproduzidos pelo botão
**Demonstrar Erros**. O endpoint `/api/alunos/` permanece disponível para
comparar as respostas bem-sucedidas de XHR e Fetch.
