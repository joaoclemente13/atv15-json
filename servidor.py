"""Servidor local da atividade sobre Fetch API e XMLHttpRequest."""

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


PASTA_ATIVIDADE = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORTA = 8000
ALUNOS = [
    {"id": 1, "nome": "Ana Souza", "curso": "ADS", "nota": 8.5},
    {"id": 2, "nome": "Carlos Lima", "curso": "ADS", "nota": 6.0},
    {"id": 3, "nome": "Maria Oliveira", "curso": "Sistemas de Informação", "nota": 9.2},
]


class AtividadeRequestHandler(BaseHTTPRequestHandler):
    """Atende a página e os endpoints de demonstração da atividade."""

    def do_GET(self):
        caminho = urlsplit(self.path).path

        if caminho == "/":
            self._servir_arquivo("index.html", "text/html; charset=utf-8")
        elif caminho == "/script.js":
            self._servir_arquivo("script.js", "text/javascript; charset=utf-8")
        elif caminho == "/api/alunos/":
            self._responder_json(200, ALUNOS)
        elif caminho == "/api/erro/404":
            self._responder_json(
                404,
                {"erro": "Erro 404 de demonstração: recurso não encontrado."},
            )
        elif caminho == "/api/erro/500":
            self._responder_json(
                500,
                {"erro": "Erro 500 de demonstração: falha simulada no servidor."},
            )
        elif caminho == "/api/erro/json":
            self._responder(
                200,
                b'{"erro": "JSON intencionalmente malformado"',
                "application/json; charset=utf-8",
            )
        else:
            self._responder_json(404, {"erro": "Rota não encontrada."})

    def do_POST(self):
        self._responder_json(405, {"erro": "Método não permitido. Use GET."}, {"Allow": "GET"})

    def do_PUT(self):
        self._responder_json(405, {"erro": "Método não permitido. Use GET."}, {"Allow": "GET"})

    def do_DELETE(self):
        self._responder_json(405, {"erro": "Método não permitido. Use GET."}, {"Allow": "GET"})

    def _servir_arquivo(self, nome_arquivo, content_type):
        caminho = PASTA_ATIVIDADE / nome_arquivo
        try:
            conteudo = caminho.read_bytes()
        except OSError:
            self._responder_json(500, {"erro": f"Não foi possível ler {nome_arquivo}."})
            return
        self._responder(200, conteudo, content_type)

    def _responder_json(self, status, dados, headers=None):
        conteudo = json.dumps(dados, ensure_ascii=False).encode("utf-8")
        self._responder(status, conteudo, "application/json; charset=utf-8", headers)

    def _responder(self, status, conteudo, content_type, headers=None):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(conteudo)))
        self.send_header("Cache-Control", "no-store")
        if headers:
            for nome, valor in headers.items():
                self.send_header(nome, valor)
        self.end_headers()
        self.wfile.write(conteudo)

    def log_message(self, formato, *args):
        print(f"{self.address_string()} - {formato % args}")


def main():
    servidor = ThreadingHTTPServer((HOST, PORTA), AtividadeRequestHandler)
    print(f"Servidor ativo em http://{HOST}:{PORTA}/")
    print("Pressione Ctrl+C para encerrar.")
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\nEncerrando o servidor...")
    finally:
        servidor.server_close()


if __name__ == "__main__":
    main()
