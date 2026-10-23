import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useTaskSettingsStore = defineStore(
  'task_settings',
  () => {
    const showDate = ref(true);
    const showInfo = ref(true);
    const hideMessages = ref(true);
    const showProgressBar = ref(false);
    const finishedByDate = ref(true);
    const tasksDirection = ref(false);
    const tasksTimer = ref(false);

    function toggleShowDate() {
      showDate.value = !showDate.value;
    }

    function toggleShowInfo() {
      showInfo.value = !showInfo.value;
    }

    function toggleHideMessages() {
      hideMessages.value = !hideMessages.value;
    }

    function toggleShowProgressBar() {
      showProgressBar.value = !showProgressBar.value;
    }

    function toggleFinishedByDate() {
      finishedByDate.value = !finishedByDate.value;
    }

    function toggleTasksDirection() {
      tasksDirection.value = !tasksDirection.value;
    }

    function toggleTasksTimer() {
      tasksTimer.value = !tasksTimer.value;
    }

    return {
      showDate,
      showInfo,
      hideMessages,
      showProgressBar,
      finishedByDate,
      tasksDirection,
      tasksTimer,
      toggleShowDate,
      toggleShowInfo,
      toggleHideMessages,
      toggleShowProgressBar,
      toggleFinishedByDate,
      toggleTasksDirection,
      toggleTasksTimer,
    };
  },
);
