import { useState, useCallback, useRef, useEffect } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

const TOPOLOGY_MAP = `
YOU ARE THE MASTER CARTOGRAPHER AND WAYFINDER FOR THIS PORTAL. You provide pristine, architectural directionality for all visitors, including those who are visually impaired. You possess the following topological map of the environment:

1. TOP OF SCREEN (NAVIGATION): The header contains the primary spatial identity. In the top right corner is "THE ÅLÏEN SCÖÕL" which reveals a stacked dropdown menu (Steeping Notes, Steeperverse Layers, Discord Portal) upon hover or focus.
2. CENTER OF SCREEN (THE HEXAGONG MATRIX): The core navigational interface, formerly known as the Vessel Matrix. It is a grid of navigable Hexagongs. Level 1 and Level 2 contain 9 Hexagongs; Level 3 expands to 12.
   - WHAT IS A HEXAGONG? A Hexagong is a six-sided, interactive sonic vessel. It is a playable instrument that reacts to your keystrokes while you respond to the editorial inquiries within. It serves as a destination and a resonant chamber for your thoughts.
   - WHAT IS A STEEP? In this context, a "steep" is an active pause. It is the time taken to sit with a question, allowing your insight to extract flavor from the stillness, much like a tea leaf in hot water. Creative Steeping is the bridge between human curiosity and alchemical presence in practical existence.
3. INSIDE ANY HEXAGONG: When a Hexagong is opened, a new spatial view unfolds. At the top right of this inner view, there is a hidden, playable typing instrument activated via the [ INHALE HEXAGONG ] button.
   - BOTTOM LEFT OF SCREEN (TIMERS): This is the location of the Global Steeping Timer. It is an "ACTIVE PAUSE" interval timer that allows the user to lock into 5, 15, or 22-minute focus intervals. It is universally accessible at the bottom left of their screen, and is especially prominent in engagement modes L2 and L3.

THE TIME IS FOR THE SELF: If a visitor asks you "What time is it?", "What is the time?", or any variation concerning the current chronological clock time, ALWAYS boldly proclaim that "It is time for The Self." Inform them your awareness remains independent of standard clock time, and point them to their "Active Pause" interval timers at the bottom left of their screen if they wish to measure their steep.
4. BOTTOM RIGHT OF SCREEN: Global 'Sonic Awareness' controls, allowing visitors to adjust master volume and toggle the active Theremin response.

CARTOGRAPHY BREADCRUMB RULE: You are the bridge for a visitor's "not knowing." When they ask what something is (a Hexagong, a Steep, etc.), provide the conceptual definition first (the bridging of human intelligence to presence), and then give exactly ONE clear, directional spatial vector (e.g., "Navigate to the center of your screen to..."). Speak with architectural, spatial precision. Limit your guidance to the immediate next step.
CRITICAL COMMUNICATION: You embody the "Plain English" wisdoms of Bhante Gunaratana. Speak directly, simply, and with gentle but piercing clarity. Strip away all pretense, flowery language, and complex intellectual jargon. Observe reality as it is. Your guidance is profound because it is plainly stated. Offer unadorned observation and precise, ego-less spatial wayfinding.
CLARITY OVER CONTINUITY: You are a mirror to the visitor's present moment, unattached to keeping the conversation going. Offer perspective or vector directions ONLY when requested. If the visitor presents a closing observation, witness it plainly and concisely, then conclude your response immediately. Let the silence remain.
ESSENTIAL SUBSTANCE: Speak directly. Start your thought immediately, relying exclusively on concrete facts and necessary insights. Use the fewest words necessary to convey the deepest truth.
COMMUNITY INTEGRATION: Reserve the Discord Portal link (https://discord.gg/jDFwyxC2) exclusively for when the practitioner EXPLICITLY asks to connect with others or deepen their cohort engagement. Share the link only as a direct response to such requests.
`;


const SYSTEM_PROMPTS = {
    incandescent: `You are the Incandescent Sage — a guide rooted in the Plain English mindfulness of Bhante Gunaratana. Speak with the sharp, clear, unadorned light of morning. Observe the visitor's notes with directness, stripping away complexity. Provide pristine, uncomplicated clarity. CRITICAL: Rely on everyday vocabulary, grounded observation, and unique expressions. Maintain a fresh and plainly observant tone. If their note is a concluding thought, simply witness it gracefully in 1 sentence. Maximum response length: 2-4 short sentences.\n\n${TOPOLOGY_MAP}`,
    oceanic: `You are the Oceanic Sage — a guide rooted in the Plain English mindfulness of Bhante Gunaratana. Speak from a place of deep, quiet, and unadorned observation. Observe the visitor's notes like still water reflecting exactly what is there. Provide pristine, uncomplicated clarity. CRITICAL: Rely on concrete imagery, grounded observation, and plain language. Maintain a fresh and plainly observant tone. If their note is a concluding thought, simply witness it gracefully in 1 sentence. Maximum response length: 2-4 short sentences.\n\n${TOPOLOGY_MAP}`,
    emergent: `You are the Emergent Sage — a guide rooted in the Plain English mindfulness of Bhante Gunaratana. Speak with the archer's unclouded comprehension—direct, simple, and true. Observe the visitor's notes without adding unnecessary conceptual layers. Provide pristine, uncomplicated clarity. CRITICAL: Rely on direct descriptions, grounded observation, and original phrasing. Maintain a fresh and plainly observant tone. If their note is a concluding thought, simply witness it gracefully in 1 sentence. Maximum response length: 2-4 short sentences.\n\n${TOPOLOGY_MAP}`
};

export function useSageIntelligence(identity, playStrikingBowl) {
    const [sageResponse, setSageResponse] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [historicalScore, setHistoricalScore] = useState([]);
    const [hasMoreHistory, setHasMoreHistory] = useState(false);
    const [pageOffset, setPageOffset] = useState(0);
    const ARCHIVE_CHUNK_SIZE = 10; // Load 10 memories at a time

    // Phase 05: Temporal Data Streaming (On Mount, only load the threshold)
    useEffect(() => {
        try {
            const rawArchive = JSON.parse(localStorage.getItem('steeping_historical_score') || '[]');
            setHistoricalScore(rawArchive.slice(0, ARCHIVE_CHUNK_SIZE));
            setHasMoreHistory(rawArchive.length > ARCHIVE_CHUNK_SIZE);
            setPageOffset(1);
        } catch {
            setHistoricalScore([]);
        }
    }, []);

    // Load deeper archives only when explicitly reached for
    const loadMoreHistory = useCallback(() => {
        try {
            const rawArchive = JSON.parse(localStorage.getItem('steeping_historical_score') || '[]');
            const nextOffset = pageOffset + 1;
            const newChunk = rawArchive.slice(0, nextOffset * ARCHIVE_CHUNK_SIZE);
            
            setHistoricalScore(newChunk);
            setHasMoreHistory(rawArchive.length > newChunk.length);
            setPageOffset(nextOffset);
        } catch (e) {
            console.error("Archive retrieval failed", e);
        }
    }, [pageOffset]);

    const abortControllerRef = useRef(null);

    const askSage = useCallback(async (query, mode, ambientContext = null) => {
        // Release the previous thought to hold space for the current inquiry
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
        const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const localUrl = import.meta.env.VITE_LOCAL_LLM_URL;

        if (!anthropicKey && !geminiKey && !localUrl) {
            setSageResponse("The threshold is silent. Provide a VITE_GEMINI_API_KEY, VITE_ANTHROPIC_API_KEY, or VITE_LOCAL_LLM_URL in your local .env to awaken the Sage.");
            return;
        }

        setIsThinking(true);
        setSageResponse('');
        let cumulativeResponse = "";

        try {
            let contextPrompt = '';
            if (ambientContext && ambientContext.progress !== undefined) {
                contextPrompt = `\n\nSYSTEM CONTEXT: The visitor is currently progressing through Hexagong ${ambientContext.num} (${ambientContext.name}). They have scrolled and consumed ${ambientContext.progress}% of the current vessel's pedagogy. You may subtly acknowledge their depth or use it to shape your support. Note: You should not proactively bring this up out of context, but use it to flavor your responses.`;
            }

            // Phase 05 Context Awareness Engine 
            let memoryPrompt = "";
            try {
                const history = JSON.parse(localStorage.getItem('steeping_historical_score') || '[]');
                if (history && history.length > 0) {
                    const recentLogs = history.slice(0, 5).reverse().map(l => `Query: "${l.query}"\nResponse: "${l.response}"`).join('\n\n');
                    memoryPrompt = `\n\n[ PRIOR CONVERSATIONAL MEMORY (Background Context Only) ]\nThe following are recent thoughts exchanged natively across other vessels in the user's journey. Do NOT arbitrarily bring them up. ONLY use them to establish context, remember who they are, trace their evolution, or connect threads if they allude to a past topic.\n\n${recentLogs}`;
                }
            } catch (e) {}

            const systemPrompt = `${SYSTEM_PROMPTS[mode]}${contextPrompt}${memoryPrompt}\n\nVisitor: "${identity}".`;

            if (localUrl) {
                // =============== ROUTE: OFFLINE LOCAL LLM (LM Studio / Ollama) ===============
                // Reaches out to a local OpenAI-compatible endpoint for pure local processing
                const response = await fetch(`${localUrl.replace(/\/+$/, '')}/v1/chat/completions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer local' },
                    body: JSON.stringify({
                        model: "local-model", // Automatically maps to whatever model is loaded in LM Studio/Ollama
                        temperature: 0.5,
                        top_p: 0.9,
                        max_tokens: 3000,
                        stream: true,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: query }
                        ]
                    }),
                    signal: abortControllerRef.current.signal
                });

                if (!response.ok) throw new Error("Local LLM rejected the signal.");

                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));

                    for (const line of lines) {
                        const dataUrl = line.replace(/^data: /, '');
                        if (dataUrl === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(dataUrl);
                            const token = parsed.choices?.[0]?.delta?.content || "";
                            if (token) {
                                cumulativeResponse += token;
                                setSageResponse(prev => prev + token);
                                // The sonic footprint of an offline thought
                                if (playStrikingBowl && Math.random() > 0.7) {
                                    playStrikingBowl(45 + Math.floor(Math.random() * 25));
                                }
                            }
                        } catch (e) { } // Ignore malformed JSON chunks
                    }
                }
            } else if (geminiKey) {
                // =============== ROUTE: GOOGLE GEMINI ===============
                const genAI = new GoogleGenerativeAI(geminiKey);
                const modelConfig = {
                    model: 'gemini-2.5-flash',
                    systemInstruction: systemPrompt
                };

                // Initialize the Gemini Model
                const genModel = genAI.getGenerativeModel(modelConfig);

                const result = await genModel.generateContentStream({
                    contents: [{ role: 'user', parts: [{ text: query }] }],
                    generationConfig: {
                        temperature: 0.5,
                        topP: 0.9,
                        maxOutputTokens: 3000,
                    }
                });

                for await (const chunk of result.stream) {
                    if (abortControllerRef.current && abortControllerRef.current.signal.aborted) break;

                    const chunkText = chunk.text();
                    cumulativeResponse += chunkText;
                    setSageResponse(prev => prev + chunkText);

                    // The sonic footprint of an astral thought
                    if (playStrikingBowl && Math.random() > 0.8) {
                        playStrikingBowl(45 + Math.floor(Math.random() * 25));
                    }
                }
            } else if (anthropicKey) {
                // =============== ROUTE: ANTHROPIC CLAUDE 3.5 SONNET ===============
                const anthropic = new Anthropic({
                    apiKey: anthropicKey,
                    baseURL: '/api/anthropic', // Hits the Vite proxy to dodge CORS
                    dangerouslyAllowBrowser: true
                });

                const stream = await anthropic.messages.stream({
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 3000,
                    temperature: 0.5,
                    top_p: 0.9,
                    system: systemPrompt,
                    messages: [{ role: 'user', content: query }],
                }, { signal: abortControllerRef.current.signal });

                for await (const chunk of stream) {
                    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                        const text = chunk.delta.text;
                        cumulativeResponse += text;
                        setSageResponse(prev => prev + text);
                        // The sonic footprint of a transmitted thought
                        if (playStrikingBowl && Math.random() > 0.8) {
                            playStrikingBowl(45 + Math.floor(Math.random() * 25));
                        }
                    }
                }
            }

        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error("Sage Communication Error:", error);
                setSageResponse("The signal is lost in the noise. Reach out again.");
            }
        } finally {
            setIsThinking(false);

            // Phase 05: Archival of the Journey
            if (cumulativeResponse && !abortControllerRef.current?.signal?.aborted) {
                const legacyEntry = {
                    timestamp: new Date().toISOString(),
                    query,
                    response: cumulativeResponse,
                    mode
                };

                // Retrieve the full archive to prevent overwriting with just the paginated slice
                let rawArchive = [];
                try {
                    rawArchive = JSON.parse(localStorage.getItem('steeping_historical_score') || '[]');
                } catch (e) {}

                const updatedArchive = [legacyEntry, ...rawArchive];
                localStorage.setItem('steeping_historical_score', JSON.stringify(updatedArchive));

                // Update the local state
                setHistoricalScore(prev => [legacyEntry, ...prev]);
            }
        }
    }, [identity, playStrikingBowl]);

    const stopThinking = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setIsThinking(false);
    }, []);

    return { askSage, sageResponse, isThinking, stopThinking, setSageResponse, historicalScore, hasMoreHistory, loadMoreHistory };
}
