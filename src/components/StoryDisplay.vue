<template>
  <div>
    <div id="story-container" v-html="`<p>${story.text}</p>`"></div>
    
    <div id="options-container">
      <button 
        v-for="(option, index) in story.options" 
        :key="index"
        @click="selectOption(option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoryDisplay',
  data() {
    return {
      story: {
        text: "You find yourself standing at the entrance of a mysterious cave. The wind howls through the opening, carrying whispers of adventure and danger.",
        options: [
          "Enter the cave cautiously",
          "Look for another way around",
          "Call out to see if anyone is inside"
        ]
      }
    }
  },
  methods: {
    selectOption(option) {
      // In the future, this will trigger an API call to generate the next part of the story
      alert(`You chose: ${option}. This will generate the next part of your adventure!`);
    }
  },
  mounted() {
    // This initializes the component when it's mounted in the DOM
    // Similar to the DOMContentLoaded event in the original code
  }
}
</script>

<style scoped>
/* Add component-specific styles here */
</style> 