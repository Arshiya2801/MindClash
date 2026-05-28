import OpenAI from 'openai';

// Lazy initialization
let client = null;
const getClient = () => {
    if (!client) {
        client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return client;
};

/**
 * Safe JSON parse from AI response
 */
const parseJSON = (text) => {
    try {
        // Strip markdown code fences if present
        const clean = text.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim();
        const match = clean.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
    } catch (e) {
        console.error('JSON parse error:', e.message);
    }
    return null;
};

/**
 * Core helper - call gpt-4o-mini with a system+user prompt
 */
const callAI = async (systemPrompt, userPrompt, temperature = 0.4) => {
    const response = await getClient().chat.completions.create({
        model: 'gpt-4o-mini',
        temperature,
        max_tokens: 800,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
    });
    return response.choices[0].message.content;
};

// ─────────────────────────────────────────────────────────────────────────────
// BATCH DEBATE ANALYSIS — called ONCE at the end of the debate.
// Combines: winner declaration + fact-checking + moderation + feedback.
// This saves the most tokens since we do everything in one call.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyze entire debate transcript in a single AI call.
 * Returns: winner, scores, reasoning, fact checks, moderation flags, feedback.
 */
export const analyzeDebateBatch = async (topic, proArguments, conArguments) => {
    const systemPrompt = `You are an expert debate judge and fact-checker. 
Analyze a complete debate transcript and return a comprehensive JSON evaluation.
Be fair, objective, and concise. Return ONLY valid JSON — no markdown, no explanation outside JSON.`;

    const proText = proArguments.length > 0
        ? proArguments.map((a, i) => `[${i + 1}] ${a.content}`).join('\n\n')
        : 'No arguments submitted.';

    const conText = conArguments.length > 0
        ? conArguments.map((a, i) => `[${i + 1}] ${a.content}`).join('\n\n')
        : 'No arguments submitted.';

    const userPrompt = `Topic: "${topic}"

PRO SIDE:
${proText}

CON SIDE:
${conText}

Return this exact JSON structure:
{
  "winner": "pro" | "con" | "draw",
  "proScore": <0-100>,
  "conScore": <0-100>,
  "reasoning": "<2-3 sentence explanation of the decision>",
  "feedback": {
    "pro": { "strengths": ["<str1>", "<str2>"], "weaknesses": ["<str1>"] },
    "con": { "strengths": ["<str1>", "<str2>"], "weaknesses": ["<str1>"] }
  },
  "factChecks": [
    { "claim": "<a factual claim from any argument>", "verdict": "true|mostly_true|mixed|false|unverifiable", "note": "<brief explanation>" }
  ],
  "moderationFlags": [
    { "side": "pro"|"con", "argIndex": <1-based index>, "issue": "<brief issue description>", "severity": "low|medium|high" }
  ],
  "highlights": ["<key moment 1>", "<key moment 2>"]
}

Rules:
- If a side's text is "No arguments submitted.", DO NOT invent arguments for them. Their score must be 0, their strengths must be empty, and their weakness must be "Did not participate."
- moderationFlags: only flag genuinely toxic, hateful, or rule-breaking content. Leave empty [] if all is fine.
- factChecks: only check verifiable factual claims. Max 3 checks. Leave [] if no factual claims.
- highlights: 1-2 standout moments from the debate.`;

    try {
        const raw = await callAI(systemPrompt, userPrompt);
        const result = parseJSON(raw);
        if (result) return result;

        console.error('analyzeDebateBatch: AI returned unparseable JSON:', raw?.slice(0, 200));
        // Fallback
        return {
            winner: 'draw', proScore: 50, conScore: 50,
            reasoning: 'Could not determine a clear winner.',
            feedback: { pro: { strengths: [], weaknesses: [] }, con: { strengths: [], weaknesses: [] } },
            factChecks: [], moderationFlags: [], highlights: []
        };
    } catch (error) {
        console.error('OpenAI batch analysis error:', error?.status || '', error?.message || error);
        return null; // Signal caller to use smart fallback
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// TOPIC GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export const generateTopic = async (category = 'General', difficulty = 'intermediate') => {
    const FALLBACK_TOPICS = [
        { title: 'Should social media be regulated by governments?', description: 'Debate on government oversight of social media platforms.', category: 'Technology', proPosition: 'Regulation protects users', conPosition: 'It threatens free speech', keyPoints: { pro: ['User safety', 'Misinformation control'], con: ['Free speech', 'Innovation'] }, tags: ['technology', 'politics'] },
        { title: 'Is remote work better than office work?', description: 'The future of work arrangements.', category: 'Social', proPosition: 'Remote work improves productivity', conPosition: 'Office fosters collaboration', keyPoints: { pro: ['Flexibility', 'No commute'], con: ['Collaboration', 'Culture'] }, tags: ['work', 'lifestyle'] },
        { title: 'Should college education be free?', description: 'Economics of higher education.', category: 'Economy', proPosition: 'Free education creates equal opportunities', conPosition: 'Decreases quality and raises taxes', keyPoints: { pro: ['Equal access'], con: ['Quality'] }, tags: ['education', 'economy'] },
        { title: 'Is AI a threat to humanity?', description: 'Risks and benefits of AI.', category: 'Technology', proPosition: 'AI poses existential risks', conPosition: 'Benefits outweigh risks', keyPoints: { pro: ['Job loss'], con: ['Medical advances'] }, tags: ['technology', 'ai'] },
        { title: 'Should voting be mandatory?', description: 'Civic duty vs personal freedom.', category: 'Politics', proPosition: 'Ensures true representation', conPosition: 'Voting should be a freedom', keyPoints: { pro: ['Representation'], con: ['Personal freedom'] }, tags: ['politics', 'democracy'] },
    ];

    try {
        const raw = await callAI(
            'You are a debate topic generator. Return ONLY valid JSON.',
            `Generate a unique debate topic.
Category: ${category}, Difficulty: ${difficulty}

Return JSON:
{
  "title": "<debate statement>",
  "description": "<1-2 sentence context>",
  "proPosition": "<what PRO argues>",
  "conPosition": "<what CON argues>",
  "keyPoints": { "pro": ["<p1>","<p2>"], "con": ["<p1>","<p2>"] },
  "tags": ["<tag1>","<tag2>"]
}`,
            0.8
        );
        const result = parseJSON(raw);
        if (result?.title) {
            result.category = category;
            return result;
        }
    } catch (error) {
        console.error('OpenAI topic generation error:', error.message);
    }
    return FALLBACK_TOPICS[Math.floor(Math.random() * FALLBACK_TOPICS.length)];
};

// ─────────────────────────────────────────────────────────────────────────────
// WHISPER MODE — Argument Assistant
// ─────────────────────────────────────────────────────────────────────────────

export const assistArgument = async (userDraft, side, topic, opponentArguments = []) => {
    const opponentContext = opponentArguments.length > 0
        ? `Opponent said:\n${opponentArguments.slice(-2).join('\n')}`
        : 'No opponent arguments yet.';

    try {
        const raw = await callAI(
            'You are a concise debate coach. Return ONLY valid JSON.',
            `Topic: "${topic}", You are on the ${side.toUpperCase()} side.
${opponentContext}

User draft: "${userDraft}"

Return JSON:
{
  "suggestions": ["<specific improvement 1>", "<specific improvement 2>"],
  "counterPoints": ["<counter to address>"],
  "evidence": ["<fact or stat they could use>"],
  "structureTip": "<one sentence tip>",
  "strengthRating": <1-10>
}`,
            0.5
        );
        const result = parseJSON(raw);
        if (result) return result;
    } catch (error) {
        console.error('OpenAI assist error:', error.message);
    }
    return { suggestions: [], counterPoints: [], evidence: [], structureTip: 'Be specific and use evidence.', strengthRating: 5 };
};

// ─────────────────────────────────────────────────────────────────────────────
// ALIAS GENERATOR — for anonymous mode
// ─────────────────────────────────────────────────────────────────────────────

export const generateAlias = async () => {
    // Use local fallback-first approach to avoid burning tokens on aliases
    const adjectives = ['Shadow', 'Silent', 'Swift', 'Clever', 'Bold', 'Wise', 'Iron', 'Phantom', 'Neon', 'Cosmic'];
    const nouns = ['Thinker', 'Debater', 'Scholar', 'Ninja', 'Master', 'Sage', 'Orator', 'Judge', 'Seeker', 'Reason'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 900) + 100;
    return `${adj}${noun}_${num}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// SMART FALLBACK SCORER — no AI call, pure heuristics
// ─────────────────────────────────────────────────────────────────────────────

export const smartFallbackScore = (proArgs, conArgs) => {
    const analyze = (args) => {
        const text = args.map(a => a.content).join(' ');
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const uniqueWords = new Set(words.map(w => w.toLowerCase()));
        const avgSentenceLen = words.length / Math.max(sentences.length, 1);

        const wordScore = Math.min(words.length / 10, 30);
        const diversityScore = Math.min(uniqueWords.size / 5, 25);
        const clarityScore = avgSentenceLen >= 8 && avgSentenceLen <= 25 ? 20 : 10;
        const lengthBonus = text.length > 200 ? 10 : text.length > 100 ? 5 : 0;
        return wordScore + diversityScore + clarityScore + lengthBonus;
    };

    const proFallback = proArgs.length > 0 ? analyze(proArgs) : 0;
    const conFallback = conArgs.length > 0 ? analyze(conArgs) : 0;
    
    if (proFallback === 0 && conFallback === 0) {
        return {
            winner: 'draw',
            proScore: 0,
            conScore: 0,
            reasoning: 'Neither side submitted any arguments. The debate is a draw.',
            feedback: { 
                pro: { strengths: [], weaknesses: ['Did not participate.'] }, 
                con: { strengths: [], weaknesses: ['Did not participate.'] } 
            },
            factChecks: [],
            moderationFlags: [],
            highlights: []
        };
    }

    const total = proFallback + conFallback || 1;
    const proScore = Math.round((proFallback / total) * 100);
    const conScore = 100 - proScore;
    const diff = proScore - conScore;

    return {
        winner: diff >= 5 ? 'pro' : diff <= -5 ? 'con' : 'draw',
        proScore,
        conScore,
        reasoning: 'Scored by heuristic analysis (AI unavailable).',
        feedback: { pro: { strengths: [], weaknesses: [] }, con: { strengths: [], weaknesses: [] } },
        factChecks: [],
        moderationFlags: [],
        highlights: []
    };
};

export default {
    analyzeDebateBatch,
    generateTopic,
    assistArgument,
    generateAlias,
    smartFallbackScore,
};
