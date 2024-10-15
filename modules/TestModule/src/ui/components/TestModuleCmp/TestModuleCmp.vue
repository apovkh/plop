<script setup lang="ts">
    import {
       ref 
       computed 
       watch 
    } from 'vue';

    defineProps<{ 
      propValue: string;
    }>();

    const exampleStr = ref('This is a state example');

    const computedValue = computed(() => {
      return 'This is a computed value';
    });

    function exampleAction() {
      alert('Action executed');
    }

    defineEmits(['exampleEvent']);

    watch(exampleStr, (newVal) => {
      console.log('exampleStr changed:', newVal);
    });
</script>

<template>
  <div class="test-module-cmp">
      <p></p>

      <p></p>

      <p>Prop Value: </p>

      <button @click="exampleAction">Click me</button>
  </div>
</template>

<style scoped lang="scss">
  .test-module-cmp {
    /* Component-specific styles */
  }
</style>
