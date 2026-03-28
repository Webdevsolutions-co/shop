export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ reply: "API Key is missing." });

  const userText = messages[messages.length - 1].content;
  const prompt = `Assistant for The Crown Cut. Prices: Haircut $45, Shave $55, Beard $35. Answer briefly: ${userText}`;

  try {
    // Using the stable 2026 endpoint and model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-3-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 100 }
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates.content) {
      res.status(200).json({ reply: data.candidates.content.parts.text });
    } else {
      // This tells us if it's a safety block or a server issue
      const reason = data.candidates?.?.finishReason || "EMPTY_RESPONSE";
      res.status(200).json({ reply: `System Error: ${reason}. Please refresh.` });
    }
  } catch (error) {
    res.status(500).json({ reply: "Connection failed. Please check your Vercel logs." });
  }
}
