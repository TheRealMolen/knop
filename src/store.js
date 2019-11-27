import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    installEvent: null,
    clientKey: null,

    druks: {},
  },
  mutations: {

    setInstallEvent(state, evt) {
      state.installEvent = evt;
    },

    setClientKey(state, key) {
      // eslint-disable-next-line no-console
      console.log(`setting client key to ${key}`);
      state.clientKey = key;
    },


    addDrukLocal(state, { name, druk }) {
      if (typeof state.druks[name] === 'undefined') {
        Vue.set(state.druks, name, []);
      }

      state.druks[name].push(druk);
    },
  },

  actions: {
    onDruk({ commit, state }, { config, payload }) {
      const druk = {
        client: state.clientKey,
        ...payload,
      };

      // save locally immediately
      commit('addDrukLocal', {
        name: config.name,
        druk,
      });

      // add the knop name for the server (should be a url param?)
      druk.knop = config.name;

      // also send to the server (this should get cached by our service worker...?)
      axios.post('/api/drukjes', druk)
        .then(_response => {
          console.log('succes posting a drukje!');
          console.log(druk);
        })
        .catch(err => {
          console.warn(`Failed to upload a drukje: ${JSON.stringify(druk)}`);
          console.log(err);
        });
    },
  },
});
