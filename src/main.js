import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/styles/global.css'
import '@/assets/styles/style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)
app.use(ElementPlus, {size: 'default', zIndex: 3000})
app.mount('#app')
