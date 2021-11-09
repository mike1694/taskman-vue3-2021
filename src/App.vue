<template>
  <div id="nav" class="mb2">
    <router-link to="/">Задачи</router-link> |
    <router-link to="/create">Создать задачу</router-link> |
    <router-link to="/diary">История</router-link>
  </div>
  <!-- <div class="wallpaper"></div> -->
  <router-view/>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';
import AppRouteKeyupVue from './vueMixins/AppRouteKeyup.vue';

export default defineComponent({
  mixins: [AppRouteKeyupVue],
  name: 'App',
  created() {
    this.getTasks();
  },
  methods: {
    ...mapActions('tasks', {
      getTasks: 'get_tasks'
    })
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.wallpaper {
  // background-image: url(assets/img/halloween.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-position: bottom;
  filter: brightness(0.8) blur(0px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
}

#nav {
  padding: 15px;
  background: linear-gradient(#f5f5f56b, #f5f5f5de);

  a {
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
