<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';

export default defineComponent({
  mounted() {
    document.body.addEventListener('keyup', this.keyupHandler);
  },
  beforeUnmount() {
    document.body.addEventListener('keyup', this.keyupHandler);
  },
  methods: {
    ...mapMutations('tasks', {
      resetEditTask: 'reset_edit_task'
    }),
    keyupHandler(e: any) {
      if(this.$route.path !== '/') {
        return undefined;
      }
      if(e.target.tagName === "INPUT" && e.code !== 'Escape') {
        return undefined;
      }
      if(e.target.tagName === "TEXTAREA" && e.code !== 'Escape') {
        return undefined;
      }

      switch(e.code) {
        case 'Escape':
          this.resetEditTask();
          break;
        case 'NumpadEnter':
        case 'Enter':
          break;
        case 'NumpadAdd':
        case 'Equal':
          this.$router.push('/create');
          break;
      }
    }
  }
})
</script>
