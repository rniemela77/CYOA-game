<template>
  <button 
    class="option-button"
    @click="$emit('select')"
  >
    <span class="option-text">{{ text }}</span>
    <span class="option-arrow">→</span>
  </button>
</template>

<script>
export default {
  name: 'OptionButton',
  props: {
    text: {
      type: String,
      required: true
    }
  },
  emits: ['select']
}
</script>

<style scoped>
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

.option-button:hover {
  background-color: rgba(233, 236, 239, 0.7);
  border-color: #adb5bd;
  transform: translateY(-1px);
}

.option-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(108, 117, 125, 0.25);
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

.option-button:hover .option-arrow {
  opacity: 1;
  transform: translateX(0);
}

@media (min-width: 768px) {
  .option-button {
    padding: 1rem 1.25rem;
    margin-bottom: 0.75rem;
  }
  
  .option-text {
    font-size: 1rem;
    line-height: 1.5;
  }
}

@media (prefers-color-scheme: dark) {
  .option-button {
    color: #ffffff;
    border-color: #4b5563;
    background-color: rgba(30, 41, 59, 0.4);
  }

  .option-button:hover {
    background-color: rgba(71, 85, 105, 0.6);
    border-color: #94a3b8;
  }
  
  .option-button:focus {
    box-shadow: 0 0 0 3px rgba(203, 213, 225, 0.25);
  }
}
</style> 