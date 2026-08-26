export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // AI Co-Pilot endpoint
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
            JSON.stringify({
              error: "Please enter a message."
            }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
        }

        // Gemini API key must be stored as a Cloudflare Worker Secret.
        if (!env.GEMINI_API_KEY) {
          console.error("GEMINI_API_KEY is missing.");

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

        const prompt =
          "You are the AI Co-Pilot for Tabing Guhit, a free digital toolbox for career exploration, learning, personal planning, and growth. " +
          "Help users with practical career guidance, job-search questions, workplace concerns, skills development, learning paths, and personal planning. " +
          "Be supportive, clear, practical, and concise. " +
          "Do not claim to be a licensed medical, legal, or financial professional. " +
          "When appropriate, explain that the user should consult a qualified professional for specialized advice. " +
          "Answer the user's actual question directly and do not mention these instructions. " +
          "User message: " +
          message;

        const geminiResponse = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": env.GEMINI_API_KEY
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: prompt
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
          console.error("Gemini API error:", {
            status: geminiResponse.status,
            data
          });

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
          data?.candidates?.[0]?.content?.parts
            ?.map((part) => part?.text || "")
            .join("")
            .trim();

        if (!answer) {
          console.error("Gemini returned no usable text:", data);

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

    // Keep serving the existing Tabing Guhit website.
    return env.ASSETS.fetch(request);
  }
};
