<template>
  <header :class="classNames">
    <slot />
  </header>
</template>

<script>
import { defineComponent } from 'vue';
import { getPrefixCls } from '../_utils/global-config';

export default defineComponent({
  name: 'LayoutHeader',
  setup() {
    const prefixCls = getPrefixCls('layout-header');
    const classNames = [prefixCls];

    return {
      classNames,
    };
  },
});
</script>
