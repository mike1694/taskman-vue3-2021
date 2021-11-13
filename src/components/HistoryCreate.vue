<template>
  <div class="history-create">
    <h4 class="mb2">Создать новую историю</h4>

    <history-form
      :modelValue="vmodel"

      @update:modelValue="vmodel = $event"
      
      @submit="addHistory"
      @cancel="reset">
    </history-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapMutations } from 'vuex';
import HistoryForm from '@/components/HistoryForm.vue';
import IHistoryItem from '@/types/IHistoryItem';

export default defineComponent({
  name: 'HistoryCreate',
  components: {HistoryForm},
  data() {
    return {
      vmodel: {
        type: 'log' as string,
        label: '' as string,
        text: '' as string,
        path: '' as string,
        year: '' as string | number,
        status: 'created' as string,
      }
    };
  },
  created() {
    this.resetEditHistory();
  },
  mounted() {
    document.body.addEventListener('keyup', this.keyupHandler);
  },
  beforeUnmount() {
    document.body.addEventListener('keyup', this.keyupHandler);
  },
  methods: {
    ...mapActions('history', {
      createHistory: 'create_history'
    }),
    ...mapMutations('history', {
      resetEditHistory: 'reset_edit_history',
      toggleHistoryCreate: 'toggle_history_create'
    }),
    addHistory() {
      let res: IHistoryItem = {
        ...this.vmodel,
        created: new Date().toISOString(),
        id: Date.now()
      };

      this.createHistory(res);
      // this.$router.push('/history');
    },
    reset() {
      this.vmodel.type = 'log';
      this.vmodel.label = '';
      this.vmodel.text = '';
      this.vmodel.path = '';
      this.vmodel.year = '';
      this.vmodel.status = 'created';

      this.toggleHistoryCreate(false);
    },
    keyupHandler(e: any) {
      if(this.$route.path !== '/history') {
        return undefined;
      }

      switch(e.code) {
        // case 'Escape':
        //   this.$router.push('/');
        //   break;
        case 'NumpadEnter':
        case 'Enter':
          if(e.target.tagName === "TEXTAREA") {
            return undefined;
          }
          this.addHistory();
          break;
        // case 'NumpadAdd':
        // case 'Equal':
        //   break;
      }
    },
  }
})
</script>

<style scoped>
.history-create {
  width: 500px;
}
</style>