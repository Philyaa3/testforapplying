<template>
  <LayoutWrapper />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LayoutWrapper from './components/LayoutWrapper.vue';

export default defineComponent({
  name: 'App',
  components: { LayoutWrapper }
});
</script>