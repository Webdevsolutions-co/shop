export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ reply: "API Key missing." });
  }

  const userText = messages[messages.length - 1].content;
  const instruction = "You are a helpful barber at The Crown Cut. Prices: Cut $45, Shave $55, Beard $35. Answer briefly: ";

  try {
    // Using the stable v1 endpoint with Gemini 2.5 Flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: instruction + userText }] }],
        // This part stops the "AI didn't return an answer" error
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      })
    });

    const data = await response.json();

    // New 2026 Response Check
    if (data.candidates && data.candidates.content && data.candidates.content.parts) {
      const aiResponse = data.candidates.content.parts.text;
      res.status(200).json({ reply: aiResponse });
    } 
    else if (data.promptFeedback && data.promptFeedback.blockReason) {
      res.status(200).json({ reply: "Google blocked this prompt for: " + data.promptFeedback.blockReason });
    }
    else {
      // If there's a different error, show the raw message to help us debug
      const rawError = data.error ? data.error.message : "Empty response from Google";
      res.status(200).json({ reply: "Debug Info: " + rawError });
    }
  } catch (error) {
    res.status(500).json({ reply: "Connection Error: " + error.message });
  }
}
