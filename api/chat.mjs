export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ reply: "Missing API Key." });

  const userText = messages[messages.length - 1].content;
  
  const prompt = `You are a professional assistant for The Crown Cut Barbershop. 
  Prices: Haircut $45, Shave $55, Beard Trim $35.
  Answer the user briefly: ${userText}`;

  try {
    // We are using the 'v1' stable endpoint and the 1.5-flash model 
    // because the 'gemini-3' previews are currently unstable
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 150 }
      })
    });

    const data = await response.json();

    // If Google returns an error (like a 429 or 400), we need to see it in the logs
    if (data.error) {
      console.error("Google API Error:", data.error.message);
      return res.status(200).json({ reply: `System Busy: ${data.error.message}` });
    }

    if (data.candidates && data.candidates.content) {
      const aiResponse = data.candidates.content.parts.text;
      res.status(200).json({ reply: aiResponse });
    } else {
      res.status(200).json({ reply: "The shop is busy at the moment. Please try your question again!" });
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ reply: "Network error. Please refresh." });
  }
}
