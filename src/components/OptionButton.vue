<template>
  <button 
    class="option-button"
    @click="$emit('select')"
  >
    <div class="option-content">
      <span class="option-text">{{ text }}</span>
    </div>
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
  display: block;
  width: 100%;
  background-color: #2c3e50;
  border: 2px solid #f39c12;
  border-radius: 6px;
  margin-bottom: 1rem;
  padding: 0;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.option-button:last-child {
  margin-bottom: 0;
}

.option-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.3);
  border-color: #e74c3c;
}

.option-button:active {
  transform: translateY(1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.option-content {
  padding: 1rem 1.5rem;
  position: relative;
  z-index: 2;
}

.option-text {
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  display: block;
  text-align: left;
}

.option-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background-color: #e74c3c;
  transition: width 0.3s ease;
  z-index: 1;
}

.option-button:hover::before {
  width: 100%;
}
</style> 