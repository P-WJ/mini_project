<template>
  <div class="min-h-screen bg-transparent flex items-center justify-center p-4">
    <div class="grid grid-cols-2 gap-4 w-full max-w-4xl">
      <button
        class="bg-transparent border border-white text-white font-semibold py-6 rounded-lg"
        @click="navigateTo('/memberList')"
      >
        회원리스트
      </button>
      <button
        class="bg-transparent border border-white text-white font-semibold py-6 rounded-lg"
        @click="navigateTo('/board')"
      >
        게시판
      </button>
      <button
        class="bg-transparent border border-white text-white font-semibold py-6 rounded-lg"
        @click="navigateTo('/category')"
      >
        카테고리
      </button>
      <button
        class="bg-transparent border border-white text-white font-semibold py-6 rounded-lg"
        @click="navigateTo('/theme')"
      >
        테마 설정
      </button>
      <button
        class="bg-transparent border border-white text-white font-semibold py-6 rounded-lg"
        @click="navigateTo('/category')"
      >
        카테고리 설정
      </button>
      <button
        class="bg-transparent border border-white text-white font-semibold py-6 rounded-lg"
        @click="navigateTo('/news')"
      >
        뉴스
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();

const navigateTo = (path) => {
  router.push(path);
};

onMounted(() => {
  const isLogin = localStorage.getItem("isLogin");
  if (isLogin !== "TRUE") {
    router.push("/");
  }
});
</script>
