import dayjs from 'dayjs'

export interface EventItem {
    id: string
    date: dayjs.Dayjs
    name: string
    description: string
}

/**
 * Simulates fetching user events from an API.
 * @param range - one of 'today', 'yesterday', '7d', '30d', '6m', '12m', 'custom'
 * @param dateString - ISO date string for 'custom' range (YYYY-MM-DD)
 */
export function fetchUserEvents(
    range: string,
    dateString?: string
): Promise<EventItem[]> {
    return new Promise(resolve => {
        setTimeout(() => {
            const items: EventItem[] = []
            const now = dayjs()
            let start: dayjs.Dayjs
            let end: dayjs.Dayjs

            if (range === 'custom' && dateString) {
                start = dayjs(dateString).startOf('day')
                end = dayjs(dateString).endOf('day')
            } else {
                end = now
                switch (range) {
                    case 'today': start = now.startOf('day'); break
                    case 'yesterday': start = now.subtract(1, 'day').startOf('day'); end = now.subtract(1, 'day').endOf('day'); break
                    case '7d': start = now.subtract(7, 'day').startOf('day'); break
                    case '30d': start = now.subtract(30, 'day').startOf('day'); break
                    case '6m': start = now.subtract(6, 'month').startOf('month'); break
                    case '12m': start = now.subtract(12, 'month').startOf('month'); break
                    default: start = now.subtract(7, 'day').startOf('day')
                }
            }

            const days = end.diff(start, 'day') + 1
            for (let d = 0; d < days; d++) {
                const date = start.add(d, 'day')
                const count = Math.floor(Math.random() * 5) + 1
                for (let i = 0; i < count; i++) {
                    const hour = Math.floor(Math.random() * 24)
                    items.push({
                        id: `${range}-${d}-${i}`,
                        date: date.hour(hour),
                        name: `Activity ${Math.floor(Math.random() * 100)}`,
                        description: `Description for activity ${Math.floor(Math.random() * 1000)}`
                    })
                }
            }

            resolve(items)
        }, 500)
    })
}
