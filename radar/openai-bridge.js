/* openai-bridge.js
 * Expõe window.claude.complete() via proxy serverless /api/chat.
 * A chave OPENAI_API_KEY fica no servidor (variável de ambiente Vercel).
 */
(function () {
  var OPENAI_MODEL = "gpt-4o-mini";

  window.claude = {
    complete: async function (opts) {
      var messages = (opts && opts.messages) ? opts.messages : [{ role: "user", content: opts }];
      var resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: OPENAI_MODEL, messages: messages, max_tokens: 2048, temperature: 0.7 }),
      });
      if (!resp.ok) {
        var errText = await resp.text();
        throw new Error("API " + resp.status + ": " + errText);
      }
      var data = await resp.json();
      return data.choices[0].message.content;
    },
  };
})();
