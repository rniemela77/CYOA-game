<template>
  <StoryDisplay />
</template>

<script>
import StoryDisplay from './components/StoryDisplay.vue';

export default {
  name: 'App',
  components: {
    StoryDisplay
  }
}
</script>

<style>
/* Global styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Any global styles that need to be applied to the entire app */
</style> 