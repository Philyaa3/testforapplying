import { defineStore } from 'pinia';

export const useDarkStore = defineStore('dark', {
    state: () => ({ dark: false }),
    actions: {
        toggle(val: boolean) {
            this.dark = val;
        }
    },
    persist: true
});