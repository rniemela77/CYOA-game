/**
 * Chuzapath - AI Story Generation Prompts
 * 
 * This file contains the prompts and instructions for generating interactive
 * story content using the OpenAI API.
 */

import { getOpenAIApiKey, isLocalDevelopment } from './utils/env';

// API Configurations
const DIRECT_OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const NETLIFY_FUNCTION_URL = '/.netlify/functions/openai-proxy';
const OPENAI_MODEL = 'gpt-4o'; // Updated to latest model

// Demo mode flag - always false to force API usage
let USE_DEMO_MODE = false;

// No need to listen for demo mode toggle events since debug functionality is removed
// But keeping minimal implementation for compatibility
if (typeof window !== 'undefined') {
  window.addEventListener('demoModeChanged', () => {
    // Demo mode toggle functionality removed
    USE_DEMO_MODE = false;
  });
}

/**
 * Generates the initial story and options
 * @param {string} theme - Optional theme for the story
 * @returns {Promise} - Promise containing the generated story data
 */
export async function generateInitialStory(theme = null) {
  console.log('generateInitialStory called with theme:', theme);
  
  // Check if we have direct API key access or need to use proxy
  const hasApiKey = getOpenAIApiKey();
  
  // Use demo mode if we're in an environment without API access
  if (!hasApiKey && !isLocalDevelopment()) {
    console.log('No API access method available, falling back to demo content');
    return getDemoInitialStory(theme);
  }
  
  console.log('Making API call for initial story generation');
  const prompt = createInitialStoryPrompt(theme);
  return await callOpenAI(prompt);
}

/**
 * Generates the next part of the story based on the chosen option
 * @param {object} currentStory - The current story state
 * @param {string} chosenOption - The option selected by the user
 * @returns {Promise} - Promise containing the generated story continuation
 */
export async function generateStoryContinuation(currentStory, chosenOption) {
  console.log('generateStoryContinuation called with option:', chosenOption);
  
  // Check if we have direct API key access or need to use proxy
  const hasApiKey = getOpenAIApiKey();
  
  // Use demo mode if we're in an environment without API access
  if (!hasApiKey && !isLocalDevelopment()) {
    console.log('No API access method available, falling back to demo content');
    return getDemoContinuation(currentStory, chosenOption);
  }
  
  console.log('Making API call for story continuation');
  const prompt = createContinuationPrompt(currentStory, chosenOption);
  return await callOpenAI(prompt);
}

/**
 * Returns a predefined initial story for demo mode
 * @param {string} theme - Optional theme for the story
 * @returns {object} - The initial story and options
 */
function getDemoInitialStory(theme = null) {
  // Simulate network delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        text: "You find yourself standing at the entrance of a mysterious cave. The wind howls through the opening, carrying whispers of adventure and danger. Strange glowing symbols are etched into the stone around the entrance, and you notice a small leather pouch lying on the ground nearby. In the distance, you hear what sounds like singing, though the language is unfamiliar.",
        options: [
          "Enter the cave cautiously",
          "Examine the glowing symbols",
          "Pick up the leather pouch",
          "Follow the distant singing"
        ]
      });
    }, 1000); // Simulate 1 second delay
  });
}

/**
 * Returns a predefined story continuation for demo mode
 * @param {object} currentStory - The current story state
 * @param {string} chosenOption - The option selected by the user
 * @returns {object} - The next part of the story
 */
function getDemoContinuation(currentStory, chosenOption) {
  // Simulate network delay
  return new Promise(resolve => {
    setTimeout(() => {
      // Different responses based on the chosen option
      if (chosenOption.includes("Enter the cave")) {
        resolve({
          text: "You step carefully into the cave, the temperature dropping noticeably as you venture deeper. Your eyes adjust to the dimness, revealing a passage that branches in two directions. The left path glimmers with the same strange symbols you saw outside, pulsing with an ethereal blue light. The right path is darker, but you detect the faint sound of running water. A small, curious creature scurries across the floor and disappears into a crevice.",
          options: [
            "Follow the glowing symbols",
            "Take the path with water",
            "Investigate the crevice",
            "Call out a greeting"
          ]
        });
      } else if (chosenOption.includes("Examine the glowing")) {
        resolve({
          text: "As you study the symbols, they begin to shift and rearrange under your gaze. With astonishment, you realize they're forming words you can understand. 'Speak truth to enter, speak lies to be lost.' The symbols pulse brighter, and you feel a strange tingling sensation in your fingertips. A small section of the stone beside the symbols looks different, with a handprint indentation that seems to be waiting for something.",
          options: [
            "Place your hand on the imprint",
            "Speak a truth aloud",
            "Tell a deliberate lie",
            "Back away from the entrance"
          ]
        });
      } else if (chosenOption.includes("Pick up")) {
        resolve({
          text: "You pick up the leather pouch, which is heavier than it looks. Opening it reveals three items: a smooth stone with a hole through the center, a small brass key with intricate engravings, and a folded piece of parchment. The parchment contains a crude map showing the cave and three marked locations within, labeled in an unfamiliar script. As you examine these items, the singing in the distance grows momentarily louder before fading again.",
          options: [
            "Enter the cave with the items",
            "Look through the holed stone",
            "Try to decipher the map",
            "Call toward the singing"
          ]
        });
      } else {
        resolve({
          text: "You follow the haunting melody, moving away from the cave and into a grove of ancient trees you hadn't noticed before. The singing grows clearer—a woman's voice, ethereal and mesmerizing. Through the trees, you glimpse a small clearing where a figure in flowing white garments sits beside a spring. She seems unaware of your presence, though when the wind shifts, her singing pauses momentarily. Near the edge of the clearing, a worn path leads around the grove, back toward the cave but from a different angle.",
          options: [
            "Approach the singing woman",
            "Hide and observe her",
            "Return to the cave entrance",
            "Follow the worn path"
          ]
        });
      }
    }, 1500); // Simulate 1.5 second delay
  });
}

/**
 * Creates the prompt for generating the initial story
 * @param {string} theme - Optional theme for the story
 * @returns {array} - Array of message objects for the OpenAI API
 */
function createInitialStoryPrompt(theme) {
  let themeInstruction = theme 
    ? `Create a story start with the theme: ${theme}.` 
    : 'Create an engaging start to an interactive adventure story.';
  
  return [
    { role: 'system', content: 
      `You are a creative storyteller for an interactive fiction game called Chuzapath. 
      Your task is to create immersive, engaging story segments with meaningful choices.
      
      Follow these rules:
      1. Create vivid, atmospheric descriptions with sensory details.
      2. Include 3-5 specific story elements that choices can relate to.
      3. Keep paragraphs concise (80-120 words).
      4. Generate exactly 4 options that relate directly to details in your story.
      5. Each option should be 3-6 words, clear and distinct.
      6. Options should offer meaningfully different paths forward.
      7. Do not include numbering in the options.
      8. Return ONLY JSON, with no other text.` 
    },
    { role: 'user', content: 
      `${themeInstruction}
      
      Return your response as valid JSON in this exact format:
      {
        "text": "The story paragraph goes here...",
        "options": [
          "First brief option",
          "Second brief option",
          "Third brief option",
          "Fourth brief option"
        ]
      }` 
    }
  ];
}

/**
 * Creates the prompt for generating story continuations
 * @param {object} currentStory - The current story state
 * @param {string} chosenOption - The option selected by the user
 * @returns {array} - Array of message objects for the OpenAI API
 */
function createContinuationPrompt(currentStory, chosenOption) {
  return [
    { role: 'system', content: 
      `You are a creative storyteller for an interactive fiction game called Chuzapath.
      Your task is to continue the story based on the player's chosen option.
      
      Follow these rules:
      1. Create vivid, atmospheric continuations with sensory details.
      2. Directly acknowledge and incorporate the chosen option.
      3. Include 3-5 specific story elements that new choices can relate to.
      4. Keep paragraphs concise (80-120 words).
      5. Generate exactly 4 new options that relate directly to details in your continuation.
      6. Each option should be 3-6 words, clear and distinct.
      7. Options should offer meaningfully different paths forward.
      8. Do not include numbering in the options.
      9. Return ONLY JSON, with no other text.` 
    },
    { role: 'user', content: 
      `The current story is:
      "${currentStory.text}"
      
      The available options were:
      ${currentStory.options.map(opt => `"${opt}"`).join('\n')}
      
      The player chose: "${chosenOption}"
      
      Continue the story based on this choice and provide 4 new options.
      
      Return your response as valid JSON in this exact format:
      {
        "text": "The story continuation goes here...",
        "options": [
          "First brief option",
          "Second brief option",
          "Third brief option",
          "Fourth brief option"
        ]
      }` 
    }
  ];
}

/**
 * Calls the OpenAI API with the provided prompt
 * @param {array} messages - Array of message objects for the OpenAI API
 * @returns {object} - Parsed JSON response from OpenAI
 */
async function callOpenAI(messages) {
  try {
    // Check if we should use direct API call or serverless function
    const apiKey = getOpenAIApiKey();
    const isLocal = isLocalDevelopment();
    
    console.log('API Key available:', !!apiKey);
    console.log('Is local development:', isLocal);
    
    // Determine which API endpoint to use
    const apiUrl = isLocal && apiKey 
      ? DIRECT_OPENAI_API_URL  // Use direct OpenAI API in local dev with key
      : NETLIFY_FUNCTION_URL;  // Use serverless function in production
      
    console.log(`Using API endpoint: ${apiUrl}`);
    
    // Prepare request body
    const requestBody = {
      model: OPENAI_MODEL,
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0.2,
      presence_penalty: 0.2,
    };
    
    // Prepare headers - include Authorization only for direct API calls
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add Authorization header only for direct API calls
    if (isLocal && apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    // Make the API request
    console.log('Calling API with model:', OPENAI_MODEL);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error Response:', errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData?.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('API response received successfully');
    let content = data.choices[0].message.content;
    
    // Clean the content if it's wrapped in Markdown code blocks
    // This will remove ```json, ``` or any similar Markdown code block delimiters
    content = content.replace(/^```(?:json)?[\r\n]+([\s\S]*)```[\r\n]*$/m, '$1');
    content = content.trim();
    
    console.log('Cleaned content for parsing:', content.substring(0, 50) + '...');
    
    // Parse the JSON response
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.log('Failed to parse content:', content);
      throw new Error('Failed to parse story data from API response');
    }
  } catch (error) {
    console.error('Error calling API:', error);
    // Return a fallback story if API call fails
    return {
      text: "Connection to the storyteller was lost. Please try again later. Error: " + error.message,
      options: [
        "Restart the journey",
        "Try again",
        "Check connection",
        "Go back"
      ]
    };
  }
}

// Example usage:
/*
import { generateInitialStory, generateStoryContinuation } from './aiPrompts';

// Starting a new story
const story = await generateInitialStory('fantasy');

// Getting the next part after user selects an option
const nextPart = await generateStoryContinuation(story, story.options[0]);
*/ 