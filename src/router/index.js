import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CampagnesView from "../views/CampagnesView.vue";
import ControlPlayersView from "../views/ControlPlayersView.vue";
import MjView from "../views/MjView.vue";
import PlayerView from "../views/PlayerView.vue";
import ControlContentView from "../views/ControlContentView.vue";
import ControlChaptersView from "../views/ControlChaptersView.vue";
import ControlQuestsView from "../views/ControlQuestsView.vue";

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
    },
    {
      path: "/contenu",
      name: "content",
      component: ControlContentView
    },
    {
      path: "/chapitres",
      name: "chapitres",
      component: ControlChaptersView
    },
    {
      path: "/quetes",
      name: "quetes",
      component: ControlQuestsView
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
