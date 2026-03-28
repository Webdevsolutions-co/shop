export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ reply: "API Key missing." });

  const userText = messages[messages.length - 1].content;
  
  // Professional 2026 Prompting Style
  const prompt = `Context: The Crown Cut Barbershop. Prices: Haircut $45, Shave $55, Beard $35.
  User: ${userText}
  Assistant: Respond professionally in one sentence.`;

  try {
    // Using the stable March 2026 endpoint
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 150 }
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates.content) {
      res.status(200).json({ reply: data.candidates.content.parts.text });
    } else {
      res.status(200).json({ reply: "I'm checking the schedule. Please ask again in a moment!" });
    }
  } catch (error) {
    res.status(500).json({ reply: "Connection issue. Please refresh the page." });
  }
}
