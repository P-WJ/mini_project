<template>
  <ul>
    <li v-for="board in boardList">
      <p style="font-size: 24px">제목 : {{ board.title }}</p>
      <p>내용 : {{ board.content }}</p>
    </li>
  </ul>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

const boardList = ref([]);

const getBoardList = async () => {
  try {
    const res = await axios.get("http://222.117.237.119:8111/api/board/list");
    boardList.value = res.data;
  } catch (err) {
    console.error(err);
    alert("실패");
  }
};

onMounted(() => {
  getBoardList();
});
</script>

<style scoped>
li {
  display: flex;
  flex-direction: column;
  margin: 20px;
  background-color: bisque;
}
</style>
