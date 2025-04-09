<template>
  <div class="game-interface">
    <div class="game-header">
      <h1 class="game-title">{{ title }}</h1>
    </div>
    
    <div class="game-content">
      <div class="story-container">
        <slot name="story"></slot>
      </div>
      
      <div class="options-panel">
        <h3 class="options-title">What will you do?</h3>
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
  background-color: #f8f9fa;
  color: #343a40;
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  transition: background-color 0.3s ease;
}

.game-header {
  padding: 1rem 0.75rem;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.game-title {
  margin: 0;
  font-size: 2.2rem;
  color: #343a40;
  font-weight: 300;
  letter-spacing: -0.5px;
}

.game-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1.5rem;
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
}

.story-container {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.story-container:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.07);
  transform: translateY(-2px);
}

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

.game-footer {
  padding: 1rem 0.75rem;
  text-align: center;
  font-size: 0.85rem;
  color: #6c757d;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

@media (min-width: 768px) {
  .game-content {
    padding: 2rem 1.5rem;
    gap: 2rem;
  }
  
  .game-header {
    padding: 1.5rem 1rem;
  }
  
  .story-container {
    padding: 2rem;
  }
  
  .options-panel {
    padding: 1.5rem;
    gap: 0.75rem;
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
}

@media (prefers-color-scheme: dark) {
  .game-interface {
    background-color: #1a1a2e;
    color: #e6e6e6;
  }
  
  .game-title {
    color: #f8f9fa;
  }
  
  .story-container {
    background-color: #0f172a;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .options-title {
    color: #f8f9fa;
  }
  
  .options-title::after {
    background-color: #f8f9fa;
    opacity: 0.2;
  }
  
  .game-footer {
    color: #adb5bd;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .game-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .options-panel {
    background-color: rgba(15, 23, 42, 0.7);
  }
}
</style> 