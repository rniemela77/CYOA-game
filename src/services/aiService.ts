// chuzapath-core.ts — Minimal CYOA generator
//
// Contract (simple):
// - Model is STATELESS. Your app owns objective and sceneCount.
// - Call generateScene({ setting }) to start a game.
// - Call generateScene({ objective, chosenOption, lastSceneText? }) to continue.
// - We send one system prompt with all rules and ONE instruction to return JSON.
// - The model never sees/sets sceneCount; you increment it in your app.

const API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-5-nano' as const;

// Tunables
const SCENE_WORDS = { min: 60, max: 100 } as const;
const OPTION_WORDS = { min: 3, max: 6 } as const;
const READING_LEVEL = '5th–6th grade' as const;

// Public types
export type GameSetting = 'forest' | 'urban' | 'space';

export interface SceneData {
  text: string;
  options: string[];        // exactly 4 options, 3–6 words each
  backgroundColor: string;  // short CSS color (may be "")
  objective: string;        // set on first scene; persist thereafter
}

// Single public function
export async function generateScene(args: {
  // Start a game: provide setting only
  setting?: GameSetting;

  // Continue a game: provide these (no setting needed)
  objective?: string;
  chosenOption?: string;

  // Optional continuity helpers (cheap but optional)
  lastSceneText?: string;  // prior scene text; we'll tail-trim it
}): Promise<SceneData> {
  const isInitial = !!args.setting && !args.objective && !args.chosenOption;

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT() },
    { role: 'user', content: isInitial ? userStart(args.setting!) : userContinue(args) },
  ] as const;

  console.log(SYSTEM_PROMPT());
  console.log(isInitial ? userStart(args.setting!) : userContinue(args));

  const apiKey =
    (import.meta as any).env?.VITE_OPENAI_API_KEY || process.env?.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error('Missing VITE_OPENAI_API_KEY');

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`API request failed: ${err?.error?.message || res.status}`);
  }

  const data = await res.json();
  const raw = String(data?.choices?.[0]?.message?.content ?? '').trim();
  const parsed = parseJson(raw);
  return validate(parsed);
}

// -------------------- Prompts --------------------

function SYSTEM_PROMPT(): string {
  return [
    `You are the extremely talented and creative storyteller for a world-class choose-your-own-adventure game (Chuzapath).`,
    `Write vivid, immersive, second-person scenes in simple, clear prose (${READING_LEVEL}) that are extremely interesting and engaging.`,
    `Each scene is ${SCENE_WORDS.min}-${SCENE_WORDS.max} words with 1–2 sensory details and player agency.`,
    `Generate exactly 4 distinct options that the player would want to choose to do that meaningfully advance the story; each ${OPTION_WORDS.min}-${OPTION_WORDS.max} words and clearly tied to the scene.`,
    `Set "objective" only on the first scene; thereafter keep the same objective.`,
    `"backgroundColor" is a short CSS color that fits the scene/environment.`,
    `Respond with ONE JSON object and nothing else, shaped exactly as:`,
    `{"text":"","options":["","","",""],"backgroundColor":"","objective":""}`,
  ].join('\n');
}

function userStart(setting: GameSetting): string {
  return [
    `START NEW GAME`,
    `Setting: ${setting}`,
    `Create a clear one-sentence objective for this setting that is extremely interesting and engaging.`,
    `Generate the scene text and 4 options that are related to the setting and the objective.`,
  ].join('\n');
}

function userContinue({
  objective = '',
  chosenOption = '',
  lastSceneText,
}: {
  objective?: string;
  chosenOption?: string;
  lastSceneText?: string;
}): string {
  const lines = [
    `CONTINUE GAME`,
    lastSceneText ? `Last scene: "${lastSceneText}"` : ``,

    // start chance/conditional stuff
    Math.random() > 0.5 ? `Add a surprise/twist as a result of the player's last choice.` : ``,
    Math.random() > 0.5 ? `Mention a noteworthy detail or tool the player might use.` : ``,
    Math.random() > 0.5 ? `Hint at a conflict or problem the player might face.` : ``,
    Math.random() > 0.5 ? `Immediately put the player in a conflict or problem.` : ``,
    // end chance/conditional stuff

    `Chosen option: "${chosenOption}"`,
    `Objective: ${objective}`,
  ];
  return lines.filter(Boolean).join('\n');
}

// -------------------- Utils --------------------

function parseJson(s: string) {
  const cleaned = s.replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/m, '$1').trim();
  return JSON.parse(cleaned);
}

function validate(d: any): SceneData {
  if (!d || typeof d !== 'object') throw new Error('Invalid JSON payload');
  const required = ['text', 'options', 'objective'] as const;
  for (const k of required) if (d[k] === undefined) throw new Error(`Missing field: ${k}`);

  if (!Array.isArray(d.options) || d.options.length !== 4) {
    throw new Error('Expected exactly 4 options');
  }

  return {
    text: String(d.text),
    options: d.options.map((o: any) => String(o)),
    backgroundColor: typeof d.backgroundColor === 'string' ? d.backgroundColor : '',
    objective: String(d.objective),
  };
}

