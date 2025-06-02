<template>
  <div class="container">
    <ul>
      <li v-for="user in users" :key="user.email" @click="selectUser(user)">
        <p>이름: {{ user.name }}</p>
        <p>이메일: {{ user.email }}</p>
        <p>가입일: {{ user.regDate }}</p>
      </li>
    </ul>
    <div class="user-detail">
      <div v-if="selectedUser">
        <p>이름 : {{ selectedUser.name }}</p>
        <p>이메일 : {{ selectedUser.email }}</p>
        <p>가입일 : {{ selectedUser.regDate }}</p>
        <div v-if="realUser()"><button @click="startEdit()">수정</button></div>
        <div v-if="isEditMode">
          이름 : <input v-model="editName" /> <br />
          비밀번호 : <input v-model="editPwd" /><br />
          <button @click="cancelEdit()">취소</button>
          <button @click="saveEdit()">저장</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../store/UserData";

const userStore = useAuthStore();

const users = ref([]);

const selectedUser = ref(null);
const editName = ref("");
const editPwd = ref("");
const isEditMode = ref(false);

const getUserList = async () => {
  try {
    const res = await axios.get("http://222.117.237.119:8111/users/list");
    users.value = res.data;
  } catch (err) {
    console.error(err);
    alert("실패");
  }
};

const selectUser = (user) => {
  selectedUser.value = user;
  isEditMode.value = false;
};

const realUser = () => {
  if (localStorage.getItem("email") === selectedUser.value.email) {
    return true;
  } else {
    return false;
  }
};

const startEdit = () => {
  isEditMode.value = true;
};

onMounted(() => {
  getUserList();
});

const cancelEdit = () => {
  isEditMode.value = false;
};

const saveEdit = async () => {
  try {
    const payload = {
      email: selectedUser.value.email,
      name: editName.value,
      pwd: editPwd.value,
      image: selectedUser.value.image || "", // 빈 문자열로 대체 가능
      regDate: selectedUser.value.regDate,
    };

    const res = await axios.put(
      "http://222.117.237.119:8111/users/modify",
      payload
    );
    console.log("요청 보낸 내용:", payload);
    console.log("응답 내용:", res.data);

    if (res.data === true) {
      alert("수정 완료");
      isEditMode.value = false;
      await getUserList(); // 목록 갱신
    }
    if (userStore.email === selectedUser.value.email) {
      userStore.setUserData({
        name: editName.value,
        email: userStore.email,
        password: userStore.password,
      });
    } else {
      alert("수정 실패");
    }
  } catch (err) {
    console.log(err);
    alert("요청 실패");
  }
};
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
  cursor: pointer;
  flex-grow: 1;
}
.user-detail {
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 50px;
  background-color: cadetblue;
}
.container {
  display: flex;
  justify-content: center;
}
</style>
