import { createApp } from 'vue'
import App from './App.vue'
import './global.css'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)
app.use(ElementPlus, {size: 'small', zIndex: 3000})
app.mount('#app')
