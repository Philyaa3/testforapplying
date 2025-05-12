<script lang="ts">
import {defineComponent, ref, computed} from 'vue'
import {useFiltersStore} from '/src/stores/useFiltersStore'
import CreateAccountBtn from '../utils/CreateAccountBtn.vue'
import CreateAccountModal from '../modals/CreateAccountModal.vue'

export default defineComponent({
  name: 'AccountsHeader',
  components: {
    CreateAccountBtn,
    CreateAccountModal
  },
  data() {
    const store = useFiltersStore()
    return {
      store,
      showModal: false
    }
  },
  computed: {
    accountsCount(): number {
      return this.store.accounts.length
    },
    userCount(): number {
      return this.store.accounts.reduce((sum, acc) => sum + acc.customers, 0)
    }
  },
  methods: {
    openCreateForm() {
      this.showModal = true
    },
    handleCreateAccount(formData: { name: string; tag?: string; score: string; customers: number }) {
      this.store.addAccount(formData)
      this.showModal = false
    }
  }
})
</script>

<template>
  <header class="p-6 border-b">
    <div class="flex flex-row justify-between items-center md:items-center gap-4">
      <div class="flex flex-col">
        <h1 class="text-[28px] md:text-[36px] font-light">Accounts</h1>
        <div class="text-[#777777] font-thin text-[8px] md:text-[12px]">
          {{ accountsCount }} accounts | {{ userCount }} users
        </div>
      </div>

      <CreateAccountBtn @click="openCreateForm"/>

      <CreateAccountModal
          :show="showModal"
          @close="showModal = false"
          @submit="handleCreateAccount"
      />
    </div>
  </header>
</template>


<style scoped>
.bg-mainBlue {
  background-color: #2490ED;
}
</style>
