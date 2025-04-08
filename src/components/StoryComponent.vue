<template>
  <div class="story-container">
    <p>{{ text }}</p>
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
  font-family: 'Georgia', serif;
  line-height: 1.8;
}

p {
  margin: 0;
  text-align: justify;
  text-indent: 1.5em;
  position: relative;
}
</style> 