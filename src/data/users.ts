import dayjs from 'dayjs'

export interface User {
    username: string
    dateOfCreation: dayjs.Dayjs
    lastSeen: dayjs.Dayjs
    id: string
}

export interface RangeOption {
    key: string
    label: string
}

export interface InitialState {
    user: User
    today: dayjs.Dayjs
    ranges: RangeOption[]
    selectedRange: string
    customDateString: string
    eventsMap: Record<string, any[]>
    activeEvent: any | null
    hoveredCell: { date: dayjs.Dayjs | null; hour: number | null }
}

/**
 * Искусственный фетч для начального состояния компонента
 */
export function fetchInitialState(): Promise<InitialState> {
    return new Promise(resolve => {
        const today = dayjs()
        const state: InitialState = {
            user: {
                username: 'demo_user',
                dateOfCreation: today.subtract(45, 'day'),
                lastSeen: today,
                id: 'user_' + Math.random().toString(36).substr(2, 9)
            },
            today,
            ranges: [
                { key: 'today', label: 'Today' },
                { key: 'yesterday', label: 'Yesterday' },
                { key: '7d', label: '7d' },
                { key: '30d', label: '30d' },
                { key: '6m', label: '6m' },
                { key: '12m', label: '12m' },
                { key: 'custom', label: 'Custom Date' }
            ],
            selectedRange: 'today',
            customDateString: today.format('YYYY-MM-DD'),
            eventsMap: {},
            activeEvent: null,
            hoveredCell: { date: null, hour: null }
        }
        setTimeout(() => resolve(state), 300)
    })
}
