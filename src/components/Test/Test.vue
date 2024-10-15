<script setup lang="ts">
import { ref } from 'vue';

const example = ref<string>('Component name, Test!');
</script>

<template>
  <div class="test">
    {{ example }}
  </div>
</template>

<style scoped>
.test {
  
}
</style>
