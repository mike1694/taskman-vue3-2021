/* oxlint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

import 'vue-router';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: ReturnType<
      (typeof import('vue-router'))['createRouter']
    >;
    $route: import('vue-router')['RouteLocationNormalizedLoaded'];
  }
}
