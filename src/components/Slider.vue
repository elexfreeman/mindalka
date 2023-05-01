<template>
  <Splide
    ref="splide"
    class="le-slider"
    :options="currentOptions"
    :extensions="extensions"
    @splide:mounted="onSplideMounted"
    @splide:active="onSplideActive"
    @splide:move="onSplideMove"
    @splide:moved="onSplideMoved"
  >
    <LeSliderItem
      v-for="(item, index) in items"
      :key="itemKey(item)"
      class="le-slider__item"
      :class="itemClasses"
      :isLazyLoad="hasSliderItemLazyLoad(item)"
      v-bind="getAttrs(item)"
    >
      <slot :item="item" :index="index" />
    </LeSliderItem>

    <template #controls>
      <slot name="controls" />
    </template>
  </Splide>
</template>

<script>
import { mapGetters } from 'vuex';

import LeSliderItem from '@/components/Slider/SliderItem.vue';

// splide le-slider le-slider--web-top-carousel le-slider--dark is-playing
// splide le-slider le-slider--web-top-carousel splide--loop splide--ltr splide--draggable is-active splide--has-video is-playing
// eslint-disable-next-line import/order
// Use splide for Vue. Details: https://splidejs.com/integration-vue-splide/
//import Splide from '@splidejs/vue-splide/src/js/components/Splide.vue';
import { Splide, SplideSlide } from '@/vue-splide';

const MAX_MOBILE_VIDEO_WIDTH = 500; // DC-4751: We show a small video for mobile (screenSize.width <= 500px)

export default {
  name: 'LeSlider',

  components: {
    Splide,
    LeSliderItem,
  },

  /**
   *
   * @param {Array} items - Slider items
   * @param {Object} options - Custom slider options
   * @param {string} indexBy - Property for forming a key (if empty, will be used $index)
   * @param {string|Object|Array} itemClasses - additional css classes for LeSliderItem
   *
   * @props
   */
  props: {
    items: {
      type: Array,
      default: () => [],
    },

    options: {
      type: Object,
      default: () => ({}),
    },

    indexBy: {
      type: String,
      default: '',
    },

    itemClasses: {
      type: [String, Object, Array],
      default: '',
    },
  },

  data() {
    return {
      extensions: {},

      // More options: https://splidejs.com/guides/options/
      defaultOptions: {
        video: {
          disableOverlayUI: true,
          autoplay: true,
          hideControls: true,
          mute: true,
          playerOptions: {
            htmlVideo: {
              autoplay: true,
              mute: true,
              playsinline: true,
              disablePictureInPicture: true,
            },
          },
        },
        type: 'loop',
        perPage: 1,
        perMove: 1,
        rewind: true,
        drag: true,
        autoplay: true,
        interval: 4000,
        pauseOnHover: true,
        lazyLoad: 'nerby',
        preloadedPages: 1,
        arrows: true,
      },
    };
  },

  computed: {
    ...mapGetters('app', ['screenSize']),

    currentOptions() {
      return {
        ...this.defaultOptions,
        ...this.options,
      };
    },

    isLazyLoad() {
      return false;
    },

    hasMobileVideoWidth() {
      return this.screenSize.width <= MAX_MOBILE_VIDEO_WIDTH;
    },
  },

  methods: {
    itemKey(item) {
      return item._id || item.id || item.productId || item[this.indexBy];
    },
    splideRemount() {
      this.$refs?.splide?.remount();
    },
    splideItem() {
      return this.$refs.splide?.splide;
    },
    splideSync(splide) {
      this.$refs.splide?.sync(splide);
    },
    // Available aliases: https://splidejs.com/components/controller/#go
    splideMoveToItem(alias) {
      this.$refs.splide?.go(alias);
    },

    getAttrs(item) {
      const videoUrl = (this.hasMobileVideoWidth && item.videoMobileUrl) || item.videoUrl;
      const videoSource = (this.hasMobileVideoWidth && item.videoMobileSource) || item.videoSource;

      if (videoUrl && videoSource === 'direct') {
        return {
          'data-splide-html-video': videoUrl,
        };
      }

      return {};
    },

    hasSliderItemLazyLoad(item) {
      const videoUrl = (this.hasMobileVideoWidth && item.videoMobileUrl) || item.videoUrl;
      return this.isLazyLoad && !videoUrl;
    },

    onSplideMounted(splideJs) {
      this.$emit('mounted', splideJs);
      if (this.currentOptions.autoplay) {
        splideJs.on('video:play', () => {
          splideJs.Components.Autoplay.pause();
        });
        splideJs.on('video:ended', () => {
          splideJs.go('>');
          splideJs.Components.Autoplay.play();
        });
      }
    },
    onSplideActive(splideJs, { slide }) {
      // fix for iphone
      for (const video of slide.querySelectorAll('video')) {
        video.setAttribute('playsinline', 'playsinline');
      }
    },

    onSplideMove(splideJs, ...args) {
      this.$emit('move', args);
    },

    onSplideMoved(splideJs, ...args) {
      this.$emit('moved', args);
    },
  },
};
</script>

<style lang="scss">
// Default theme, more info: https://splidejs.com/themes/
@import '@splidejs/splide/dist/css/themes/splide-default.min.css';
@import '@splidejs/splide-extension-video/dist/css/splide-extension-video.min.css';

// Need to override the default styles for splide
.le-slider {
  width: 100%;

  .splide {
    &__pagination {
      position: initial;
      width: 100%;
      left: auto;
      top: auto;
      margin-top: 16px;
      margin-bottom: -2px;
      transform: none;
      text-align: center;
      display: block;
    }

    &__pagination__page {
      width: 8px;
      height: 8px;
      margin: 0 4px;
      background: $--color-alto;
      border-radius: 30px;
      transition: opacity 0.2s ease;
      display: block;

      &.is-active {
        background: $--color-black;
        transform: none;
      }
    }

    &__arrows {
      visibility: hidden;
    }

    &__arrow {
      width: 30px;
      height: 60px;
      font-size: $--font-size-11;
      border-radius: 0;
      background: $--color-mercury;
      opacity: 1;

      &--prev {
        left: 3px;
      }

      &--next {
        right: 3px;
      }

      &[disabled] {
        display: none;
      }
    }

    &__video {
      video {
        object-fit: cover;
        pointer-events: none;
        user-select: none;
      }
    }
  }

  &:hover {
    .splide {
      &__arrows {
        visibility: visible;
      }
    }
  }
}
</style>
