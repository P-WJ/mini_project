<template>
  <ul>
    <li v-for="cate in cates">
      <p>카테고리 : {{ cate.categoryName }}</p>
      <p>이메일 : {{ cate.email }}</p>
    </li>
  </ul>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const cates = ref([]);

const getCategory = async () => {
  try {
    const res = await axios.get(
      "http://222.117.237.119:8111/api/category/list"
    );
    cates.value = res.data;
  } catch (err) {
    console.log(err);
    alert("실패");
  }
};

onMounted(() => {
  getCategory();
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
