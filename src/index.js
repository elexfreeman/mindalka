import Vue from 'vue';

import MainSlider from '@/components/MainSlider.vue';

async function main() {
  if (document.getElementById('#mainSlider')) {
    new Vue({
      render: (h) => h(MainSlider),
    }).$mount('#mainSlider');
  }
}

main();
