/* openai-bridge.js
 * Expõe window.claude.complete() usando a API da OpenAI,
 * mantendo a assinatura esperada pelo actions.jsx.
 *
 * ATENÇÃO: esta chave está visível no código-fonte do navegador.
 * Para uso local / interno isso é aceitável.
 * Para deploy público, substitua por um backend proxy.
 */
(function () {
  var OPENAI_API_KEY = "CHAVE_REMOVIDA";
  var OPENAI_MODEL   = "gpt-4o"; // gpt-5.5 não existe; gpt-4o é o modelo recomendado

  window.claude = {
    complete: async function (opts) {
      var messages = (opts && opts.messages) ? opts.messages : [{ role: "user", content: opts }];
      var resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + OPENAI_API_KEY,
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: messages,
          max_tokens: 2048,
          temperature: 0.7,
        }),
      });
      if (!resp.ok) {
        var errText = await resp.text();
        throw new Error("OpenAI " + resp.status + ": " + errText);
      }
      var data = await resp.json();
      return data.choices[0].message.content;
    },
  };
})();
