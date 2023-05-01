<template>
  <div v-if="itemsLength" v-fragment class="web-top-carousel">
    <div
      class="web-top-carousel__container"
      :class="containerClasses"
      data-at-web-top-carousel
      :data-dark-mode="isDarkMode"
    >
      <Splide
        ref="splide"
        class="le-slider web-top-carousel__slider"
        :options="currentOptions"
        :extensions="extensions"
        @splide:mounted="onSplideMounted"
        @splide:active="onSplideActive"
        @splide:move="onSplideMove"
        @splide:dragged="onDragged"
      >
        <SplideSlide v-for="(item, key) of items" :key="key">
          <img class="web-top-carousel__img" :src="item" />
        </SplideSlide>
      </Splide>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { getMainSlider } from '@/api/api';
import { MEDIA_URL } from '@/config';

import { Splide, SplideSlide } from '@/vue-splide';

import '@/components/Slider.vue';

export default {
  components: {
    Splide,
    SplideSlide,
  },

  data() {
    return {
      schema: {},
      isVisible: true,
      observer: null,
      viewedEventsCount: 0,
      activeSlideIndex: 0,
      extensions: {},
      itemsData: [],
      // More options: https://splidejs.com/guides/options/
      defaultOptions: {
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
    ...mapGetters('topCarousel', ['isDarkMode']),

    exclusive() {
      return false;
    },

    maxViewedEventsCount() {
      return 50;
    },

    items() {
      return this.itemsData;
    },

    itemsLength() {
      return this.items.length;
    },

    totalItems() {
      return this.items.length;
    },

    containerClasses() {
      return {
        'web-top-carousel__container--dark': this.isDarkMode,
      };
    },

    currentOptions() {
      return {
        ...this.defaultOptions,
        ...this.options,
      };
    },
  },

  async mounted() {
    this.setTopCarouselLoaded(true);
    this.setDarkMode(this.items[0]?.isDarkMode);
    this.initIntersectionObserver();
    const data = await getMainSlider();
    console.log(data?.attributes?.item);
    this.itemsData = data?.attributes?.item?.map((item) => {
      return `${MEDIA_URL}${item.image.data.attributes.url}`;
    });
    console.log('>>>>', this.itemsData);

    this.setTopCarouselLoaded(false);
  },

  beforeDestroy() {
    this.setTopCarouselLoaded(false);
    this.observerDestroy();
  },

  methods: {
    ...mapMutations('topCarousel', ['setTopCarouselLoaded', 'setDarkMode']),

    intersectionCallback(entries = []) {
      entries.forEach(({ intersectionRatio }) => {
        this.isVisible = intersectionRatio > 0.8;
      });
    },

    initIntersectionObserver() {
      return;
      const root = null;
      const carousel = this.$refs.splide.$el;
      const options = {
        root,
        rootMargin: '0px',
        threshold: [0, 0.8, 1],
      };

      this.observer = new IntersectionObserver(this.intersectionCallback, options);

      this.observer.observe(carousel);
    },

    observerDestroy() {
      if ('IntersectionObserver' in window && this.observer) {
        this.observer.disconnect();
      }
    },

    onDragged() {},

    onSplideMounted(splideJs) {
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
      const [activeSlideIndex] = args;
      this.setDarkMode(this.items[activeSlideIndex].isDarkMode);
      this.activeSlideIndex = activeSlideIndex;
    },
  },
};
</script>

<style lang="scss">
.web-top-carousel {
  &__img {
    width: 100%;
  }
  &__slider {
    &.le-slider .splide {
      &__pagination {
        position: absolute;
        bottom: 16px;

        &__slide {
          width: 15px;
          height: 15px;
          border-radius: 50%;
        }

        &__page {
          display: flex;
          width: 15px;
          height: 15px;
          background: transparent;

          &::before {
            content: '';
            width: 5px;
            height: 5px;
            background: rgba($--color-black, 0.2);
            margin: auto;
            border-radius: 50%;
          }

          &.is-active {
            background: transparent;

            &::before {
              background: $--color-black;
            }
          }
        }
      }

      &__arrows {
        display: none;
      }

      &__image {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        object-fit: cover;
        cursor: grab;

        &:active {
          cursor: grabbing;
        }
      }
    }
  }
}
</style>
