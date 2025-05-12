<template>
  <div
      class="fixed inset-0 z-50 flex items-center justify-center"
      @click.self="close"
      style="background-color: rgba(211, 211, 211, 0.45);"
  >
    <div class="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg relative z-10">
      <h2 class="text-xl font-semibold mb-4">Advanced Filters</h2>

      <!-- Tags -->
      <div class="mb-4">
        <h3 class="font-semibold mb-2">Tags</h3>
        <div class="flex flex-wrap gap-2">
          <button
              v-for="tag in availableTags"
              :key="tag.value"
              @click="toggleSelection('tags', tag.value)"
              :class="[
              selectedTags.includes(tag.value)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200',
              'px-3 py-1 rounded-full text-sm'
            ]"
          >
            {{ tag.value }}
          </button>
        </div>
      </div>

      <!-- Trends -->
      <div class="mb-4">
        <h3 class="font-semibold mb-2">Trends</h3>
        <div class="flex flex-wrap gap-2">
          <button
              v-for="trend in availableTrends"
              :key="trend.value"
              @click="toggleSelection('trends', trend.value)"
              :class="[
              selectedTrends.includes(trend.value)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200',
              'px-3 py-1 rounded-full text-sm'
            ]"
          >
            {{ trend.value }}
          </button>
        </div>
      </div>

      <!-- Scores -->
      <div class="mb-4">
        <h3 class="font-semibold mb-2">Scores</h3>
        <div class="flex flex-wrap gap-2">
          <button
              v-for="score in availableScores"
              :key="score.value"
              @click="toggleSelection('scores', score.value)"
              :class="[
              selectedScores.includes(score.value)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200',
              'px-3 py-1 rounded-full text-sm'
            ]"
          >
            {{ score.value }}
          </button>
        </div>
      </div>

      <!-- Owners -->
      <div class="mb-4">
        <h3 class="font-semibold mb-2">Owners</h3>
        <div class="flex flex-wrap gap-2">
          <button
              v-for="owner in availableOwners"
              :key="owner.value"
              @click="toggleSelection('owners', owner.value)"
              :class="[
              selectedOwners.includes(owner.value)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200',
              'px-3 py-1 rounded-full text-sm'
            ]"
          >
            {{ owner.value }}
          </button>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end gap-3 mt-6">
        <button
            class="text-gray-600 hover:text-black"
            @click="close"
        >
          Cancel
        </button>
        <button
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            @click="applyFilters"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'

interface FilterItem {
  value: string
}

export default defineComponent({
  name: 'FilterModal',
  emits: ['close', 'apply-filters'],
  setup(props, { emit }) {
    const selectedTags = ref<string[]>([])
    const selectedTrends = ref<string[]>([])
    const selectedScores = ref<string[]>([])
    const selectedOwners = ref<string[]>([])

    const availableTags: FilterItem[] = [
      { value: 'Technology' },
      { value: 'AI' },
      { value: 'Solution' },
      { value: 'Performance' }
    ]

    const availableTrends: FilterItem[] = [
      { value: 'Positive' },
      { value: 'Negative' },
      { value: 'Medium' }
    ]

    const availableScores: FilterItem[] = [
      { value: '10/10' },
      { value: '9/10' },
      { value: '8/10' },
      { value: '7/10' }
    ]

    const availableOwners: FilterItem[] = [
      { value: 'Tailer Derden' },
      { value: 'Auto Owner' }
    ]

    function toggleSelection(
        type: 'tags' | 'trends' | 'scores' | 'owners',
        value: string
    ) {
      let listRef: typeof selectedTags
      switch (type) {
        case 'tags':
          listRef = selectedTags
          break
        case 'trends':
          listRef = selectedTrends
          break
        case 'scores':
          listRef = selectedScores
          break
        case 'owners':
          listRef = selectedOwners
          break
        default:
          console.warn(`Unknown filter type: ${type}`)
          return
      }
      const idx = listRef.value.indexOf(value)
      if (idx >= 0) listRef.value.splice(idx, 1)
      else listRef.value.push(value)
    }

    function applyFilters() {
      const filters: { type: string; value: string }[] = []
      selectedTags.value.forEach(tag => filters.push({ type: 'tag', value: tag }))
      selectedTrends.value.forEach(trend => filters.push({ type: 'trend', value: trend }))
      selectedScores.value.forEach(score => filters.push({ type: 'score', value: score }))
      selectedOwners.value.forEach(owner => filters.push({ type: 'owner', value: owner }))

      emit('apply-filters', filters)
      emit('close')
    }

    function close() {
      emit('close')
    }

    function closeOnEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }

    onMounted(() => window.addEventListener('keydown', closeOnEsc))
    onBeforeUnmount(() => window.removeEventListener('keydown', closeOnEsc))

    return {
      selectedTags,
      selectedTrends,
      selectedScores,
      selectedOwners,
      availableTags,
      availableTrends,
      availableScores,
      availableOwners,
      toggleSelection,
      applyFilters,
      close
    }
  }
})
</script>

<style scoped>
button {
  transition: background-color 0.2s;
}
</style>
