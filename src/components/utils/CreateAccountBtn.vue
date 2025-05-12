<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CreateAccountBtn',
  props: {
    label: {
      type: String,
      default: 'Create account'
    },
    showIcon: {
      type: Boolean,
      default: true
    }
  },
  emits: ['click'],
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
})
</script>
<template>
  <button
      @click="handleClick"
      class="flex items-center gap-2 bg-mainBlue text-white px-4 py-2 md:px-6 md:py-3 rounded-[10px] hover:bg-blue-600 text-[10px] md:text-[16px] font-light"
  >    <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="10.5" r="10.5" fill="white"/>
      <rect x="10" y="5" width="1" height="11" rx="0.5" fill="#2490ED"/>
      <rect x="5" y="10" width="11" height="1" rx="0.5" fill="#2490ED"/>
    </svg>
    <slot>{{ label }}</slot>  </button>
</template>

<style scoped>

</style>