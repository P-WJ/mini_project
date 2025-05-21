import { defineStore } from "pinia";

export const useAuthStore = defineStore("UserData", {
  state: () => ({
    email: "",
    password: "",
    name: "",
  }),
  actions: {
    setUserData({ name, email, password }) {
      this.email = email;
      this.password = password;
      this.name = name;
    },
  },
  persist: true, // ✅ 자동으로 localStorage에 저장됨
});
