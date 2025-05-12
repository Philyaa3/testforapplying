<script lang="ts">
import { useFiltersStore } from '/src/stores/useFiltersStore.ts'

export default {
  name: 'SearchBar',
  data() {
    return {
      query: '',
    }
  },
  created() {
    this.accountStore = useFiltersStore()
  },
  watch: {
    query(newVal) {
      this.accountStore.updateSearch(newVal)
    }
  }
}
</script>

<template>
  <div class="flex self-center items-center">
    <label for="searchBar">
      <input
          v-model="query"
          type="text"
          placeholder="Search..."
          class="border p-2 rounded-[10px] border-gray-400 w-[250px] h-[30px] text-[12px]"
      />
    </label>
  </div>
</template>