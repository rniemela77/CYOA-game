<template>
  <GameInterface :title="'The Epic Adventure'" :footerText="'© 2023 CYOA Game • Your journey, your choices'">
    <template #story>
      <StoryComponent :text="currentStory.text" />
    </template>
    
    <template #options>
      <OptionsComponent :options="currentStory.options" @select-option="handleOptionSelect" />
    </template>
  </GameInterface>
</template>

<script>
import GameInterface from './components/GameInterface.vue';
import StoryComponent from './components/StoryComponent.vue';
import OptionsComponent from './components/OptionsComponent.vue';

export default {
  name: 'App',
  components: {
    GameInterface,
    StoryComponent,
    OptionsComponent
  },
  data() {
    return {
      currentStory: {
        text: "You find yourself standing at the entrance of a mysterious cave. The wind howls through the opening, carrying whispers of adventure and danger. The path ahead is shrouded in darkness, but something about it calls to you, stirring feelings of both excitement and trepidation.",
        options: [
          "Enter the cave cautiously, keeping your senses alert for any danger",
          "Look for another way around, perhaps there's a safer path to your destination",
          "Call out to see if anyone is inside the cave before proceeding",
          "Gather some nearby branches to create a torch before venturing into the darkness"
        ]
      },
      storyHistory: []
    };
  },
  methods: {
    handleOptionSelect(option) {
      // Save current story to history
      this.storyHistory.push({...this.currentStory});
      
      // In the future, this will trigger an API call to generate the next part of the story
      alert(`You chose: ${option}. This will generate the next part of your adventure!`);
      
      // For now, simulate a new story part with a placeholder
      this.currentStory = {
        text: `You decided to ${option.toLowerCase()}. [This is where the AI-generated content would continue the story based on your choice.]`,
        options: [
          "Continue forward deeper into the unknown",
          "Reconsider your decision and try a different approach",
          "Take a moment to assess your surroundings more carefully",
          "Call out for help, hoping someone might hear you"
        ]
      };
    }
  }
}
</script> 