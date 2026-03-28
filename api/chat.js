export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ reply: "Missing API Key." });

  const userText = messages[messages.length - 1].content;
  
  // We use a "Double-Instruction" method to prevent the AI from staying silent
  const prompt = `
    You are a professional assistant for The Crown Cut Barbershop. 
    DATA: Haircut $45, Shave $55, Beard $35.
    USER QUESTION: ${userText}
    TASK: Answer the question using the DATA provided. 
    FORMAT: Return your answer in a JSON object like this: {"answer": "your text here"}
  `;

  try {
    // Using gemini-3.1-flash-lite-preview as it is the most stable 2026 model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1, // Extreme low temp to stop the "thinking" from timing out
          response_mime_type: "application/json" // Force JSON mode to bypass silent blocks
        }
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates.content) {
      const jsonResponse = JSON.parse(data.candidates.content.parts.text);
      res.status(200).json({ reply: jsonResponse.answer });
    } else {
      // If the AI still refuses, we show the exact reason from Google
      const reason = data.candidates?.?.finishReason || "UNKNOWN_ERROR";
      res.status(200).json({ reply: `System Block: ${reason}. Check AI Studio for account restrictions.` });
    }
  } catch (error) {
    res.status(500).json({ reply: "Connection failed. Please check your Vercel logs." });
  }
}
