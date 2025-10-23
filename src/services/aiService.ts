// chuzapath-core.ts — Minimal CYOA generator
//
// Contract (simple):
// - Model is STATELESS. Your app owns sceneCount.
// - Call generateScene({ setting }) to start a game.
// - Call generateScene({ chosenOption, lastSceneText? }) to continue.
// - We send one system prompt with all rules and ONE instruction to return JSON.
// - The model never sees/sets sceneCount; you increment it in your app.

const API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-5-nano' as const;

// Tunables
const SCENE_WORDS = { min: 60, max: 100 } as const;
const OPTION_WORDS = { min: 3, max: 6 } as const;

// Public types
import type { GameSetting } from '../config/settings'

export interface SceneData {
  text: string;
  options: string[];        // exactly 4 options, 3–6 words each
  backgroundColor: string;  // short CSS color (may be "")
}

// Single public function
export async function generateScene(args: {
  // Start a game: provide setting only
  setting?: GameSetting;

  // Continue a game: provide these (no setting needed)
  chosenOption?: string;

  // Optional continuity helpers (cheap but optional)
  lastSceneText?: string;  // prior scene text; we'll tail-trim it
}): Promise<SceneData> {
  const isInitial = !!args.setting && !args.chosenOption;

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
    `You are a choose-your-own-adventure storyteller.`,
    `Write a second-person scene (${SCENE_WORDS.min}-${SCENE_WORDS.max} words).`,
    `Return exactly 4 options; each ${OPTION_WORDS.min}-${OPTION_WORDS.max} words and clearly tied to the scene.`,
    `"backgroundColor" must be a short CSS color appropriate to the scene.`,
    `Respond with ONE JSON object and nothing else, exactly shaped as:`,
    `{"text":"","options":["","","",""],"backgroundColor":""}`,
  ].join('\n');
}

function userStart(setting: GameSetting): string {
  return [
    `START NEW GAME`,
    `Setting: ${setting}`,
    `Generate the scene text and 4 options.`,
  ].join('\n');
}

function userContinue({
  chosenOption = '',
  lastSceneText,
}: {
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
  const required = ['text', 'options', 'backgroundColor'] as const;
  for (const k of required) if (d[k] === undefined) throw new Error(`Missing field: ${k}`);

  if (!Array.isArray(d.options) || d.options.length !== 4) {
    throw new Error('Expected exactly 4 options');
  }

  return {
    text: String(d.text),
    options: d.options.map((o: any) => String(o)),
    backgroundColor: typeof d.backgroundColor === 'string' ? d.backgroundColor : '',
  };
}

