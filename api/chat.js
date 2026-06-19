import https from "https";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body);
    body = body || {};

    const payload = JSON.stringify({
      model: body.model || "gpt-4o-mini",
      messages: body.messages || [],
      max_tokens: body.max_tokens || 2048,
      temperature: typeof body.temperature === "number" ? body.temperature : 0.7,
    });

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: "api.openai.com",
        port: 443,
        path: "/v1/chat/completions",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + apiKey,
          "Content-Length": Buffer.byteLength(payload),
        },
      };

      const request = https.request(options, (response) => {
        let data = "";
        response.on("data", (chunk) => { data += chunk; });
        response.on("end", () => {
          try {
            resolve({ status: response.statusCode, body: JSON.parse(data) });
          } catch (e) {
            reject(new Error("Resposta inválida da OpenAI: " + data.slice(0, 300)));
          }
        });
      });

      request.on("error", reject);
      request.write(payload);
      request.end();
    });

    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
