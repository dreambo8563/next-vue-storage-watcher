import { createApp } from 'vue'
import App from './App.vue'

import {createWatcher}from "./lib/main"

createApp(App).use(createWatcher({
    prefix:"test"
})).mount('#app')
