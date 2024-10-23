<script setup lang="ts">
import { Test } from './components/Test'
// import { generatorComponent } from '../modules/code-generator/src/plop'
// console.log(generatorComponent());
interface exampleProp {
  item: string
}
const props = defineProps<exampleProp>()

interface BaseEmitType = Record < Record<any, string>, string: <T>>

  interface exampleEmitType {

}

interface exampleEmit extend BaseEmitType {
  (e: 'example-click', payload: exampleEmitType): void
}

(e: 'example-click'): void


const emit = defineEmits<exampleEmit>()

</script>

<script lang="ts">
export default { inheritAttrs: false }
</script>

<template>
  <h1>
    Plop component
  </h1>
  <Test />
</template>

<style scoped></style>
