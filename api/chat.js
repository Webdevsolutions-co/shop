export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ reply: "API Key is missing in Vercel!" });
  }

  const userMessage = messages[messages.length - 1].content;

  // Simplified instructions for the AI
  const systemPrompt = "You are a helpful barber at The Crown Cut. Prices: Cut $45, Shave $55, Beard $35. Answer this question briefly: ";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: systemPrompt + userMessage }]
        }]
      })
    });

    const data = await response.json();

    // This part checks the "box" Google sends back
    if (data.candidates && data.candidates.content && data.candidates.content.parts) {
      const aiResponse = data.candidates.content.parts.text;
      res.status(200).json({ reply: aiResponse });
    } else {
      // If Google sends an error, show it here
      const errorDetail = data.error ? data.error.message : "AI refused to answer";
      res.status(200).json({ reply: "Google Gemini says: " + errorDetail });
    }
  } catch (error) {
    res.status(500).json({ reply: "The connection to the AI failed entirely." });
  }
}
