<script setup lang="ts">
import {defineProps, defineEmits, onMounted, onUnmounted} from 'vue'

const props = defineProps({
  show: {type: Boolean, required: true},
  width: {type: String, default: '400px'}
})

const emit = defineEmits(['close'])

const onEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', onEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onEscape)
})

const handleBackgroundClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) emit('close')
}
</script>

<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
         @click="handleBackgroundClick"
         style="background-color: rgba(211, 211, 211, 0.45);">
      <transition name="slide">
        <div :style="{ width }" class="bg-white rounded-lg p-6 shadow-lg">
          <slot/>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from, .slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>