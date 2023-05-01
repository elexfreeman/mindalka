<template>
  <SplideSlide class="le-slider-item" :class="classes">
    <slot />
  </SplideSlide>
</template>

<script>
// Use splide for Vue. Details: https://splidejs.com/integration-vue-splide/
import SplideSlide from '@splidejs/vue-splide/src/js/components/SplideSlide.vue';

export default {
  name: 'LeSliderItem',

  components: {
    SplideSlide,
  },

  /**
   *
   * @param {boolean} isLazyLoad - Is show skeleton for lazy loading
   * @default false
   *
   * @props
   */
  props: {
    isLazyLoad: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    classes() {
      return {
        'le-slider-item--lazy': this.isLazyLoad,
      };
    },
  },
};
</script>

<style lang="scss">
.le-slider-item {
  .splide__spinner {
    display: none;
  }

  &--lazy.is-loading {
  }
}
</style>
