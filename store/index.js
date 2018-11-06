import Vuex from "vuex";

const init_state = {
  //api_url: 'http://localhost:3903',
  api_url: "https://admin-api-stage.medipocket.co.za",
  //api_url: 'https://admin-api.medipocket.co.za',

  //mobile_api_url: 'http://127.0.0.1:3201',
  //mobile_api_url: 'https://troy-api-stage.stratech.co.za',
  //mobile_api_url: 'https://troy-api.stratech.co.za',

  session: {
    navbar: [],
    authed: false,
    entity: {}
  },
  app: {
    id: "1",
    app_name: "medipocket"
  }
};

const createStore = () => {
  return new Vuex.Store({
    state: JSON.parse(JSON.stringify(init_state)),
    mutations: {
      // eslint-disable-next-line
      clear(state) {
        state = JSON.parse(JSON.stringify(init_state));
      }
    }
  });
};

export default createStore;
