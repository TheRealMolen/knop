import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';


// listen for the event that allows users to install
window.addEventListener('beforeinstallprompt', e => {
  // Stash the event so it can be triggered later.
  store.commit('setInstallEvent', e);
});



function loadOrGenClientKey() {
  const loaded = localStorage.getItem('client-key');
  if (loaded) {
    return loaded;
  }

  const digits = [];
  for (let i = 0; i < 8; i += 1) {
    digits.push((Math.floor(Math.random() * 30)).toString(30));
  }
  const generated = digits.join('');
  localStorage.setItem('client-key', generated);
  return generated;
}

// make certain we have a client key
store.commit('setClientKey', loadOrGenClientKey());


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
