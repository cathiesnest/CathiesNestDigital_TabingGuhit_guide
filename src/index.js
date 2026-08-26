export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Allow the frontend to call the AI endpoint.
    if (url.pathname === "/api/chat") {
      if (request.method !== "POST") {
        return new Response(
          JSON.stringify({ error: "Method not allowed." }),
          {
            status: 405,
            headers: {
              "Content-Type": "application/json"
            }
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
              headers: {
                "Content-Type": "application/json"
              }
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
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
        }

        const geminiResponse = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
            encodeURIComponent(env.GEMINI_API_KEY),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text:
                        "You are the AI Co-Pilot for Tabing Guhit, a free digital toolbox for career exploration, learning, personal planning, and growth. Give practical, encouraging, concise answers. Do not provide professional medical, legal, or financial advice. User message: " +
                        message
                    }
                  ]
                }
              ]
            })
          }
        );

        const data = await geminiResponse.json();

        if (!geminiResponse.ok) {
          console.error("Gemini API error:", data);

          return new Response(
            JSON.stringify({
              error: "The AI service could not respond right now."
            }),
            {
              status: 502,
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
        }

        const answer =
          data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!answer) {
          return new Response(
            JSON.stringify({
              error: "The AI service returned an empty response."
            }),
            {
              status: 502,
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
        }

        return new Response(
          JSON.stringify({
            response: answer
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      } catch (error) {
        console.error("AI request error:", error);

        return new Response(
          JSON.stringify({
            error: "Unable to process the AI request."
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
    }

    // Serve the static Tabing Guhit website.
    return env.ASSETS.fetch(request);
  }
};
