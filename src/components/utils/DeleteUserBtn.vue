<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DeleteUserBtn',
  emits: ['delete-selected'],
  methods: {
    onClick() {
      if (confirm('Are you sure you want to delete selected accounts?')) {
        this.$emit('delete-selected')
      }
    }
  }
})
</script>

<template>
  <button @click="onClick" class="flex gap-[5px] text-[14px] text-[#777777] font-semibold">
    <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11.1274" cy="10.5" r="9.75" stroke="#777777" stroke-width="1.5"/>
      <rect x="6.88477" y="6.96446" width="1" height="11" rx="0.5" transform="rotate(-45 6.88477 6.96446)"
            fill="#777777"/>
      <rect x="6.88477" y="14.0355" width="11" height="1" rx="0.5" transform="rotate(-45 6.88477 14.0355)"
            fill="#777777"/>
    </svg>
    Delete
  </button>
</template>

<style scoped>

</style>