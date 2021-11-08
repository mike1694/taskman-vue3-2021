<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  mounted() {
    document.body.addEventListener('keyup', this.keyupHandler);
  },
  beforeUnmount() {
    document.body.addEventListener('keyup', this.keyupHandler);
  },
  methods: {
    keyupHandler(e: any) {
      // console.log(e.code, e);

      switch(e.code) {
        case 'Escape':
          if(this.$route.path === '/create') {
            this.$router.push('/');
          }
          break;
        // case 'NumpadEnter':
        // case 'Enter':
        //   if(Array.from(e.target.classList).includes('create-task-modal__header--textarea')) {
        //     break;
        //   }
            
        //   this.addTask();
        //   break;
        case 'NumpadAdd':
        case 'Equal':
          // if(this.$route.path === '/') {
          //   console.log('equal /create');
          //   this.$router.push('/create');
          // }
          break;
      }
    }
  }
});
</script>
