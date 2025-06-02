import { createRouter, createWebHistory } from "vue-router";
import Layout from "../Layout.vue";
import Login from "../pages/Login.vue";
import MemberList from "../pages/MemberList.vue";
import Register from "../pages/Register.vue";
import Home from "../pages/Home.vue";
import ThemeSetting from "../pages/ThemeSetting.vue";
import Category from "../pages/Category.vue";
import Board from "../pages/Board.vue";

const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },

  {
    // Layout을 항상 띄우가 위해, Layout을 상위 컴포넌트로 지정 후, children으로 자식 페이지 설정
    path: "/home",
    component: Layout,
    children: [
      {
        path: "",
        component: Home,
      },
      {
        path: "/memberList",
        component: MemberList,
      },
      {
        path: "/category",
        component: Category,
      },
      {
        path: "/theme",
        component: ThemeSetting,
      },
      {
        path: "/board",
        component: Board,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
