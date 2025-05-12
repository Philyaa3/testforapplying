<template>
  <svg
      :width="width"
      :height="height"
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      class="w-full h-[30px]"
  >
    <!-- Shadow path below the main line -->
    <path
        :d="path"
        fill="none"
        stroke="#2490ED"
        stroke-opacity="1"
        stroke-width="2"
        class="blur-[6px] translate-y-[3px]"
    />

    <!-- Main visible line -->
    <path
        :d="path"
        fill="none"
        stroke="#2490ED"
        stroke-width="2"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ChartLine',
  props: {
    data: {
      type: Array as () => number[],
      required: true
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 30
    }
  },
  computed: {
    path(): string {
      if (!this.data.length) return ''
      const values = this.data as number[]
      const max = Math.max(...values)
      const min = Math.min(...values)
      const range = max - min || 1
      const step = 100 / (values.length - 1)

      const points: [number, number][] = values.map((val, i) => {
        const x = i * step
        const y = 30 - ((val - min) / range) * 30
        return [x, y]
      })

      let d = `M ${points[0][0]},${points[0][1]} `
      for (let i = 1; i < points.length; i++) {
        const [prevX, prevY] = points[i - 1]
        const [currX, currY] = points[i]
        const midX = (prevX + currX) / 2
        const midY = (prevY + currY) / 2
        d += `Q ${prevX},${prevY} ${midX},${midY} `
      }

      return d.trim()
    }
  }
})
</script>