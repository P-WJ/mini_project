<template>
  <div class="flex flex-col min-h-screen">
    <header style="background: #eee; padding: 1rem; text-align: center">
      <span>{{ userInfo.name }} 님 email: {{ userInfo.email }} </span>
    </header>
    <main class="flex-1">
      <!-- 여기에 자식 페이지가 들어감 -->
      <router-view />
    </main>
    <footer style="background: #eee; padding: 1rem; text-align: center">
      2025 Vue 예제 사이트. 모든 권리 보유.
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from "./store/UserData";
const userInfo = useAuthStore();
</script>
