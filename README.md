# Atividade 15 — Fetch API e XHR

Exemplo local de AJAX com JavaScript puro, usando XMLHttpRequest (XHR) e Fetch
API. O servidor foi implementado em Python com a biblioteca padrão.

## Executar

Abra o PowerShell nesta pasta e inicie o servidor:

```powershell
python servidor.py
```

Se o comando `python` não estiver disponível, use:

```powershell
py -3 servidor.py
```

Abra [http://127.0.0.1:8000/](http://127.0.0.1:8000/) no navegador. Mantenha
o terminal aberto enquanto usa a página; pressione `Ctrl+C` para encerrar.

## Recursos disponíveis

| Método e rota | Resposta | Uso |
|---|---|---|
| `GET /` | HTTP 200, página HTML | Interface da atividade |
| `GET /script.js` | HTTP 200, JavaScript | Código da interface |
| `GET /api/alunos/` | HTTP 200, array JSON | Testes de sucesso com XHR e Fetch |
| `GET /api/erro/404` | HTTP 404, objeto JSON | Demonstração de erro HTTP |
| `GET /api/erro/500` | HTTP 500, objeto JSON | Exemplo adicional de erro HTTP |
| `GET /api/erro/json` | HTTP 200, JSON inválido | Demonstração de erro de análise |

O botão **Demonstrar Erros** executa uma requisição Fetch que recebe HTTP 404
e uma requisição XHR cuja resposta não pode ser interpretada como JSON. A
interface informa o status HTTP e a mensagem para cada resposta.

## Conceitos demonstrados

- XHR usa eventos como `load`, `error` e `timeout` para tratar a resposta.
- Fetch retorna uma Promise. Uma resposta HTTP 404/500 não rejeita a Promise;
  por isso o código verifica `response.ok`.
- Uma resposta pode ter status HTTP 200 e ainda falhar ao ser interpretada,
  por exemplo, se o corpo não contiver JSON válido.
- Os dados são inseridos na página como texto, sem interpretar o conteúdo
  recebido como HTML.

Não é necessário instalar pacotes ou usar um ambiente virtual.
