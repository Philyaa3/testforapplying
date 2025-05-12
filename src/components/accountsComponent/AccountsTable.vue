<script lang="ts">
import { defineComponent } from 'vue'
import ChartLine from '../utils/ChartLine.vue'
import { useFiltersStore } from '../../stores/useFiltersStore'

export default defineComponent({
  name: 'AccountsTable',
  components: { ChartLine },
  data() {
    const filtersStore = useFiltersStore()
    return { filtersStore }
  },
  computed: {
    filteredAccounts() {
      return this.filtersStore.filteredAccounts
    },
    // computed with getter and setter to allow v-model
    selectedAccountIds: {
      get(): number[] {
        return this.filtersStore.selectedAccountIds
      },
      set(val: number[]) {
        this.filtersStore.selectedAccountIds = val
      }
    }
  }
})
</script>

<template>
  <div class="mt-[30px] overflow-x-auto custom-scrollbar pb-3">
    <div class="min-w-max">
      <!-- Header -->
      <div
          class="grid gap-2 text-sm text-[#666666] border-b border-t py-2 border-[#AAAAAA] bg-[#efefef] sticky top-0 z-10"
          style="grid-template-columns: repeat(9, 150px)">
        <div class="flex items-center justify-center min-w-[50px]"></div>
        <div class="flex gap-[5px] items-center max-w-[200px]">Name</div>
        <div class="min-w-[120px]">Last added</div>
        <div class="min-w-[160px]">Analytics graph</div>
        <div class="min-w-[120px]">Trends</div>
        <div class="min-w-[160px]">Owner</div>
        <div class="min-w-[80px]">Score</div>
        <div class="min-w-[140px]">Tag</div>
        <div class="min-w-[120px]">Customers</div>
      </div>

      <!-- Data -->
      <div v-for="item in filteredAccounts" :key="item.id"
           class="grid gap-2 text-[#666] py-2 border-b border-[#efefef] items-center"
           style="grid-template-columns: repeat(9, 150px)">
        <div class="flex items-center justify-center min-w-[50px]">
          <input type="checkbox" :value="item.id" v-model.number="selectedAccountIds"/>
        </div>
        <div class="flex items-center gap-[5px] min-w-[200px]">
          <img :src="item.imageCompany" alt="" class="w-[20px] h-[20px] rounded-[5px]"/> {{ item.name }}
        </div>
        <div class="min-w-[120px]">{{ item.added }}</div>
        <div class="min-w-[160px]">
          <ChartLine :data="item.analytics"/>
        </div>
        <div>
          <span :class="{
            'text-[#257500] bg-[#E9FFE3] p-2 rounded min-w-[120px]': item.trend === 'Positive',
            'text-[#CC1215] bg-[#FFEBEB] p-2 rounded min-w-[120px]': item.trend === 'Negative',
            'text-yellow-600 bg-yellow-100 p-2 rounded min-w-[120px]': item.trend === 'Medium'
          }">
            {{ item.trend }}
          </span>
        </div>
        <div class="flex items-center gap-[5px] min-w-[160px]">
          <img :src="item.ownerImage" alt="" class="w-[20px] h-[20px] rounded-full"/> {{ item.owner }}
        </div>
        <div class="min-w-[80px]">{{ item.score }}</div>
        <div class="min-w-[140px]">
          <p class="text-sm bg-[#2490ED] p-2 rounded-[10px] text-white w-fit">{{ item.tags }}</p>
        </div>
        <div class="min-w-[120px]">{{ item.customers?.toLocaleString() ?? '—' }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #AAAAAA;
  border-radius: 10px;
}
</style>
