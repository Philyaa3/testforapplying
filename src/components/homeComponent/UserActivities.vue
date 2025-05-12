<template>
  <div class="flex flex-col lg:flex-row h-full">
    <!-- Sidebar: User Info -->
    <aside class="w-full lg:w-1/4 border-r p-6">
      <div class="flex flex-col items-center mb-6">
        <div class="w-24 h-24 rounded-full mb-4">
          <img src="https://picsum.photos/id/10/200/300" alt="https://picsum.photos/id/10/200/300"
               class="w-24 h-24 rounded-full mb-4">
        </div>
        <h3 class="text-xl font-semibold">{{ user.username }}</h3>
        <p class="text-sm text-gray-600">{{ user.username }}@gmail.com</p>
      </div>
      <div class="space-y-3 text-sm">
        <p><span class="font-medium">ID:</span> {{ user.id }}</p>
        <p><span class="font-medium">Last seen:</span> {{ formatDate(user.lastSeen) }}</p>
        <p><span class="font-medium">Data creation:</span> {{ formatDate(user.dateOfCreation) }}</p>
      </div>
    </aside>

    <!-- Main: Event Activity -->
    <main class="flex-1 p-6">
      <h2 class="text-2xl font-semibold mb-4">Event activity</h2>

      <!-- Date Range Navigation -->
      <nav class="flex gap-2 flex-wrap mb-6">
        <button
            v-for="range in ranges"
            :key="range.key"
            @click="selectRange(range.key)"
            :class="[
            selectedRange === range.key
              ? 'bg-gray-800 text-white'
              : 'bg-gray-600 text-gray-200',
            'px-4 py-2 rounded'
          ]"
        >
          {{ range.label }}
        </button>
      </nav>

      <!-- Custom Date Picker -->
      <div v-if="selectedRange === 'custom'" class="mb-6">
        <label class="mr-2 font-medium">Custom Date:</label>
        <input
            type="date"
            v-model="customDateString"
            :min="user.dateOfCreation.format('YYYY-MM-DD')"
            :max="today.format('YYYY-MM-DD')"
            class="border px-3 py-2 rounded"
        />
      </div>

      <!-- Heatmap Grid with horizontal scroll -->
      <div v-if="dateList.length" class="mb-8">
        <div
            class="grid gap-px bg-gray-200 overflow-x-scroll"
            :style="{
            gridTemplateColumns: `80px repeat(${dateList.length}, minmax(40px, 1fr))`,
            gridTemplateRows: `40px repeat(24, minmax(30px, auto))`,
            maxWidth: `760px`
            // minWidth: `${dateList.length * 60 + 80}px`
          }"
        >
          <!-- Top-left corner -->
          <div class="bg-white"></div>
          <!-- Dates -->
          <div
              v-for="date in dateList"
              :key="date.valueOf()"
              class="bg-white text-center text-xs py-2"
              style="color: #212121 !important;"

          >
            {{ date.format(xAxisFormat) }}
          </div>

          <!-- Hours and cells -->
          <template v-for="hour in hourList">

            <div class="bg-white text-right pr-2 text-xs"
                 style="color: #212121 !important;"
            >

              {{ formatHour(hour) }}
            </div>
            <div
                v-for="(date, di) in dateList"
                :key="`${di}-${hour}`"
                class="h-8 flex items-center justify-center text-xs transition-colors duration-200"
                :class="cellClass(matrix[di][hour])"
                @mouseenter="hoverCell(date, hour)"
                @mouseleave="hoverCell(null, null)"
                @click="clickCell(date, hour)"
                style="color: #212121 !important;"
            >
              <span v-if="matrix[di][hour]">{{ matrix[di][hour] }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- Event List with pagination -->
      <ul class="space-y-4">
        <li
            v-for="evt in paginatedEvents"
            :key="evt.id"
            class="p-4 border rounded hover:bg-gray-50 cursor-pointer transition-all duration-300 min-h-[100px]"
            @mouseenter="hoverEvent(evt)"
            @mouseleave="hoverEvent(null)"
            @click="selectEvent(evt)"
        >
          <div class="flex justify-between">
            <span>{{ formatDate(evt.date) }}</span>
            <span class="font-medium">{{ evt.name }}</span>
          </div>
          <p
              v-if="activeEvent && activeEvent.id === evt.id"
              class="mt-2 text-sm text-gray-700"
          >
            {{ evt.description }}
          </p>
        </li>
      </ul>

      <!-- Paginator -->
      <div class="flex items-center justify-center mt-6 space-x-3">
        <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 border rounded"
        >Prev
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border rounded"
        >Next
        </button>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(utc)
dayjs.extend(customParseFormat)

interface EventItem {
  id: string
  date: dayjs.Dayjs
  name: string
  description: string
}

export default defineComponent({
  name: 'UserActivity',
  data() {
    const today = dayjs()
    return {
      user: {
        username: 'demo_user',
        dateOfCreation: dayjs().subtract(45, 'day'),
        lastSeen: today,
        id: 'user_' + Math.random().toString(36).substr(2, 9)
      },
      today,
      ranges: [
        {key: 'custom', label: 'Custom'},
        {key: 'today', label: 'Today'},
        {key: 'yesterday', label: 'Yesterday'},
        {key: '7d', label: '7d'},
        {key: '30d', label: '30d'},
        {key: '6m', label: '6m'},
        {key: '12m', label: '12m'}
      ] as Array<{ key: string; label: string }>,
      selectedRange: 'today' as string,
      customDateString: today.format('YYYY-MM-DD'),
      eventsMap: {} as Record<string, EventItem[]>,
      activeEvent: null as EventItem | null,
      hoveredCell: {date: null as any, hour: null as any},
      currentPage: 1,
      pageSize: 10
    }
  },
  created() {
    this.ranges.forEach(r => {
      if (r.key !== 'custom') {
        this.eventsMap[r.key] = this.generateEvents(r.key, null)
      }
    })
  },
  watch: {
    customDateString(newVal: string) {
      if (this.selectedRange === 'custom') {
        this.eventsMap['custom'] = this.generateEvents('custom', dayjs(newVal))
      }
    }
  },
  computed: {
    eventsForRange(): EventItem[] {
      if (this.selectedRange === 'custom') {
        return this.eventsMap['custom'] || []
      }
      return this.eventsMap[this.selectedRange] || []
    },
    dateList(): dayjs.Dayjs[] {
      if (this.selectedRange === 'custom') {
        return [dayjs(this.customDateString)]
      }
      const dates = this.eventsForRange.map(e => e.date.startOf('day'))
      const unique = Array.from(new Set(dates.map(d => d.valueOf())))
      return unique.map(v => dayjs(v)).sort((a, b) => a.valueOf() - b.valueOf())
    },
    hourList(): number[] {
      return Array.from({length: 24}, (_, i) => i)
    },
    matrix(): number[][] {
      const mat = this.dateList.map(() => Array(24).fill(0))
      this.eventsForRange.forEach(evt => {
        const di = this.dateList.findIndex(d => d.isSame(evt.date, 'day'))
        const h = evt.date.hour()
        if (di >= 0) mat[di][h]++
      })
      return mat
    },
    xAxisFormat(): string {
      return this.selectedRange === '12m' ? 'MMM YYYY' : 'DD MMM'
    },
    totalPages(): number {
      return Math.ceil(this.eventsForRange.length / this.pageSize)
    },
    paginatedEvents(): EventItem[] {
      const start = (this.currentPage - 1) * this.pageSize
      return this.eventsForRange.slice(start, start + this.pageSize)
    }
  },
  methods: {
    selectRange(key: string) {
      this.selectedRange = key
      this.user.lastSeen = dayjs()
      if (key !== 'custom' && !this.eventsMap[key]) {
        this.eventsMap[key] = this.generateEvents(key, null)
      }
      if (key === 'custom') {
        this.eventsMap['custom'] = this.generateEvents('custom', dayjs(this.customDateString))
      }
      this.currentPage = 1
    },
    goToPage(page: number) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
    },
    generateEvents(range: string, specificDate: dayjs.Dayjs | null): EventItem[] {
      const items: EventItem[] = []
      let start: dayjs.Dayjs
      let end: dayjs.Dayjs
      if (range === 'custom' && specificDate) {
        start = specificDate.startOf('day')
        end = specificDate.endOf('day')
      } else {
        end = dayjs()
        switch (range) {
          case 'today':
            start = dayjs().startOf('day');
            break
          case 'yesterday':
            start = dayjs().subtract(1, 'day').startOf('day')
            end = dayjs().subtract(1, 'day').endOf('day')
            break
          case '7d':
            start = dayjs().subtract(7, 'day').startOf('day');
            break
          case '30d':
            start = dayjs().subtract(30, 'day').startOf('day');
            break
          case '6m':
            start = dayjs().subtract(6, 'month').startOf('month');
            break
          case '12m':
            start = dayjs().subtract(12, 'month').startOf('month');
            break
          default:
            start = dayjs().subtract(7, 'day').startOf('day')
        }
      }
      const days = end.diff(start, 'day') + 1
      for (let d = 0; d < days; d++) {
        const date = start.add(d, 'day')
        const evCount = Math.floor(Math.random() * 5) + 1
        for (let i = 0; i < evCount; i++) {
          const randHour = Math.floor(Math.random() * 24)
          items.push({
            id: `${range}-${d}-${i}`,
            date: date.hour(randHour),
            name: `Activity ${Math.floor(Math.random() * 100)}`,
            description: `Description ${Math.floor(Math.random() * 1000)}`
          })
        }
      }
      return items
    },
    formatDate(date: dayjs.Dayjs) {
      return date.format(this.selectedRange === '12m' ? 'MMM YYYY' : 'DD MMM h:mma')
    },
    formatHour(h: number) {
      const ampm = h >= 12 ? 'PM' : 'AM'
      const hr = h % 12 || 12
      return `${hr} ${ampm}`
    },
    cellClass(count: number) {
      if (count === 0) return 'bg-white'
      if (count < 2) return 'bg-blue-100'
      if (count < 4) return 'bg-blue-300'
      return 'bg-blue-500 text-white'
    },
    hoverCell(date: dayjs.Dayjs | null, hour: number | null) {
      this.hoveredCell = {date, hour}
    },
    clickCell(date: dayjs.Dayjs, hour: number) {
      const evs = this.eventsForRange.filter(e => e.date.isSame(date, 'day') && e.date.hour() === hour)
      alert(evs.map(e => `${e.name}: ${e.description}`).join('\n'))
    },
    hoverEvent(evt: EventItem | null) {
      this.activeEvent = evt
    },
    selectEvent(evt: EventItem) {
      alert(`${evt.name}: ${evt.description}`)
    }
  }
})
</script>

<style scoped>
</style>
