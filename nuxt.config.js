const path = require('path')
const MongoClient = require('mongodb').MongoClient

const SPA = process.argv.includes('--spa')

module.exports = {
  env: {
    PROD: process.env.PROD || false,
    API_QL_URL: process.env.API_QL_URL || 'http://localhost:5000/graphql',
    BACKEND_API: process.env.BACKEND_API || 'http://127.0.0.1:8000/api/',
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000/',
  },

  /*
  ** Headers of the page
  */
  head: {
    title: 'DTrip: Write about travel, earn, travel.',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description',
        name: 'description',
        content: 'DTrip is global tourist knowledge base, social network and a new generation corporation. You can write articles about your travels, interesting places and get paid for it.'
      },
      // { property: 'og:image', content: '' },
			{ name: "msapplication-TileColor", content: "#da532c"},
			{ name: "theme-color", content: "#ffffff"},

      { name: "yandex-verification", content: "3001fd7a8873feea"},
      { name: "google-site-verification", content: "9I09Urp97DzUqnO2i2B8l7ddZ14vCiSWDoZlFIf7ilE"}
    ],

    link: [
      // TODO Logo here
			{ rel: 'icon', type: 'image/x-icon', href: 'favicon.ico'},

      // TODO Выпилить бутстрап полностью и взять только утилиты и сетку
			//{ rel: "stylesheet", type: "text/css", href: "https://cdn.jsdelivr.net/npm/bootstrap-utilities@4.0.0/bootstrap-utilities.css"},
    ],
  },
  css: [
    '@/assets/css/main.css',
    'vue-js-modal/dist/styles.css' // FIXME not working by default
  ],
  modules: [
    '@nuxtjs/apollo',
    '@nuxtjs/sentry',
    'bootstrap-vue/nuxt',
    'nuxt-device-detect',
    '@nuxtjs/font-awesome',
    '@nuxtjs/sitemap',
  ],
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: process.env.API_QL_URL || 'http://localhost:5000/graphql',
      },
    }
  },
  plugins: [
    // Плагин в котором лежат все вызовы при запуске клиента
    {ssr: false, src: '~/plugins/startapp.js'},

    {ssr: false, src: '~/plugins/localStorage.js'},
    {ssr: false, src: '~/plugins/vuelidate.js'},
    {ssr: false, src: '~/plugins/vue-quill-editor.js'},
    {ssr: false, src: '~/plugins/vue-notification.js'},
    {ssr: false, src: '~/plugins/vue-clipboard2.js'},
    // {ssr: false, src: '~/plugins/vue-tel-imput.js'},

    '~/plugins/vue-js-modal',
    '~/plugins/vue-google-maps',
    '~/plugins/infiniteload.js',
    '~/plugins/filters.js',
    '~/plugins/vuex-router-sync.js',
    '~/plugins/elements.js',
    '~/plugins/element-ui.js',
    '~/plugins/steemconnect'
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },

  /*
  ** Build configuration
  */
  build: {
    cssSourceMap: false,

    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      if (SPA) {
        config.output.publicPath = './_nuxt/'
      }
    },
  },

  router: {
    mode: SPA ? 'hash' : 'universal',
    linkActiveClass: 'active',

    extendRoutes(routes, resolve) {
      routes.push({
        name: 'account',
        path: '/@:account',
        component: resolve(__dirname, 'pages/AccountPage.vue')
      })

      routes.push({
        name: 'post',
        path: '/@:author/:permlink',
        component: resolve(__dirname, 'components/post/PostSinglePage.vue')
      })
    }
  },

  loading: {
    color: 'white',
    height: '3px'
  },

  cache: {
    maxAge: 1000 * 60 * 2
  },

  sitemap: SPA ? {
    //cacheTime: 1000 * 60 * 15,
    gzip: true,
    exclude: [
      '/errors/**'
    ],

    async routes() {
      const client = await MongoClient.connect('mongodb://db:27017', { useNewUrlParser: true })
      const db = client.db('dtrip_steem')

      let [posts, authors] = await Promise.all([
        db.collection("post_model").find({'depth': 0})
            .project({author: true, permlink: true, last_update: true}).toArray(),

        //db.collection("account_object").find({'json_metadata.dtripProfile': {'$exists': true}})
        //    .project({name: true}).toArray()
      ])

      return [
          //...authors.map(a => `/@${a.name}`),
          ...posts.map(p => ({ url: `/@${p.author}/${p.permlink}`, lastmodISO: p.last_update.toISOString()})),
      ]
    }
  } : undefined,

  sentry: {
    dsn: process.env.SENTRY_DSN || 'https://e00d35317557416b9ef3e69b7df52b50@sentry.io/1306350'
  }
}
