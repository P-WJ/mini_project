import { createRouter, createWebHistory } from "vue-router";
import Layout from "../Layout.vue";
import Login from "../pages/Login.vue";
import MemberList from "../pages/MemberList.vue";
import Register from "../pages/Register.vue";

const routes = [
  {
    // Layout을 항상 띄우가 위해, Layout을 상위 컴포넌트로 지정 후, children으로 자식 페이지 설정
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        component: Login,
      },
      {
        path: "/register",
        component: Register,
      },
      {
        path: "/memberList",
        component: MemberList,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
