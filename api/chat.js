export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ reply: "Missing API Key in Vercel settings." });
  }

  const userText = messages[messages.length - 1].content;
  const instruction = "You are a helpful barber assistant at The Crown Cut. Prices: Cut $45, Shave $55, Beard $35. Answer briefly: ";

  try {
    // UPDATED URL: Changed v1beta to v1
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: instruction + userText }]
        }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates.content) {
      const aiResponse = data.candidates.content.parts.text;
      res.status(200).json({ reply: aiResponse });
    } else if (data.error) {
      res.status(200).json({ reply: "Google Error: " + data.error.message });
    } else {
      res.status(200).json({ reply: "AI received but didn't answer. Check safety settings." });
    }
  } catch (error) {
    res.status(500).json({ reply: "Connection failed. Check Vercel logs." });
  }
}
