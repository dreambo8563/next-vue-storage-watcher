import { createApp } from 'vue'
import App from './App.vue'

import {createWatcher}from "./lib/main"
export const lsWatcher = createWatcher({
    prefix:"test_ls_"
})

export const ssWatcher =createWatcher({
    prefix:"test_ss_",
    storage:"session"
})
createApp(App).use(lsWatcher).use(ssWatcher).mount('#app')

// use is outside setup function

lsWatcher.setItem("out","set in main.ts")