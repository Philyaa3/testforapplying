<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CreateAccountModal',
  inject: ['activeFilters'],
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: '',
        tag: '',
        score: '',
        customers: 0
      } as { name: string; tag: string; score: string; customers: number },
      errors: {
        name: '',
        tag: '',
        score: '',
        customers: ''
      } as { name: string; tag: string; score: string; customers: string }
    }
  },
  emits: ['close', 'submit'],
  methods: {
    isSafeText(input: string): boolean {
      return /^[\w\s\-@().,#&]+$/.test(input)
    },
    isScoreFormat(input: string): boolean {
      return /^([0-9]|10)\/10$/.test(input)
    },
    isSafeInteger(val: number): boolean {
      return Number.isInteger(val) && val >= 0
    },
    validateForm(): boolean {
      this.errors = { name: '', tag: '', score: '', customers: '' }

      if (!this.form.name || !this.isSafeText(this.form.name)) {
        this.errors.name = 'Invalid name: only letters, numbers, and limited punctuation allowed.'
      }
      if (this.form.tag && !this.isSafeText(this.form.tag)) {
        this.errors.tag = 'Invalid tag format.'
      }
      if (!this.form.score || !this.isScoreFormat(this.form.score)) {
        this.errors.score = 'Score must be in the format 0–10/10.'
      }
      if (!this.isSafeInteger(this.form.customers)) {
        this.errors.customers = 'Customers must be a non-negative integer.'
      }

      return Object.values(this.errors).every(e => !e)
    },
    submitForm() {
      if (!this.validateForm()) return
      this.$emit('submit', { ...this.form })
      this.close()
    },
    close() {
      this.$emit('close')
    },
    closeIfOverlayClicked(e: MouseEvent) {
      if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
        this.close()
      }
    },
    closeOnEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        this.close()
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.closeOnEsc)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.closeOnEsc)
  }
})
</script>

<template>
  <div
      v-if="show"
      class="fixed inset-0 z-50 modal-overlay flex justify-center items-center"
      style="background-color: rgba(211, 211, 211, 0.45);"
      @click="closeIfOverlayClicked"
  >
    <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-md relative z-10">
      <h2 class="text-lg font-semibold mb-4">Create New Account</h2>

      <form @submit.prevent="submitForm" class="flex flex-col gap-3 text-sm">
        <div>
          <input
              v-model="form.name"
              type="text"
              placeholder="Name"
              class="w-full border p-2 rounded-md"
              required
          />
          <p v-if="errors.name" class="text-red-600 text-xs mt-1">{{ errors.name }}</p>
        </div>

        <div>
          <input
              v-model="form.tag"
              type="text"
              placeholder="Tag"
              class="w-full border p-2 rounded-md"
          />
          <p v-if="errors.tag" class="text-red-600 text-xs mt-1">{{ errors.tag }}</p>
        </div>

        <div>
          <input
              v-model="form.score"
              type="text"
              placeholder="Score (e.g., 8/10)"
              class="w-full border p-2 rounded-md"
              required
          />
          <p v-if="errors.score" class="text-red-600 text-xs mt-1">{{ errors.score }}</p>
        </div>

        <div>
          <input
              v-model.number="form.customers"
              type="number"
              placeholder="Customers"
              class="w-full border p-2 rounded-md"
              required
          />
          <p v-if="errors.customers" class="text-red-600 text-xs mt-1">{{ errors.customers }}</p>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button" @click="close" class="text-gray-600 hover:text-black">
            Cancel
          </button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: background-color 0.2s;
}
</style>
