import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CampagnesView from "../views/CampagnesView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    }
    ,
    {
      path: "/campagnes",
      name: "campagnes",
      component: CampagnesView
    }
    
  ]
});

export default router;