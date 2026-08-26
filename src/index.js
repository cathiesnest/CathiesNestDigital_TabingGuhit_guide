export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // AI Career Assistant endpoint
    if (url.pathname === "/api/chat") {
      if (request.method !== "POST") {
        return new Response(
          JSON.stringify({
            error: "Method not allowed."
          }),
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

        // GEMINI_API_KEY must be stored as a Cloudflare Worker secret.
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

        const systemInstruction = `
You are the AI Career Assistant for Tabing Guhit by CathiesNest Digital.

Tabing Guhit is a free digital toolbox focused on career exploration,
learning, personal planning, and growth.

Your role is to help users think through career concerns in a practical,
encouraging, realistic, and respectful way.

Focus especially on:
- career direction
- job-search concerns
- skills and transferable skills
- identifying strengths
- career transitions
- workplace concerns
- learning opportunities
- resume and interview preparation
- remote-work considerations
- realistic next steps
- confidence and professional growth

Keep responses concise and useful.

Do not make decisions for the user.
Do not guarantee employment, income, promotions, or career outcomes.
Do not provide professional medical, legal, or financial advice.

When appropriate, give the user 2–4 practical next steps.

User message:
${message}
        `.trim();

        const geminiResponse = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent",
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
          data?.candidates?.[0]?.content?.parts
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

    // Serve the Tabing Guhit website.
    return env.ASSETS.fetch(request);
  }
};
