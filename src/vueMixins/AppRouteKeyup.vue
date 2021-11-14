<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapMutations } from 'vuex';

export default defineComponent({
  mounted() {
    document.body.addEventListener('keyup', this.keyupHandler);
  },
  beforeUnmount() {
    document.body.addEventListener('keyup', this.keyupHandler);
  },
  computed: {
    ...mapGetters('history', {

    })
  },
  methods: {
    ...mapMutations('history', {

    }),
    keyupHandler(e: any) {
      if(e.target.tagName === "INPUT" && e.code === 'Escape') {
        return undefined;
      }
      if(e.target.tagName === "TEXTAREA" && e.code === 'Escape') {
        return undefined;
      }

      switch(e.code) {
        case 'KeyH':
          this.$router.push('/history');
          break;

        case 'NumpadAdd':
        case 'Equal':
          this.$router.push('/create');
          break;
        case 'Escape':
          this.$router.push('/');
          break;
        // case 'NumpadEnter':
        // case 'Enter':
        //   break;
        // case 'NumpadAdd':
        // case 'Equal':
        //   break;
      }
    }
  }
});
</script>
