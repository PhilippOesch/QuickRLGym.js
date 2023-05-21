import { SimpleTabsPlugin } from 'simple-tabs-vue';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(<any>SimpleTabsPlugin);
});
