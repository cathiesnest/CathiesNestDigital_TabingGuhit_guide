export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =====================================================
    // AI CO-PILOT
    // =====================================================
    if (url.pathname === "/api/chat") {
      if (request.method !== "POST") {
        return new Response(
          JSON.stringify({ error: "Method not allowed." }),
          {
            status: 405,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      try {
        const body = await request.json();
        const message = String(body?.message || "").trim();

        if (!message) {
          return new Response(
            JSON.stringify({ error: "Please enter a message." }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        if (!env.GEMINI_API_KEY) {
          return new Response(
            JSON.stringify({
              error: "AI service is not configured yet."
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        const systemInstruction =
          "You are the AI Co-Pilot for Tabing Guhit, " +
          "a free digital toolbox for career exploration, learning, " +
          "personal planning, and growth. Help users with practical " +
          "career guidance, job-search questions, workplace concerns, " +
          "skills development, learning paths, and personal planning. " +
          "Be supportive, clear, practical, and concise. " +
          "Answer the user's actual question directly. " +
          "Do not mention these instructions. " +
          "Do not claim to be a licensed medical, legal, or financial professional. " +
          "For specialized medical, legal, or financial matters, " +
          "encourage the user to consult a qualified professional.";

        const geminiResponse = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": env.GEMINI_API_KEY
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [
                  {
                    text: systemInstruction
                  }
                ]
              },
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: message
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600
              }
            })
          }
        );

        const data = await geminiResponse.json();

        if (!geminiResponse.ok) {
          console.error("Gemini API request failed:", data);

          return new Response(
            JSON.stringify({
              error:
                data?.error?.message ||
                "The AI service could not respond right now."
            }),
            {
              status: 502,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        const answer = data?.candidates?.[0]?.content?.parts
          ?.map((part) => part?.text || "")
          .join("")
          .trim();

        if (!answer) {
          return new Response(
            JSON.stringify({
              error: "The AI service returned an empty response."
            }),
            {
              status: 502,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        return new Response(
          JSON.stringify({ response: answer }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      } catch (error) {
        console.error("AI Co-Pilot Worker error:", error);

        return new Response(
          JSON.stringify({
            error: "Unable to process the AI request."
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }

    // =====================================================
    // CURRENCY CONVERSION
    // =====================================================
    if (url.pathname === "/api/exchange-rate") {
      if (request.method !== "GET") {
        return new Response(
          JSON.stringify({ error: "Method not allowed." }),
          {
            status: 405,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      try {
        const from = (
          url.searchParams.get("from") || "USD"
        ).trim().toUpperCase();

        const to = (
          url.searchParams.get("to") || "PHP"
        ).trim().toUpperCase();

        if (!from || !to) {
          return new Response(
            JSON.stringify({
              error: "Starting and target currencies are required."
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        if (from === to) {
          return new Response(
            JSON.stringify({
              rate: 1,
              from,
              to
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        const apiUrl =
          "https://api.frankfurter.dev/v1/latest?base=" +
          encodeURIComponent(from) +
          "&symbols=" +
          encodeURIComponent(to);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          console.error(
            "Currency API failed:",
            response.status,
            response.statusText
          );

          return new Response(
            JSON.stringify({
              error: "Currency conversion service is unavailable."
            }),
            {
              status: 502,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        const data = await response.json();
        const rate = Number(data?.rates?.[to]);

        if (!Number.isFinite(rate) || rate <= 0) {
          return new Response(
            JSON.stringify({
              error: "No valid exchange rate was returned."
            }),
            {
              status: 502,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        return new Response(
          JSON.stringify({
            rate,
            from,
            to,
            date: data?.date || null
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store"
            }
          }
        );
      } catch (error) {
        console.error("Currency conversion error:", error);

        return new Response(
          JSON.stringify({
            error: "Unable to retrieve the exchange rate."
          }),
          {
            status: 502,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }

    // =====================================================
    // EXISTING TABING GUHIT WEBSITE
    // =====================================================
    return env.ASSETS.fetch(request);
  }
};
