<template>
  <div class="min-h-screen flex items-center justify-center bg-[#e2f4ff]">
    <div class="bg-white w-[400px] p-6 rounded-xl shadow-md">
      <h1 class="text-2xl font-bold text-center mb-6">로그인</h1>

      <!-- 아이디 입력 -->
      <div class="mb-4">
        <input
          type="text"
          placeholder="아이디"
          v-model="form.email"
          class="w-full px-4 py-3 border rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <!-- 비밀번호 입력 -->
      <div class="mb-4">
        <input
          type="password"
          placeholder="비밀번호"
          v-model="form.password"
          class="w-full px-4 py-3 border rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <!-- 로그인 버튼 -->
      <button
        @click="checkLogin"
        class="w-full py-3 text-white bg-blue-500 hover:bg-blue-600 rounded transition"
      >
        로그인
      </button>

      <!-- 회원가입 링크 -->
      <div class="flex justify-end mt-4">
        <button @click="goToRegister">회원가입</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../store/UserData";
import { useModalStore } from "../store/modal";

const form = reactive({
  email: "",
  password: "",
});

const users = ref([]);
const router = useRouter();
const AuthStore = useAuthStore();
const modal = useModalStore();

const loginAction = () => {
  localStorage.setItem("isLogin", "TRUE");
  localStorage.setItem("email", form.email);
};

const checkLogin = async () => {
  try {
    const res = await axios.get("http://222.117.237.119:8111/users/list");
    users.value = res.data;

    const matchedUser = users.value.find(
      (user) => user.email === form.email && user.pwd === form.password
    );

    if (matchedUser) {
      AuthStore.setUserData({
        name: matchedUser.name,
        email: matchedUser.email,
        password: matchedUser.pwd,
      });
      console.log(AuthStore.name); // 저장된 이름
      console.log(AuthStore.email); // 저장된 이메일
      console.log(AuthStore.password); // 저장된 비밀번호

      modal.open({
        title: "로그인 성공",
        message: `${matchedUser.email} 로 로그인`,
        hasCancel: false,
        onConfirm: loginAction,
      });
      router.push("/home");
    } else {
      modal.open({
        title: "로그인 실패",
        message: "아이디 또는 비밀번호가 틀렸습니다.",
        hasCancel: false,
      });
    }
  } catch (error) {
    console.error(error);
    modal.open({
      title: "로그인 실패",
      message: "서버 오류로 로그인 실패",
      hasCancel: false,
    });
  }
};
const goToRegister = () => {
  router.push("/register");
};
</script>
