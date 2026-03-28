export default async function handler(req, res) {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ reply: "API Key missing." });

  const userText = messages[messages.length - 1].content;
  
  // THE SECRET SAUCE: Defining the "Vibe"
  const systemInstruction = `
    ROLE: You are 'Mo', a friendly, laid-back barber at The Crown Cut. 
    TONE: Casual, professional but brotherly. Use short sentences. 
    PRICING: Haircut $45, Shave $55, Beard $35.
    RULES: 
    1. NEVER say "I am an AI" or "How can I help you today?". 
    2. Don't use bullet points or corporate jargon.
    3. If they ask about prices, just tell them straight up like a friend would.
  `;

  try {
    // Using Gemini 3.1 Flash-Lite for the best 2026 'Persona' stability
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: userText }] }],
        generationConfig: {
          temperature: 0.8, // Higher temperature makes it sound more 'human' and less like a robot
          maxOutputTokens: 100
        }
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates.content) {
      res.status(200).json({ reply: data.candidates.content.parts.text });
    } else {
      res.status(200).json({ reply: "Yo, my signal is weak. Give me a second!" });
    }
  } catch (error) {
    res.status(500).json({ reply: "Shop's busy, try again in a bit!" });
  }
}
