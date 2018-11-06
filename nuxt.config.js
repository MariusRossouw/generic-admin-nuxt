const pkg = require("./package");

module.exports = {
  mode: "spa",

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: "#3B8070" },

  /*
  ** Global CSS
  */
  css: [
    "@/node_modules/uikit/dist/css/uikit.min.css",
    "@/assets/custom.css",
    "@/node_modules/ag-grid/dist/styles/ag-grid.css",
    "@/node_modules/ag-grid/dist/styles/ag-theme-balham.css"
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [{ src: "~/plugins/third_party.js", ssr: false }],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    "@nuxtjs/axios",
    "nuxt-fontawesome"
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },
  // buildDir: '_nuxt',
  /*
  ** Build configuration
  */
  build: {
    /*
  ** You can extend webpack config here
  */
    extractCSS: true,
    cssSourceMap: false,
    vendor: ["~/plugins/third_party.js"],
    extend(config, ctx) {
      config.resolve.alias["vue"] = "vue/dist/vue.common";
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: [/(node_modules)/, /dist/]
        });
      }
    }
    // publicPath: '_nuxt/dist/'
  }
};
