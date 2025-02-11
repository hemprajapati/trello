import { createApp } from 'vue'
import App from './App.vue'
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import { RecycleScroller } from 'vue-virtual-scroller'
import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'v-calendar/style.css';

const app = createApp(App)
app.component('RecycleScroller', RecycleScroller)
app.use(setupCalendar, {})
app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)
app.mount('#app')
