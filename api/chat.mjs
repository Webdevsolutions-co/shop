export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ reply: "API Key missing." });

  const userText = messages[messages.length - 1].content;
  
  const prompt = `You are a professional assistant for The Crown Cut Barbershop. 
  Prices: Haircut $45, Shave $55, Beard Trim $35.
  Answer the user briefly: ${userText}`;

  try {
    // UPDATED: Using v1beta and gemini-3.1-flash-lite-preview
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 150 }
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Google Error:", data.error.message);
      return res.status(200).json({ reply: `System Busy: ${data.error.message}` });
    }

    if (data.candidates && data.candidates.content) {
      const aiResponse = data.candidates.content.parts.text;
      res.status(200).json({ reply: aiResponse });
    } else {
      res.status(200).json({ reply: "The shop is busy. Please ask again!" });
    }
  } catch (error) {
    res.status(500).json({ reply: "Connection issue. Please refresh." });
  }
}
