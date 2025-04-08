<template>
  <div class="game-interface">
    <div class="game-header">
      <h1>{{ title }}</h1>
    </div>
    
    <div class="game-content">
      <div class="scroll-container">
        <div class="story-scroll">
          <slot name="story"></slot>
        </div>
      </div>
      
      <div class="options-panel">
        <h3>What will you do?</h3>
        <slot name="options"></slot>
      </div>
    </div>
    
    <div class="game-footer">
      <p>{{ footerText }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameInterface',
  props: {
    title: {
      type: String,
      default: 'Choose Your Own Adventure'
    },
    footerText: {
      type: String,
      default: 'Your journey awaits...'
    }
  }
}
</script>

<style scoped>
.game-interface {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #2c3e50;
  color: #ecf0f1;
  font-family: 'Roboto', sans-serif;
}

.game-header {
  background-color: #34495e;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.game-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #e74c3c;
  font-family: 'Cinzel', serif;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.game-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.scroll-container {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23d2b48c" opacity="0.2"/><path d="M0 0L100 100M100 0L0 100" stroke="%23000" stroke-width="1" opacity="0.1"/></svg>');
  border-radius: 8px;
  border: 2px solid #8b4513;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.story-scroll {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #333;
  background-color: rgba(255, 253, 240, 0.9);
  padding: 1.5rem;
  border-radius: 4px;
}

.options-panel {
  background-color: #34495e;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.options-panel h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #f39c12;
  text-align: center;
  font-size: 1.4rem;
}

.game-footer {
  background-color: #34495e;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: #95a5a6;
}

@media (min-width: 768px) {
  .game-content {
    padding: 2rem;
  }
}
</style> 