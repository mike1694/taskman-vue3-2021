<template>
  <div class="nav mb2">
    <router-link class="nav__link" to="/">Задачи</router-link> |

    <router-link class="nav__link" to="/create"
      >Создать задачу</router-link
    >
    |

    <router-link class="nav__link" to="/history">История</router-link>
  </div>

  <router-view />
</template>

<script setup lang="ts">
import { useTasksStore } from '@/store/tasks';
import { useHistoryStore } from '@/store/history';
import { useAppRouteKeyup } from '@/composables/useAppRouteKeyup';

const tasksStore = useTasksStore();
const historyStore = useHistoryStore();

useAppRouteKeyup();

tasksStore.getTasks();
historyStore.getHistory();
</script>

<style lang="scss">
.nav {
  padding: 15px;
  background: linear-gradient(#f5f5f56b, #f5f5f5de);

  .nav__link {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }

    &.router-link-exact-active:hover {
      text-decoration: none;
    }

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
