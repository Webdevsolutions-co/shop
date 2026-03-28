export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ reply: "Config Error: API Key missing in Vercel." });

  const userText = messages[messages.length - 1].content;
  const systemPrompt = "You are a barber at The Crown Cut. Prices: Cut $45, Shave $55, Beard $35. Answer this briefly: ";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt + userText }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      })
    });

    const data = await response.json();

    // The "Triple Check" for a real answer
    if (data.candidates && data.candidates.content && data.candidates.content.parts) {
      res.status(200).json({ reply: data.candidates.content.parts.text });
    } else if (data.error) {
      res.status(200).json({ reply: "Google API Error: " + data.error.message });
    } else {
      // This happens if the AI blocks the response silently
      res.status(200).json({ reply: "The AI refused to answer. Try asking: 'What are your prices?'" });
    }
  } catch (error) {
    res.status(500).json({ reply: "Server Error: " + error.message });
  }
}
