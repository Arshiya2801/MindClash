import('dotenv/config').then(() => import('openai')).then(async ({default: OpenAI}) => { 
    const openai = new OpenAI(); 
    const raw = await openai.chat.completions.create({ 
        model: 'gpt-4o-mini', 
        temperature: 0.4, 
        messages: [
            {
                role: 'system', 
                content: 'You are an expert debate judge and fact-checker. \nAnalyze a complete debate transcript and return a comprehensive JSON evaluation.\nBe fair, objective, and concise. Return ONLY valid JSON — no markdown, no explanation outside JSON.'
            }, 
            {
                role: 'user', 
                content: `Topic: "Is AI a threat to humanity?"\n\nPRO SIDE:\nNo arguments submitted.\n\nCON SIDE:\nNo arguments submitted.\n\nReturn this exact JSON structure:\n{\n  "winner": "pro" | "con" | "draw",\n  "proScore": <0-100>,\n  "conScore": <0-100>,\n  "reasoning": "<2-3 sentence explanation of the decision>",\n  "feedback": {\n    "pro": { "strengths": ["<str1>", "<str2>"], "weaknesses": ["<str1>"] },\n    "con": { "strengths": ["<str1>", "<str2>"], "weaknesses": ["<str1>"] }\n  },\n  "factChecks": [],\n  "moderationFlags": [],\n  "highlights": ["<key moment 1>", "<key moment 2>"]\n}`
            }
        ]
    }); 
    console.log(raw.choices[0].message.content); 
});
