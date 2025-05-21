<template>
  <button
    @click="onClick"
    class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
  >
    <slot>기본 버튼</slot>
  </button>
</template>

<script setup>
const emit = defineEmits(["click"]);
const onClick = (event) => {
  emit("click", event);
};
</script>
