import Vue from 'vue';
import store from '@/store';
import { getMainSlider } from './api/api';

import WebTopCarousel from '@/components/WebTopCarousel/WebTopCarousel.vue';

async function main() {
  if (document.getElementById('mainSlider')) {
    console.log('>><><')
    const app = new Vue({
      store,
      render: (h) => h(WebTopCarousel),
    });

    app.$mount('#mainSlider');
  }

  console.log(await getMainSlider());
}

main();
