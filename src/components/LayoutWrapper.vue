<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDarkStore } from '../stores/dark.ts';

export default defineComponent({
  name: 'LayoutWrapper',
  setup() {
    const darkStore = useDarkStore();
    const route = useRoute();

    const crumbs = computed(() => [
      { text: 'Home', to: '/' },
      { text: route.name as string, to: route.path }
    ]);

    const darkMode = computed({
      get: () => darkStore.dark,
      set: (val: boolean) => darkStore.toggle(val)
    });

    const toggleDark = () => darkStore.toggle(!darkStore.dark);

    // sidebar state
    const sidebarCollapsed = ref(false);
    const mobileSidebarOpen = ref(false);

    const toggleSidebar = () => {
      if (window.innerWidth >= 768) {
        sidebarCollapsed.value = !sidebarCollapsed.value;
      } else {
        mobileSidebarOpen.value = !mobileSidebarOpen.value;
      }
    };

    return {
      crumbs,
      darkMode,
      toggleDark,
      sidebarCollapsed,
      mobileSidebarOpen,
      toggleSidebar
    };
  }
});
</script>
<template>
  <div class="layout-wrapper" :class="{ dark: darkMode }">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <button class="menu-btn" @click="toggleSidebar">☰</button>
        <nav class="breadcrumb">
          <router-link v-for="(crumb, idx) in crumbs" :key="idx" :to="crumb.to">
            <span>{{ crumb.text }}</span>
            <span v-if="idx < crumbs.length - 1"> / </span>
          </router-link>
        </nav>
      </div>
      <div class="dark-toggle">
        <button @click="toggleDark">
          {{ darkMode ? '☀️ Light' : '🌙 Dark' }}
        </button>
      </div>
    </header>

    <div class="main-layout">
      <!-- Sidebar -->
      <aside
          :class="['sidebar', { collapsed: sidebarCollapsed, 'mobile-open': mobileSidebarOpen }]"
          :style="{ background: '#6f6f6f' }"
      >
        <button class="collapse-btn" @click="toggleSidebar">
          {{ sidebarCollapsed ? '▶' : '◀' }}
        </button>
        <ul class="menu-list">
          <li>
            <router-link to="/user-activity">User Activity</router-link>
          </li>
          <li>
            <router-link to="/accounts">Accounts</router-link>
          </li>
        </ul>
      </aside>

      <!-- Overlay for mobile sidebar -->
      <div
          class="mobile-overlay"
          v-if="mobileSidebarOpen"
          @click="toggleSidebar"
      ></div>

      <!-- Main content via RouterView -->
      <main class="content">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.sidebar.collapsed .menu-list a {
  padding: 0.5rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sidebar.collapsed .menu-list a:hover {
  background: rgba(0,0,0,0.05);
  padding-left: 0.5rem;
}
.layout-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  transition: background 0.3s, color 0.3s;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--header-bg);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.header-left {
  display: flex;
  align-items: center;
}
.menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  margin-right: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
}
.menu-btn:hover {
  transform: rotate(90deg);
}
.main-layout {
  display: flex;
  flex: 1;
  position: relative;
}
.sidebar {
  width: 200px;
  background-color: var(--sidebar-bg);
  padding: 1rem;
  transition: width 0.3s ease, transform 0.3s ease, background-color 0.3s;
  border-right: 1px solid rgba(0,0,0,0.05);
  box-shadow: 2px 0 4px rgba(0,0,0,0.1);
}
.sidebar.collapsed {
  width: 50px;
}
.menu-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}
.menu-list li {
  margin-bottom: 0.75rem;
}
.menu-list li:last-child {
  margin-bottom: 0;
}
.menu-list a {
  display: block;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-color);
  transition: background 0.2s, padding-left 0.2s;
}
.menu-list a:hover {
  background: rgba(0,0,0,0.05);
  padding-left: 1.25rem;
}
.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: transform 0.2s;
}
.collapse-btn:hover {
  transform: scale(1.1);
}
/* mobile hidden by default, show on open */
.sidebar {
  transform: translateX(0);
}
.sidebar.mobile-open {
  transform: translateX(0);
}
@media (max-width: 767px) {
  .menu-btn {
    display: block;
  }
  .sidebar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 80vw;
    max-width: 300px;
    transform: translateX(-100%);
    z-index: 1000;
    box-shadow: 2px 0 8px rgba(0,0,0,0.2);
  }
  .sidebar.mobile-open {
    transform: translateX(0);
  }
  .mobile-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 900;
  }
}
.content {
  flex: 1;
  padding: 1rem;
  background: var(--content-bg);
  overflow-y: auto;
  transition: background 0.3s;
}
:root {
  --header-bg: #f5f5f5;
  --sidebar-bg: #ffffff;
  --content-bg: #fafafa;
  --text-color: #333;
}
.dark {
  --header-bg: #2d2d2d;
  --sidebar-bg: #1e1e1e;
  --content-bg: #2b2b2b;
  --text-color: #eee;
}
.layout-wrapper { color: var(--text-color); }
</style>
