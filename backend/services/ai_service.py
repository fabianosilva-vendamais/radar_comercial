import json
from openai import OpenAI
from flask import current_app


class AIService:
    """Encapsula o cliente OpenAI. Sem estado — instanciar por requisição ou injetar."""

    def __init__(self):
        self._client: OpenAI | None = None

    @property
    def client(self) -> OpenAI:
        if self._client is None:
            api_key = current_app.config["OPENAI_API_KEY"]
            if not api_key:
                raise RuntimeError("OPENAI_API_KEY não configurado")
            self._client = OpenAI(api_key=api_key)
        return self._client

    def chat_completion(self, *, model: str, messages: list[dict],
                        max_tokens: int = 2048,
                        temperature: float = 0.7) -> dict:
        """
        Proxy fiel: recebe o shape exato que openai-bridge.js envia e
        devolve o dict cru do OpenAI para que o frontend não precise mudar.
        """
        response = self.client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        return response.model_dump()

    def empresa_strategy(self, empresa: dict) -> dict:
        """
        Chamada server-side do Agente 3 (Rastrear agora).
        Usado por POST /api/ai/estrategia/<id> para enriquecer uma empresa via IA.
        """
        model = current_app.config["OPENAI_MODEL"]
        prompt = self._build_agent3_prompt(empresa)
        result = self.chat_completion(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2048,
            temperature=0.7,
        )
        raw = result["choices"][0]["message"]["content"]
        return self._parse_json_response(raw)

    # -- helpers privados --

    def _build_agent3_prompt(self, e: dict) -> str:
        memoria = e.get("memoria") or {}
        objecoes = memoria.get("objecoes") or []
        motivo_perda = objecoes[0] if objecoes else e.get("motivo", "")
        dor = memoria.get("dor", "")
        timeline = memoria.get("timeline") or []
        hist = " | ".join(
            f"{t.get('data')} {t.get('tipo')}: {t.get('texto')}"
            for t in timeline
        )
        sinais_txt = "\n".join(
            f"- [{s.get('tipo')}] {s.get('titulo')} ({s.get('fonte')}, rel={s.get('relevancia')})"
            for s in (e.get("sinais") or [])
        )
        return f"""Você é um consultor sênior de vendas consultivas B2B.
Analise esta conta perdida e gere uma estratégia de reabordagem em JSON.

CONTA: {e.get('nome')} | Score atual: {e.get('score')} | Segmento: {e.get('segmento')}
MOTIVO DA PERDA: {motivo_perda}
DOR: {dor}
HISTÓRICO: {hist}
SINAIS RECENTES:
{sinais_txt}

Retorne APENAS JSON com este formato:
{{
  "score": <0-100>,
  "scoreRationale": "<justificativa do score>",
  "intencao": {{
    "oQueMudou": "<string>",
    "porqueMudou": "<string>",
    "indica": "<string>",
    "oportunidade": "<string>"
  }},
  "estrategia": {{
    "motivoAlerta": "<string>",
    "contexto": "<string>",
    "angulo": "<string>",
    "canal": "<string>",
    "canaisAlt": ["<string>"],
    "mensagem": "<string>",
    "perguntas": ["<string>"],
    "proximoPasso": "<string>"
  }}
}}"""

    def _parse_json_response(self, txt: str) -> dict:
        a, b = txt.find("{"), txt.rfind("}")
        if a < 0 or b < 0:
            raise ValueError("Resposta da IA não contém JSON válido")
        return json.loads(txt[a:b + 1])
