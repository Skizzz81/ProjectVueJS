import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CampagnesView from "../views/CampagnesView.vue";
import ControlPlayersView from "../views/ControlPlayersView.vue";
import MjView from "../views/MjView.vue";
import PlayerView from "../views/PlayerView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/mj",
      name: "mj",
      component: MjView
    },
    {
      path: "/joueur",
      name: "joueur",
      component: PlayerView
    },
    {
      path: "/joueurs",
      name: "players",
      component: ControlPlayersView
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
