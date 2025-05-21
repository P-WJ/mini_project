import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  }),
  actions: {
    open({ title, message }) {
      this.title = title;
      this.message = message;
      this.onConfirm = this.onConfirm;
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
      this.onConfirm = null;
    },
    confirm() {
      if (typeof this.onConfirm === "function") {
        this.onConfirm();
      }
      this.close();
    },
  },
});
