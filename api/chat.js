export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ reply: "API Key is missing." });

  const userText = messages[messages.length - 1].content;
  // Professional prompt that avoids 'trigger' words for the safety filter
  const instruction = "You are an assistant for The Crown Cut Barbershop. Prices: Haircut $45, Shave $55, Beard Trim $35. Provide a friendly, one-sentence answer: ";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: instruction + userText }] }],
        // This is the 'Master Key' to stop the "Refused to answer" error
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "OFF" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "OFF" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "OFF" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "OFF" }
        ]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates.content) {
      res.status(200).json({ reply: data.candidates.content.parts.text });
    } else {
      // If it still fails, it's a regional or API key issue
      res.status(200).json({ reply: "I'm having trouble connecting to my service. Please call us at (416) 555-0100!" });
    }
  } catch (error) {
    res.status(500).json({ reply: "Connection error. Please try again later." });
  }
}
