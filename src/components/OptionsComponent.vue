<template>
  <div class="options-container">
    <OptionButton 
      v-for="(option, index) in options" 
      :key="index" 
      :text="option"
      @select="$emit('select-option', option)"
    />
  </div>
</template>

<script>
import OptionButton from './OptionButton.vue';

export default {
  name: 'OptionsComponent',
  components: {
    OptionButton
  },
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  emits: ['select-option']
}
</script>

<style scoped>
.options-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
  transition: all 0.3s ease;
}
</style> 