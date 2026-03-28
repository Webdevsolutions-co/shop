export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ reply: "API Key missing in Vercel." });

  const userText = messages[messages.length - 1].content;
  
  // Clean, professional instructions for the new Gemini 3.1 series
  const prompt = `Context: The Crown Cut Barbershop. Prices: Cut $45, Shave $55, Beard $35.
User Question: ${userText}
Instruction: Answer as a helpful barber in one short sentence.`;

  try {
    // UPDATED: Using the brand new Gemini 3.1 Flash-Lite (Released March 2026)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 100
        },
        // Complete safety bypass for 2026 models to prevent silent blocks
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
      // If Google still sends an empty box, this tells us why
      const errorMsg = data.error ? data.error.message : "Google returned an empty response.";
      res.status(200).json({ reply: "Status: " + errorMsg });
    }
  } catch (error) {
    res.status(500).json({ reply: "Connection failed. Check Vercel logs!" });
  }
}
