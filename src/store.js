import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    clientKey: null,

    druks: {},
  },
  mutations: {

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
    onDruk({ commit, state }, config) {
      const druk = {
        client: state.clientKey,
        ...config.payload,
      };

      // save locally immediately
      commit('addDrukLocal', {
        name: config.name,
        druk,
      });

      // also send to the server (this should get cached by our service worker...?)
      axios.post('/api/drukjes', druk)
        .then((response) => {
          console.log('success posting a drukje!');
          console.log(response);
        })
        .catch((err) => {
          console.warn(`Failed to upload a drukje: ${JSON.stringify(druk)}`);
          console.log(err);
        });
    },
  },
});
