export const state = () => ({
  isTopCarouselLoaded: false,
  isDarkMode: false,
});
export const getters = {
  isTopCarouselLoaded: (state) => state.isTopCarouselLoaded,
  isDarkMode: (state, getters, rootState, rootGetters) => state.isTopCarouselLoaded && state.isDarkMode,
};
export const actions = {};
export const mutations = {
  setTopCarouselLoaded(state, value) {
    state.isTopCarouselLoaded = value;
  },

  setDarkMode(state, value) {
    state.isDarkMode = value;
  },
};
