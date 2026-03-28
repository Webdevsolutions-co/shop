export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ reply: "Error: API Key is missing in Vercel settings!" });
  }

  // Get what the user just typed
  const userMessage = messages[messages.length - 1].content;

  // Your Barbershop Rules
  const systemPrompt = "You are a helpful assistant for The Crown Cut Barbershop. Prices: Signature Cut $45, Hot Towel Shave $55, Beard Sculpt $35, Combo $70, Kids Cut $28. Be brief and professional.";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: systemPrompt + " User: " + userMessage }] }]
      })
    });

    const data = await response.json();
    
    // Check if Google sent back an answer
    if (data.candidates && data.candidates.content) {
      const aiResponse = data.candidates.content.parts.text;
      // We use 'reply' here because your main.js looks for 'data.reply'
      res.status(200).json({ reply: aiResponse });
    } else {
      res.status(200).json({ reply: "I'm thinking, but I can't find the words. Try again!" });
    }
  } catch (error) {
    res.status(500).json({ reply: "The connection to my brain timed out. Check your Vercel API Key!" });
  }
}
