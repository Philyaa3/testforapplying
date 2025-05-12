import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { accountsData } from '../data/accounts.js'

// Helper arrays for random generation
const trendsList = ['Positive', 'Negative', 'Medium']
const firstNames = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Hank']
const lastNames = ['Smith', 'Johnson', 'Brown', 'Taylor', 'Miller', 'Davis', 'Wilson', 'Moore']
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Generate random date within past 7 days
function randomPastDate() {
    const now = new Date()
    const past = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    return past
}

// Format date as "12 Nov 1:55pm"
function formatDate(date: Date): string {
    const day = date.getDate()
    const month = monthNames[date.getMonth()]
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12 || 12
    const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`
    return `${day} ${month} ${hours}:${minStr}${ampm}`
}

export const useFiltersStore = defineStore('filters', () => {
    // State
    const accounts = ref([...accountsData])
    const searchQuery = ref<string>('')
    const filters = ref<Array<{ type: string; value: string }>>([])
    const selectedAccountIds = ref<Array<number>>([])

    // Getters
    const filteredAccounts = computed(() => {
        let result = accounts.value

        // Apply search filter
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase()
            result = result.filter(account =>
                account.name.toLowerCase().includes(query) ||
                account.owner.toLowerCase().includes(query)
            )
        }

        // Apply type filters
        if (filters.value.length > 0) {
            filters.value.forEach(f => {
                if (f.type === 'tag') result = result.filter(a => a.tags === f.value)
                if (f.type === 'trend') result = result.filter(a => a.trend === f.value)
                if (f.type === 'score') result = result.filter(a => a.score === f.value)
                if (f.type === 'owner') result = result.filter(a => a.owner === f.value)
            })
        }
        return result
    })

    const localFilters = computed(() => filters.value)
    const selectedCount = computed(() => selectedAccountIds.value.length)

    // Actions
    function updateSearch(query: string) { searchQuery.value = query }
    function applyFilters(newFilters: Array<{ type: string; value: string }>) { filters.value = [...newFilters] }
    function removeFilter(filter: { type: string; value: string }) {
        filters.value = filters.value.filter(f => !(f.type === filter.type && f.value === filter.value))
    }
    function clearAllFilters() { filters.value = []; searchQuery.value = '' }
    function changeTagForSelected(newTag: string) {
        accounts.value = accounts.value.map(a =>
            selectedAccountIds.value.includes(a.id) ? { ...a, tags: newTag } : a
        )
        filters.value = filters.value.filter(f => f.type !== 'tag')
    }
    function deleteSelected() {
        accounts.value = accounts.value.filter(a => !selectedAccountIds.value.includes(a.id))
        selectedAccountIds.value = []
    }

    // Add new account with random analytics, trend, owner, date
    function addAccount(payload: { name: string; tag?: string; score: string; customers: number }) {
        const maxId = accounts.value.reduce((max, a) => Math.max(max, a.id), 0)
        const newId = maxId + 1
        const analytics = Array.from({ length: 7 }, () => Math.floor(Math.random() * 46) + 5)
        const trend = trendsList[Math.floor(Math.random() * trendsList.length)]
        const owner = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
        const added = formatDate(randomPastDate())

        accounts.value.push({
            id: newId,
            imageCompany: `https://picsum.photos/seed/company${newId}/200/300`,
            name: payload.name,
            added,
            trend,
            ownerImage: `https://picsum.photos/seed/owner${newId}/200/300`,
            owner,
            score: payload.score,
            tags: payload.tag || '',
            customers: payload.customers,
            analytics
        })
    }

    return {
        accounts,
        searchQuery,
        filters,
        selectedAccountIds,
        filteredAccounts,
        localFilters,
        selectedCount,
        updateSearch,
        applyFilters,
        removeFilter,
        clearAllFilters,
        changeTagForSelected,
        deleteSelected,
        addAccount
    }
})
