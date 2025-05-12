<script lang="ts">
import BaseModal from '../modals/BaseModal.vue'
import { useFiltersStore } from '/src/stores/useFiltersStore.ts'

export default {
  name: 'AddTagBtn',
  components: {
    BaseModal
  },
  data() {
    return {
      isModalOpen: false,
      newTag: '',
      filterStore: null as any
    }
  },
  created() {
    this.filterStore = useFiltersStore()
  },
  methods: {
    openModal() {
      this.newTag = ''
      this.isModalOpen = true
    },
    closeModal() {
      this.isModalOpen = false
    },
    submitTag() {
      const trimmed = this.newTag.trim()
      if (trimmed) {
        this.filterStore.changeTagForSelected(trimmed)
        this.closeModal()
      }
    }
  }
}
</script>

<template>
  <div>
    <button @click="openModal" class="flex gap-[5px] text-[14px] text-[#777777] font-semibold">
      <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.5766 3.56554L1.70711 13.435C1.31658 13.8256 1.31658 14.4587 1.70711 14.8492L8.77817 21.9203C9.1687 22.3108 9.80186 22.3108 10.1924 21.9203L20.0619 12.0508C20.2832 11.8295 20.3882 11.5172 20.3454 11.2071L19.4883 4.99311C19.4271 4.54929 19.0781 4.20034 18.6343 4.13913L12.4203 3.28203C12.1102 3.23925 11.798 3.34418 11.5766 3.56554Z" stroke="#777777" stroke-width="1.5"/>
        <circle cx="14.435" cy="9.19238" r="2.5" transform="rotate(-45 14.435 9.19238)" stroke="#777777"/>
      </svg>
      Tag
    </button>

    <BaseModal :show="isModalOpen" @close="closeModal" width="300px">
      <h2 class="text-lg font-semibold mb-4 text-center">Add New Tag</h2>
      <input
          v-model="newTag"
          type="text"
          placeholder="Enter tag name"
          class="w-full p-2 border border-gray-300 rounded mb-4"
          @keyup.enter="submitTag"
      />
      <div class="flex justify-end gap-2">
        <button @click="closeModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
        <button @click="submitTag" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add</button>
      </div>
    </BaseModal>
  </div>
</template>