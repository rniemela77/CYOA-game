<template>
  <div class="story-container">
    <p class="story-text">{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: 'StoryComponent',
  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.story-container {
  width: 100%;
}

.story-text {
  margin: 0;
  text-align: left;
  font-family: 'Merriweather', 'Georgia', serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #212529;
  letter-spacing: 0.01em;
  font-weight: 400;
}

.story-text::first-letter {
  font-size: 1.6em;
  font-weight: 400;
  line-height: 1;
  padding-right: 0.1em;
  color: #495057;
}

@media (min-width: 768px) {
  .story-text {
    font-size: 1.125rem;
    line-height: 1.8;
  }
  
  .story-text::first-letter {
    font-size: 1.8em;
  }
}

@media (prefers-color-scheme: dark) {
  .story-text {
    color: #ffffff;
    text-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
  }
  
  .story-text::first-letter {
    color: #ffffff;
  }
}
</style> 