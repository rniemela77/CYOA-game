<template>
  <div class="game-interface">
    <!-- Header -->
    <div class="game-header">
      <h1 class="game-title">Jiurni - AI Text Adventure</h1>
    </div>
    
    <!-- Start Screen -->
    <div v-if="showStartScreen" class="start-screen">
      <div class="start-content">
        <h2 class="start-title">Begin Your Adventure</h2>
        <p class="start-description">Embark on an AI-powered journey where your choices shape the story.</p>
        <button class="start-button" @click="beginAdventure">
          <span class="start-text">Start</span>
          <span class="start-arrow">→</span>
        </button>
      </div>
    </div>
    
    <!-- Main content (only shown after clicking Start) -->
    <div v-else class="game-content">
      <!-- Scrollable story content -->
      <div class="story-scroll-container">
        <!-- Story history directly in the main content -->
        <div v-if="storyHistory.length > 0" class="story-history">
          <div v-for="(historyItem, index) in storyHistory" :key="index" class="history-item">
            <p class="history-text">{{ historyItem.text }}</p>
            <div class="history-choice">
              <span class="choice-label">You chose:</span>
              <span class="choice-text">{{ historyItem.choiceMade }}</span>
            </div>
          </div>
          <div class="segment-divider">
            <div class="divider-line"></div>
            <div class="marker-dot"></div>
            <div class="divider-line"></div>
          </div>
        </div>
        
        <!-- Current story container -->
        <div class="story-container" :class="{ 'loading': isLoading }">
          <p class="story-text">{{ currentStory.text }}</p>
          <div v-if="isLoading" class="loading-indicator">
            <div class="loading-animation">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
            <span>{{ loadingMessage }}</span>
          </div>
          <div v-if="error" class="error-message">
            {{ error }}
            <button class="retry-button" @click="retryLastAction">Try Again</button>
          </div>
        </div>
        
        <!-- Add some padding at the bottom for better scrolling experience -->
        <div class="story-bottom-padding"></div>
      </div>
      
      <!-- Fixed options container -->
      <div class="fixed-options">
        <!-- Options container -->
        <div class="options-panel">
          <h3 class="options-title">What will you do?</h3>
          <div class="options-container">
            <button 
              v-for="(option, index) in currentStory.options" 
              :key="index"
              class="option-button"
              @click="selectOption(option)"
              :disabled="isLoading"
            >
              <span class="option-text">{{ option }}</span>
              <span class="option-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="game-footer">
      <p>© {{ new Date().getFullYear() }} Jiurni by Robert Niemela • rvniemela@hotmail.com</p>
      <div class="footer-controls">
        <button class="small-button" @click="startNewStory()">Restart</button>
      </div>
    </div>
  </div>
</template>

<script>
import { generateInitialStory, generateStoryContinuation } from '../aiPrompts';

// Import and check if we have an API key (without actually using it yet)
import { getOpenAIApiKey } from '../utils/env';

export default {
  name: 'StoryDisplay',
  data() {
    return {
      showStartScreen: true, // Show start screen by default
      currentStory: {
        text: "Loading your adventure...",
        options: [
          "Wait patiently",
          "Refresh the page",
          "Check connection",
          "Try again"
        ]
      },
      storyHistory: [],
      isLoading: false,
      error: null,
      lastChoice: null,
      loadingMessage: "Loading your adventure...",
      usingDemoMode: false // Always start with demo mode disabled
    }
  },
  methods: {    
    beginAdventure() {
      // Hide the start screen
      this.showStartScreen = false;
      // Start the new story
      this.startNewStory();
    },
    async selectOption(option) {
      try {
        // Save current story to history, including the choice being made
        this.storyHistory.push({
          ...this.currentStory,
          choiceMade: option // Store the choice being made with this story segment
        });
        this.lastChoice = option;
        
        this.isLoading = true;
        this.loadingMessage = `Continuing your story based on: "${option}"...`;
        this.error = null;
        
        console.log(`Selected option: ${option}`);
        
        // Replace current story text with a loading placeholder
        this.currentStory = {
          text: "The story continues...",
          options: []
        };
        
        // Generate the next part of the story using AI
        const nextStory = await generateStoryContinuation({
          text: this.storyHistory[this.storyHistory.length - 1].text,
          options: []
        }, option);
        
        this.currentStory = nextStory;
        
        // Scroll to the current story segment
        this.$nextTick(() => {
          // Find the scrollable container and the current story element
          const scrollContainer = document.querySelector('.story-scroll-container');
          const storyContainer = document.querySelector('.story-container');
          
          if (scrollContainer && storyContainer) {
            // Calculate the position to scroll to (position of story container relative to scroll container)
            const scrollTop = storyContainer.offsetTop - scrollContainer.offsetTop;
            
            // Smooth scroll to the current story container
            scrollContainer.scrollTo({
              top: scrollTop,
              behavior: 'smooth'
            });
          }
        });
      } catch (error) {
        console.error('Failed to continue story:', error);
        this.error = `Failed to continue story: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    },
    async startNewStory() {
      try {
        this.isLoading = true;
        this.loadingMessage = "Creating a new adventure for you...";
        this.error = null;
        
        console.log('Starting new story');
        
        // Clear the history when starting a new story
        this.storyHistory = [];
        this.lastChoice = null;
        
        // Set a loading placeholder for the new story
        this.currentStory = {
          text: "Your adventure is about to begin...",
          options: []
        };
        
        // Generate the initial story and options using AI
        const generatedStory = await generateInitialStory();
        
        this.currentStory = generatedStory;
      } catch (error) {
        console.error('Failed to generate story:', error);
        this.error = `Failed to generate story: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    },
    retryLastAction() {
      if (this.lastChoice) {
        // Retry the last choice
        this.selectOption(this.lastChoice);
      } else {
        // Start a new story if there was no last choice
        this.startNewStory();
      }
    },
    checkApiKeyStatus() {
      // Always use API mode regardless of key status
      this.usingDemoMode = false;
      console.log('API mode enforced, using real API calls');
      
      // Create a custom event to inform the aiPrompts module
      const event = new CustomEvent('demoModeChanged', { 
        detail: { usingDemoMode: false }
      });
      window.dispatchEvent(event);
    }
  },
  mounted() {
    // Check API key status first
    this.checkApiKeyStatus();
    
    // We don't start a new story automatically anymore
    // It will only start when the user clicks the Start button
    console.log('StoryDisplay component mounted with API mode enforced');
    
    // Listen for demo mode changes from other components but ignore them
    window.addEventListener('demoModeChanged', (event) => {
      // Ignore the incoming value and always use API mode
      this.usingDemoMode = false;
      console.log('Demo mode change event received but API mode enforced');
    });
  },
  beforeUnmount() {
    // Clean up event listeners
    window.removeEventListener('demoModeChanged');
  }
}
</script>

<style scoped>
/* Base styles */
.game-interface {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-height: 100vh; /* Ensure it doesn't exceed viewport height */
  overflow: hidden; /* Prevent scrolling of the entire interface */
  background-color: #f8f9fa;
  color: #343a40;
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  transition: background-color 0.3s ease;
}

/* Start Screen Styles */
.start-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f8f9fa;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  text-align: center;
}

.start-content {
  max-width: 600px;
  padding: 3rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease;
}

.start-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #2d3748;
}

.start-description {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 3rem;
  color: #4a5568;
}

.start-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: white;
  background-color: #4a6fa5;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(74, 111, 165, 0.3);
}

.start-button:hover {
  background-color: #3a5a8c;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(74, 111, 165, 0.4);
}

.start-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(74, 111, 165, 0.4);
}

.start-text {
  margin-right: 0.5rem;
}

.start-arrow {
  font-size: 1.6rem;
  margin-left: 0.5rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header styles */
.game-header {
  padding: 1rem 0.75rem;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  z-index: 10;
}

.game-title {
  margin: 0;
  font-size: 2.2rem;
  color: #343a40;
  font-weight: 300;
  letter-spacing: -0.5px;
}

/* Content container */
.game-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  height: calc(100vh - 130px); /* Adjust height to account for header and footer */
  overflow: hidden; /* Prevent scrolling of the entire content */
}

/* Scrollable story container */
.story-scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1rem 0 1rem;
  scrollbar-width: thin; /* For Firefox */
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent; /* For Firefox */
  display: flex;
  flex-direction: column;
  min-height: 0; /* Needed for Firefox */
}

/* Story bottom padding */
.story-bottom-padding {
  height: 2rem; /* Add more space at the bottom of the scrollable area */
}

/* Scrollbar styling for Webkit browsers (Chrome, Safari, Edge) */
.story-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.story-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.story-scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.story-scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

/* Story history styles */
.story-history {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.history-item {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  border-left: 3px solid #6c757d;
}

.history-text {
  margin: 0;
  text-align: left;
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #495057;
  letter-spacing: 0.01em;
  font-weight: 400;
}

.history-choice {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.choice-label {
  font-weight: 500;
  color: #6c757d;
}

.choice-text {
  color: #343a40;
  font-style: italic;
  padding: 0.25rem 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.segment-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
}

.divider-line {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  flex-grow: 1;
  margin: 0 1rem;
}

.marker-dot {
  width: 12px;
  height: 12px;
  background-color: #6c757d;
  border-radius: 50%;
}

/* Story container */
.story-container {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  border-left: 3px solid #2b6cb0;
  flex: 1; /* Make it grow to fill available space */
  display: flex;
  flex-direction: column;
}

.story-container:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.07);
  transform: translateY(-2px);
}

.story-container.loading {
  opacity: 0.7;
}

/* Story text */
.story-text {
  margin: 0;
  text-align: left;
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #212529;
  letter-spacing: 0.01em;
  font-weight: 400;
  flex: 1; /* Allow the text to grow and push other elements */
}

.story-text::first-letter {
  font-size: 1.6em;
  font-weight: 400;
  line-height: 1;
  padding-right: 0.1em;
  color: #495057;
}

.loading-indicator {
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
  font-style: italic;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.loading-animation {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 0.25rem;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #6c757d;
  border-radius: 50%;
  display: inline-block;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% { 
    transform: scale(0);
  } 
  40% { 
    transform: scale(1);
  }
}

/* Dark mode styles for loading animation */
@media (prefers-color-scheme: dark) {
  .dot {
    background-color: #cbd5e1;
  }
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 6px;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.retry-button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #c82333;
}

/* Fixed options container */
.fixed-options {
  padding: 0 1rem 1rem 1rem;
  background-color: #f8f9fa;
  z-index: 5;
}

/* Options panel */
.options-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  margin-top: 1rem;
}

.options-title {
  margin: 0 0 0.75rem 0;
  color: #212529;
  font-size: 1.3rem;
  font-weight: 500;
  position: relative;
  padding-bottom: 0.5rem;
}

.options-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background-color: #495057;
  opacity: 0.4;
}

.options-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
}

.option-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: transparent;
  color: #212529;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  text-align: left;
  font-weight: 500;
}

.option-button:last-child {
  margin-bottom: 0;
}

.option-button:hover:not(:disabled) {
  background-color: rgba(233, 236, 239, 0.7);
  border-color: #adb5bd;
  transform: translateY(-1px);
}

.option-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(108, 117, 125, 0.25);
}

.option-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.option-text {
  font-size: 0.95rem;
  line-height: 1.4;
}

.option-arrow {
  font-size: 1.1rem;
  margin-left: 1rem;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.3s ease;
}

.option-button:hover:not(:disabled) .option-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Footer styles */
.game-footer {
  padding: 1rem 0.75rem;
  text-align: center;
  font-size: 0.85rem;
  color: #6c757d;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: sticky;
  bottom: 0;
  background-color: #f8f9fa;
  z-index: 10;
}

.footer-controls {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.small-button {
  background-color: transparent;
  color: #6c757d;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.small-button:hover {
  background-color: #e9ecef;
  color: #495057;
}

/* Responsive styles */
@media (min-width: 768px) {
  .game-content {
    height: calc(100vh - 150px); /* Adjust for larger header/footer on bigger screens */
  }
  
  .story-scroll-container {
    padding: 2rem 2rem 0 2rem;
  }
  
  .fixed-options {
    padding: 0 2rem 2rem 2rem;
  }
  
  .story-bottom-padding {
    height: 2rem;
  }
  
  .game-header {
    padding: 1.5rem 1rem;
  }
  
  .story-container {
    padding: 2rem;
  }
  
  .history-item {
    padding: 2rem;
  }
  
  .options-panel {
    padding: 1.5rem;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
  
  .options-title {
    margin: 0 0 1.25rem 0;
    font-size: 1.4rem;
  }
  
  .game-footer {
    padding: 1.5rem 1rem;
  }
  
  .game-title {
    font-size: 2.5rem;
  }
  
  .option-button {
    padding: 1rem 1.25rem;
    margin-bottom: 0.75rem;
  }
  
  .option-text {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  .story-text {
    font-size: 1.125rem;
    line-height: 1.8;
  }
  
  .story-text::first-letter {
    font-size: 1.8em;
  }
  
  .history-text {
    font-size: 1.05rem;
    line-height: 1.7;
  }
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .game-interface {
    background-color: #1a1a2e;
    color: #e6e6e6;
  }
  
  .story-scroll-container::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .story-scroll-container::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  .story-scroll-container {
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent; /* For Firefox */
  }
  
  .fixed-options {
    background-color: #1a1a2e;
  }
  
  .game-header {
    background-color: #1a1a2e;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .game-footer {
    background-color: #1a1a2e;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    color: #adb5bd;
  }
  
  .game-title {
    color: #f8f9fa;
  }
  
  .story-container {
    background-color: #0f172a;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-left: 3px solid #3b82f6;
  }
  
  .history-item {
    background-color: rgba(15, 23, 42, 0.7);
    border-left: 3px solid #64748b;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  }
  
  .history-text {
    color: #cbd5e1;
  }
  
  .divider-line {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .marker-dot {
    background-color: #94a3b8;
  }
  
  .options-title {
    color: #f8f9fa;
  }
  
  .options-title::after {
    background-color: #f8f9fa;
    opacity: 0.2;
  }
  
  .options-panel {
    background-color: rgba(15, 23, 42, 0.7);
  }
  
  .story-text {
    color: #ffffff;
    text-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
  }
  
  .story-text::first-letter {
    color: #ffffff;
  }
  
  .option-button {
    color: #ffffff;
    border-color: #4b5563;
    background-color: rgba(30, 41, 59, 0.4);
  }

  .option-button:hover:not(:disabled) {
    background-color: rgba(71, 85, 105, 0.6);
    border-color: #94a3b8;
  }
  
  .option-button:focus {
    box-shadow: 0 0 0 3px rgba(203, 213, 225, 0.25);
  }
  
  .error-message {
    background-color: rgba(220, 38, 38, 0.2);
    color: #fca5a5;
  }
  
  .retry-button {
    background-color: #9f1239;
  }
  
  .retry-button:hover {
    background-color: #881337;
  }
  
  .choice-label {
    color: #94a3b8;
  }
  
  .choice-text {
    color: #e2e8f0;
    background-color: #1e293b;
  }
  
  .history-choice {
    border-top: 1px dashed rgba(255, 255, 255, 0.1);
  }
  
  .small-button {
    color: #adb5bd;
    border-color: #4b5563;
  }
  
  .small-button:hover {
    background-color: #334155;
    color: #f8fafc;
  }
}

/* For mobile devices */
@media (max-width: 480px) {
  .game-content {
    height: calc(100vh - 110px); /* Adjust for smaller header/footer on mobile */
  }
  
  .story-scroll-container {
    padding: 0.75rem 0.75rem 0 0.75rem;
  }
  
  .fixed-options {
    padding: 0 0.75rem 0.75rem 0.75rem;
  }
  
  .game-header {
    padding: 0.75rem 0.5rem;
  }
  
  .game-title {
    font-size: 1.8rem;
  }
  
  .story-container, .history-item {
    padding: 1.25rem;
  }
  
  .story-text, .history-text {
    font-size: 0.95rem;
    line-height: 1.5;
  }
  
  .options-panel {
    padding: 0.75rem;
    margin-top: 0.75rem;
  }
  
  .option-button {
    padding: 0.65rem 0.85rem;
  }
  
  .game-footer {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }
}
</style> 