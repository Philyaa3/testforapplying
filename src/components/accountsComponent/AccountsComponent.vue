<script lang="ts">
import { defineComponent, ref, provide } from 'vue'
import AccountsHeader from './AccountsHeader.vue'
import AccountsTable from './AccountsTable.vue'
import FilterBar from './FilterBar.vue'

export default defineComponent({
  name: 'AccountsComponent',
  components: {
    AccountsHeader,
    AccountsTable,
    FilterBar
  },
  setup() {
    const activeFilters = ref<{ type: string; value: string }[]>([])
    const searchQuery = ref('')
    const selectedAccountIds = ref<number[]>([])

    provide('activeFilters', activeFilters)
    provide('searchQuery', searchQuery)
    provide('selectedAccountIds', selectedAccountIds)

    return {
      activeFilters,
      searchQuery,
      selectedAccountIds
    }
  }
})
</script>

<template>
  <AccountsHeader />
  <div class="p-6">
    <FilterBar />
    <AccountsTable />
  </div>
</template>

<style scoped>

</style>