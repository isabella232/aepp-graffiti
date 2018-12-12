// TODO: store is currently unused, but added for future convenience
import Vuex from 'vuex'
import Vue from 'vue'
import VuexPersist from 'vuex-persist'
import svgImage from './assets/molumen_audio_cassette.svg'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'ae-drone',
  storage: window.localStorage
})

const store = new Vuex.Store({
  state: {
    images: [],
    uploadedImage: {},
    transformedImage: null,
    transformationSettings: {
      size: 50
    },
    imageSettings: {
      max: { width: 10, height: 10 },
      min: { width: 4, height: 3 }
    },
    meterToPixel: 10 // Meter * meterToPixel = Pixel
  },
  plugins: [vuexPersist.plugin],
  getters: {},
  mutations: {
    addImage (state, image) {
      state.images.push(image)
    },
    addUploadedImage (state, image) {
      state.uploadedImage = image
    },
    saveTransformedImage (state, image) {
      state.transformedImage = image
    },
    saveUpdatedSettings (state, settings) {
      state.transformationSettings = settings
    },
    clearCachedImages (state) {
      state.images = []
    }
  },
  actions: {
    async loadImages ({ state, commit }) {
      commit(`clearCachedImages`)
      for (let i = 0; i < 100; i++) {
        commit(`addImage`, {
          src: svgImage,
          position: { x: Math.random() * 1000, y: Math.random() * 1000 },
          size: {
            width: 200,
            height: 300
          }
        })
      }
    },
    uploadImage (context, file) {
      const fReader = new FileReader()
      fReader.onload = () => {
        context.commit(`addUploadedImage`, {
          src: fReader.result,
          position: {
            x: Math.random() * 1000,
            y: Math.random() * 1000
          }
        })
      }
      fReader.readAsDataURL(file)
    },
    transformImage ({ commit, state }) {
      // TODO DO SOME STUFF, CALL SDK ETC

      let image = Object.assign({}, state.uploadedImage);

      if (state.transformedImage) {
        Object.assign(image, state.transformedImage)
        image.src = state.uploadedImage.src
      }

      image.size = {
        width: 200 * state.transformationSettings.size / 100,
        height: 200 * state.transformationSettings.size / 100
      }
      commit(`saveTransformedImage`, image)
    },
    updateTransformedImage ({ commit, state }, update) {
      commit(`saveTransformedImage`, Object.assign(state.transformedImage, update))
    },
    updateSettings ({ commit, state }, update) {
      commit(`saveUpdatedSettings`, Object.assign(state.transformationSettings, update))
    }
  }
})

export default store
