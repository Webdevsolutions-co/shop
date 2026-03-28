export default async function handler(req, res) {
  // 1. Check if the API key is actually reaching the function
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY is missing from Vercel Environment Variables");
    return res.status(500).json({ reply: "System Error: API Key not configured." });
  }

  try {
    const { messages } = req.body;
    const userText = messages[messages.length - 1].content;

    // 2. Using the current March 2026 stable preview model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are the Crown Cut Barbershop assistant. Prices: Haircut $45, Shave $55. Answer: ${userText}` }] }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates.content) {
      return res.status(200).json({ reply: data.candidates.content.parts.text });
    }
    
    throw new Error(data.error?.message || "Empty AI response");
  } catch (error) {
    console.error("FUNCTION ERROR:", error.message);
    return res.status(500).json({ reply: "I'm having trouble connecting to my brain. Try again?" });
  }
}
