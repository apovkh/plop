<script setup lang="ts">
import {
 ref, 
 computed, 
 watch, 
  onMounted
} from 'vue';

defineProps<{ 
  counter: number;
}>();

const counter = ref(0);

const doubleCounter = computed(() => counter.value * 2);

function increment() {
  counter.value++;
}

defineEmits(['incremented']);

watch(counter, (newVal) => {
  console.log('Counter changed to:', newVal);
});

onMounted(() => {
  // Fetch API data here
});
</script>

<template>
  <div class="test-component">
      <p></p>

      <p>Reactive counter: </p>

      <p>Computed double counter: </p>

      <button @click="increment">Increment</button>
  </div>
</template>

<style scoped lang="scss">
  .test-component {
    /* Component-specific styles */
  }
</style>
