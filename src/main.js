import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import firebase from 'firebase'
import Notification from 'vue-notification'

// Install BootstrapVue

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(Notification)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

var firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECTID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log(process.env.VUE_APP_SECRET_KEY)

new Vue({
  render: h => h(App),
}).$mount('#app')
