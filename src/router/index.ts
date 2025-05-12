import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import AccountsComponent from "../components/accountsComponent/AccountsComponent.vue";
import UserActivity from '../components/homeComponent/UserActivities.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/user-activity' },
  { path: '/accounts', name: 'Accounts', component: AccountsComponent },
  { path: '/user-activity', name: 'UserActivity', component: UserActivity }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});