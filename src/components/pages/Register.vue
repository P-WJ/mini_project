<template>
  <div
    class="flex justify-center items-center min-h-screen bg-[#e2f4ff] font-sans"
  >
    <div class="bg-white w-[400px] rounded-xl shadow-md p-6 text-center">
      <h1 class="text-2xl font-bold mb-6">회원가입</h1>

      <!-- 이메일 (아이디) -->
      <div class="mb-2 text-left">
        <input
          v-model="form.email"
          type="email"
          placeholder="이메일"
          class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <p
          class="text-sm mt-1"
          :class="{
            'text-green-600': isEmailValid,
            'text-red-500': !isEmailValid && form.email,
          }"
        >
          {{
            form.email
              ? isEmailValid
                ? "사용 가능한 이메일입니다."
                : "이메일 형식이 올바르지 않습니다."
              : ""
          }}
        </p>
      </div>

      <!-- 이름 -->
      <div class="mb-2 text-left">
        <input
          v-model="form.name"
          type="text"
          placeholder="이름"
          class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <!-- 비밀번호 -->
      <div class="mb-2 text-left">
        <input
          v-model="form.password"
          type="password"
          placeholder="비밀번호"
          class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <p
          class="text-sm mt-1"
          :class="{
            'text-green-600': isPasswordValid,
            'text-red-500': !isPasswordValid && form.password,
          }"
        >
          {{
            form.password
              ? isPasswordValid
                ? "사용 가능한 비밀번호입니다."
                : "영문 대소문자, 숫자, 특수문자 포함 8자 이상"
              : ""
          }}
        </p>
      </div>

      <!-- 비밀번호 확인 -->
      <div class="mb-4 text-left">
        <input
          v-model="form.confirmPassword"
          type="password"
          placeholder="비밀번호 확인"
          class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <p
          class="text-sm mt-1"
          :class="{
            'text-green-600': isPasswordMatch,
            'text-red-500': !isPasswordMatch && form.confirmPassword,
          }"
        >
          {{
            form.confirmPassword
              ? isPasswordMatch
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다."
              : ""
          }}
        </p>
      </div>

      <button
        @click="handleSubmit"
        class="w-full py-3 text-white rounded transition-colors"
        :class="{
          'bg-blue-500 hover:bg-blue-600': isFormValid,
          'bg-gray-400 cursor-not-allowed': !isFormValid,
        }"
        :disabled="!isFormValid"
      >
        가입
      </button>
      <div class="flex justify-end mt-4">
        <button @click="goToLogin">로그인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const form = reactive({
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
});

// 유효성 검사 정규식
const emailRegex = /^([a-zA-Z0-9_.+-]+)@([\da-zA-Z.-]+)\.([a-zA-Z.]{2,})$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const isEmailValid = computed(() => emailRegex.test(form.email));
const isPasswordValid = computed(() => passwordRegex.test(form.password));
const isPasswordMatch = computed(() => form.password === form.confirmPassword);
const isFormValid = computed(
  () =>
    isEmailValid.value &&
    isPasswordValid.value &&
    isPasswordMatch.value &&
    form.name
);

const router = useRouter();

const handleSubmit = async () => {
  if (!isFormValid.value) {
    alert("입력값을 다시 확인해주세요.");
    return;
  }

  try {
    const res = await axios.post("http://222.117.237.119:8111/auth/signup", {
      email: form.email,
      name: form.name,
      pwd: form.password,
    });

    if (res.data) {
      alert("회원가입 성공!");
      router.push("/");
    } else {
      alert("회원가입 실패!");
    }
  } catch (error) {
    console.error(error);
    alert("서버 오류로 가입 실패!");
  }
};

const goToLogin = () => {
  router.push("/");
  console.log(userEmail);
};
</script>
