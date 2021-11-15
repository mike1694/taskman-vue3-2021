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
import { mapActions, mapGetters, mapMutations } from 'vuex';
import HistoryForm from '@/components/HistoryForm.vue';
import IHistoryItem from '@/types/IHistoryItem';
import {getDateNow} from '@/api/date_now';

export default defineComponent({
  name: 'HistoryCreate',
  components: {HistoryForm},
  data() {
    return {
      vmodel: {
        type: 'log',
        label: '',
        text: '',
        path: '',
        date: getDateNow(),
        song_length: '',
        status: 'in_process',
      } as IHistoryItem
    };
  },
  watch: {
    'vmodel.path': function(path) {
      // create date project autocomplete
      let item = this.history.find((i: IHistoryItem) => i.path === path);

      if(item) {
        this.vmodel.date = item.date;
      }
    }
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
  computed: {
    ...mapGetters('history', {
      history: 'get_all_history'
    })
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
      this.vmodel.date = getDateNow();
      this.vmodel.song_length = '';
      this.vmodel.status = 'in_process';

      this.toggleHistoryCreate(false);
    },
    keyupHandler(e: any) {
      if(this.$route.path !== '/history') {
        return undefined;
      }

      switch(e.code) {
        case 'Escape':
          this.resetEditHistory();
          this.reset();
          // this.toggleHistoryCreate(false);
          break;
        case 'NumpadEnter':
        case 'Enter':
          if(e.target.tagName === "TEXTAREA") {
            return undefined;
          }
          this.addHistory();
          this.toggleHistoryCreate(false);
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