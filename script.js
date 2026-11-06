"use strict";

const statusElement = document.querySelector("#status");
const resultsElement = document.querySelector("#results");
const buttons = [...document.querySelectorAll(".actions button")];
const apiUrl = "/api/alunos/";

function beginAction(message) {
  buttons.forEach((button) => {
    button.disabled = true;
  });
  statusElement.dataset.kind = "";
  statusElement.textContent = message;
  resultsElement.replaceChildren();
}

function finishAction() {
  buttons.forEach((button) => {
    button.disabled = false;
  });
}

function addResult({ title, status, message, data, kind }) {
  const article = document.createElement("article");
  article.className = "result";
  article.dataset.kind = kind;

  const heading = document.createElement("p");
  const headingText = document.createElement("strong");
  headingText.textContent = title;
  heading.append(headingText);

  const statusLine = document.createElement("p");
  statusLine.textContent = `Status HTTP: ${status}`;

  const messageLine = document.createElement("p");
  messageLine.textContent = message;

  article.append(heading, statusLine, messageLine);
  if (data !== undefined) {
    const formattedData = document.createElement("pre");
    formattedData.textContent = JSON.stringify(data, null, 2);
    article.append(formattedData);
  }
  resultsElement.append(article);
}

function updateSummary(message, kind) {
  statusElement.textContent = message;
  statusElement.dataset.kind = kind;
}

function parseJson(text) {
  try {
    return { data: JSON.parse(text), error: null };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { data: undefined, error };
    }
    throw error;
  }
}

function requestWithXhr(url, title) {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.open("GET", url);
    request.timeout = 8000;

    request.onload = () => {
      const parsed = parseJson(request.responseText);
      if (parsed.error) {
        resolve({
          title,
          status: `${request.status} ${request.statusText}`.trim(),
          message: `Falha ao interpretar o JSON: ${parsed.error.message}`,
          kind: "error",
        });
        return;
      }

      const successful = request.status >= 200 && request.status < 300;
      resolve({
        title,
        status: `${request.status} ${request.statusText}`.trim(),
        message: successful ? "Requisição concluída com sucesso." : "O servidor respondeu com erro HTTP.",
        data: parsed.data,
        kind: successful ? "success" : "error",
      });
    };

    request.onerror = () => {
      resolve({
        title,
        status: "indisponível",
        message: "Falha de rede ao conectar ao servidor local.",
        kind: "error",
      });
    };

    request.ontimeout = () => {
      resolve({
        title,
        status: "timeout",
        message: "A requisição excedeu o limite de 8 segundos.",
        kind: "error",
      });
    };

    request.send();
  });
}

async function requestWithFetch(url, title) {
  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    return {
      title,
      status: "indisponível",
      message: `Falha de rede ao conectar ao servidor local: ${error.message}`,
      kind: "error",
    };
  }

  const responseText = await response.text();
  const parsed = parseJson(responseText);
  const status = `${response.status} ${response.statusText}`.trim();

  if (parsed.error) {
    return {
      title,
      status,
      message: `Falha ao interpretar o JSON: ${parsed.error.message}`,
      kind: "error",
    };
  }

  return {
    title,
    status,
    message: response.ok ? "Requisição concluída com sucesso." : "A resposta HTTP não foi bem-sucedida.",
    data: parsed.data,
    kind: response.ok ? "success" : "error",
  };
}

async function runSingleRequest(request, url, title) {
  beginAction(`Executando: ${title}`);
  try {
    const result = await request(url, title);
    addResult(result);
    updateSummary(result.message, result.kind);
  } finally {
    finishAction();
  }
}

document.querySelector("#testar-xhr").addEventListener("click", () => {
  void runSingleRequest(requestWithXhr, apiUrl, "XMLHttpRequest — lista de alunos");
});

document.querySelector("#testar-fetch").addEventListener("click", () => {
  void runSingleRequest(requestWithFetch, apiUrl, "Fetch API — lista de alunos");
});

document.querySelector("#demonstrar-erros").addEventListener("click", async () => {
  beginAction("Executando exemplos de erro HTTP e de JSON...");
  try {
    const httpError = await requestWithFetch(
      "/api/erro/404",
      "Fetch API — resposta HTTP 404",
    );
    addResult(httpError);

    const jsonError = await requestWithXhr(
      "/api/erro/json",
      "XMLHttpRequest — JSON malformado",
    );
    addResult(jsonError);

    updateSummary("Demonstração concluída: veja os dois erros apresentados.", "error");
  } finally {
    finishAction();
  }
});
