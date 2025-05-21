<template>
  <ul>
    <p>{{ userInfo.name }} 님</p>
    <p>email: {{ userInfo.email }}</p>

    <li v-for="user in users" key="user.id">
      <p>이름: {{ user.name }}</p>
      <p>이메일: {{ user.email }}</p>
      <p>가입일: {{ user.regDate }}</p>
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../../map/store/UserData";
const users = ref([]);
const userInfo = useAuthStore();
const getUserList = async () => {
  try {
    const res = await axios.get("http://222.117.237.119:8111/users/list");
    users.value = res.data;
  } catch (err) {
    console.error(err);
    alert("실패");
  }
};

onMounted(() => {
  getUserList();
});
</script>

<style scoped>
ul {
  display: flex;
  flex-direction: column;
  align-items: center;
}
li {
  background-color: bisque;
  list-style: none;
  margin: 10px;
  text-align: center;
  width: 500px;
}
</style>
