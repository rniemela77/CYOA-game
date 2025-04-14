# Chuzapath
A simple Choose Your Own Adventure game powered by AI.

## How It Works
- You visit the site
- The game gets a story and options from the AI
- You see the story and can pick from 4 options
- When you choose, the AI creates the next part of your adventure
- Keep making choices to see how your story unfolds

## Setup

### Local Development
1. Create a `.env` file with your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```
2. Start it up:
   ```
   npm run dev
   ```

### Netlify Deployment
To deploy on Netlify:

1. Go to your site settings in Netlify
2. Add your `OPENAI_API_KEY` as an environment variable
3. Deploy!

The app handles API keys differently based on environment:
- In development: Uses your local .env file
- In production: Uses a serverless function to keep your API key safe

## Tech Stack

- **Vue.js (v3)**: Builds the UI

- **Vite**: Takes care of the build process

- **Netlify Functions**: Keeps the OpenAI API key secure by handling API calls server-side.

- **OpenAI API**: Does the heavy lifting for generating creative story content based on your choices.

The app is pretty simple - the Vue frontend handles what you see and click, while a serverless function securely talks to the AI. This keeps things fast, secure, and easy to maintain.