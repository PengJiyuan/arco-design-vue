<template>
  <div :class="prefixCls">
    <spin :loading="loading" :style="{ width: '100%' }">
      <div v-if="isEmpty" :class="`${prefixCls}-empty`">
        <slot name="empty">
          <empty />
        </slot>
      </div>
      <slot v-else-if="virtualList" />
      <div
        v-else
        ref="wrapperRef"
        :class="`${prefixCls}-list-wrapper`"
        @scroll="handleScroll"
      >
        <ul :class="`${prefixCls}-list`">
          <slot />
        </ul>
      </div>
    </spin>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { getPrefixCls } from '../../_utils/global-config';
import Empty from '../../empty';
import Spin from '../../spin';

export default defineComponent({
  name: 'DropDown',
  components: {
    Empty,
    Spin,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    isEmpty: {
      type: Boolean,
      default: false,
    },
    bottomOffset: {
      type: Number,
      default: 0,
    },
    onScroll: {
      type: Function as PropType<(e: Event) => void>,
    },
    onReachBottom: {
      type: Function as PropType<(e: Event) => void>,
    },
    virtualList: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['scroll', 'reachBottom'],
  setup(props, { emit }) {
    const prefixCls = getPrefixCls('dropdown');
    const wrapperRef = ref<HTMLElement>();

    const handleScroll = (e: Event) => {
      const { scrollTop, scrollHeight, offsetHeight } = e.target as HTMLElement;
      const bottom = scrollHeight - (scrollTop + offsetHeight);
      if (bottom <= props.bottomOffset) {
        emit('reachBottom', e);
      }
      emit('scroll', e);
    };

    return {
      prefixCls,
      wrapperRef,
      handleScroll,
    };
  },
});
</script>
