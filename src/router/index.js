import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CampagnesView from "../views/CampagnesView.vue";
import CampagneActiveView from "../views/CampagneActiveView.vue";
import ControlPlayersView from "../views/ControlPlayersView.vue";
import ControlChapitresView from "../views/ControlChapitresView.vue";
import MjView from "../views/MjView.vue";
import PlayerView from "../views/PlayerView.vue";
import ProgressionView from "../views/ProgressionView.vue";
import InventaireView from "../views/InventaireView.vue";
import ActionsView from "../views/ActionsView.vue";
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
      path: "/quetes",
      name: "quetes",
      component: ControlQuestsView
    }
    ,
    {
      path: "/campagnes",
      name: "campagnes",
      component: CampagnesView
    },
    {
      path: "/campagneactive",
      name: "campagneactive",
      component: CampagneActiveView
    },
    {
      path: "/chapitres",
      name: "chapitres",
      component: ControlChapitresView
    },
    {
      path: "/joueur/progression",
      name: "progression",
      component: ProgressionView
    },
    {
      path: "/joueur/inventaire",
      name: "inventaire",
      component: InventaireView
    },
    {
      path: "/joueur/actions",
      name: "actions",
      component: ActionsView
    }
    
  ]
});

export default router;
