export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ reply: "Missing API Key in Vercel settings." });
  }

  // Get the user's message
  const userText = messages[messages.length - 1].content;
  
  // Barber shop instructions
  const instruction = "You are a helpful barber at The Crown Cut. Prices: Cut $45, Shave $55, Beard $35. Answer briefly: ";

  try {
    // UPDATED: Using Gemini 2.5 Flash on the v1 stable endpoint
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
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
      // Shows specific error message from Google if something is still wrong
      res.status(200).json({ reply: "Google Error: " + data.error.message });
    } else {
      res.status(200).json({ reply: "The AI connected but didn't return an answer. Try another question!" });
    }
  } catch (error) {
    res.status(500).json({ reply: "Connection to Google failed. Check your Vercel logs." });
  }
}
