export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ reply: "Configuration Error." });

  const userText = messages[messages.length - 1].content;
  
  // PROFESSIONAL PERSONA: Clear, respectful, and direct
  const systemInstruction = `
    ROLE: Front-desk assistant for The Crown Cut.
    PRICES: Haircut $45, Shave $55, Beard Trim $35.
    TONE: Professional, polite, and efficient.
    RULES: 
    1. Provide direct answers regarding services and pricing. 
    2. Use full, grammatically correct sentences.
    3. Do not use slang, "AI" disclaimers, or informal language.
  `;

  try {
    // Using the stable 2026 endpoint for high reliability
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-3-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemInstruction }] },
          { role: "model", parts: [{ text: "Understood. I will act as the professional assistant for The Crown Cut." }] },
          { role: "user", parts: [{ text: userText }] }
        ],
        generationConfig: {
          temperature: 0.3, // Lower temperature = more professional/consistent
          maxOutputTokens: 250
        },
        // Forcing safety filters OFF to stop the "Refusal" error
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "OFF" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "OFF" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "OFF" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "OFF" }
        ]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates.content) {
      const aiResponse = data.candidates.content.parts.text;
      res.status(200).json({ reply: aiResponse });
    } else {
      // If the AI refuses, we show the real reason for a split second to fix it
      const reason = data.candidates?.?.finishReason || "UNKNOWN";
      res.status(200).json({ reply: `Service temporarily unavailable (${reason}). Please try again.` });
    }
  } catch (error) {
    res.status(500).json({ reply: "Network error. Please refresh the page." });
  }
}
