<script lang="ts">
import { defineComponent } from 'vue'
import { useFiltersStore } from '../../stores/useFiltersStore'
import FilterModal from '../modals/FilterModal.vue'
import ClearFilterBtn from '../utils/ClearFilterBtn.vue'
import SearchBar from '../utils/SearchBar.vue'
import AddTagBtn from '../utils/AddTagBtn.vue'
import DeleteUserBtn from '../utils/DeleteUserBtn.vue'

export default defineComponent({
  name: 'FilterBar',
  components: {
    FilterModal,
    ClearFilterBtn,
    SearchBar,
    AddTagBtn,
    DeleteUserBtn
  },
  data() {
    const filtersStore = useFiltersStore()
    return {
      filtersStore,
      isFilterModalOpen: false
    }
  },
  computed: {
    localFilters() {
      return this.filtersStore.localFilters
    },
    searchQuery() {
      return this.filtersStore.searchQuery
    },
    selectedCount() {
      return this.filtersStore.selectedCount
    }
  },
  methods: {
    openFilterModal() {
      this.isFilterModalOpen = true
    },
    closeFilterModal() {
      this.isFilterModalOpen = false
    },
    removeFilter(filter: any) {
      this.filtersStore.removeFilter(filter)
    },
    clearAllFilters() {
      this.filtersStore.clearAllFilters()
    },
    updateSearch(query: string) {
      this.filtersStore.updateSearch(query)
    },
    handleApplyFilters(newFilters: any) {
      this.filtersStore.applyFilters(newFilters)
    },
    onAddTag(newTag: string) {
      this.filtersStore.changeTagForSelected(newTag)
    },
    onDeleteSelected() {
      this.filtersStore.deleteSelected()
    }
  }
})
</script>


<template>
  <div class="flex flex-col gap-4 md:flex-row md:justify-between">
    <div class="flex flex-col flex-wrap gap-2 md:gap-4 items-start">
      <div class="flex gap-2 mb-4 items-center flex-wrap">
        <button @click="openFilterModal"
                class="flex items-center w-max md:gap-[10px] border px-3 py-2 md:px-5 md:py-2 rounded-[10px] text-[10px] md:text-sm text-[#2490ED] border-[#AAAAAA]">
          <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg"
               class="w-0 md:w-full">
            <rect x="2" width="2" height="18" rx="1" fill="#2490ED"/>
            <rect x="17" width="2" height="18" rx="1" fill="#2490ED"/>
            <rect x="10" width="2" height="18" rx="1" fill="#2490ED"/>
            <rect x="15" y="5" width="6" height="3" rx="1.5" fill="#2490ED"/>
            <rect x="8" y="11" width="6" height="3" rx="1.5" fill="#2490ED"/>
            <rect y="5" width="6" height="3" rx="1.5" fill="#2490ED"/>
          </svg>
          Filters({{ localFilters?.length ?? 0 }})
        </button>

        <template v-for="filter in localFilters" :key="`${filter.type}-${filter.value}`">
          <div class="flex gap-2 items-center bg-[#e9f1fe] text-[#2490ED] text-xs md:text-sm px-3 py-1 rounded-[10px]">
            {{ filter.value }}
            <button @click="removeFilter(filter)">
              <svg width="10" height="10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="0.833" width="1.178" height="12.964" rx="0.589" transform="rotate(-45 0 0.833)"
                      fill="#2490ED"/>
                <rect x="9.167" width="1.178" height="12.964" rx="0.589" transform="rotate(45 9.167 0)" fill="#2490ED"/>
              </svg>
            </button>
          </div>
        </template>

        <ClearFilterBtn @click="clearAllFilters"/>
      </div>

      <div class="flex md:flex-row items-center gap-[15px] flex-wrap">
        <SearchBar :modelValue="searchQuery" @update:modelValue="updateSearch"/>
        <div class="text-[14px] font-semibold text-[#2490ED] self-center">
          <p>{{ selectedCount }} selected</p>
        </div>
        <AddTagBtn @add-tag="onAddTag" />
        <DeleteUserBtn @delete-selected="onDeleteSelected" />
      </div>
    </div>

    <FilterModal
        v-if="isFilterModalOpen"
        @close="closeFilterModal"
        @apply-filters="handleApplyFilters"
    />
  </div>
</template>