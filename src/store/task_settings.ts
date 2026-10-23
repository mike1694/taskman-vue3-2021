import { defineStore } from 'pinia';

export const useTaskSettingsStore = defineStore('task_settings', {
  state: () => ({
    showDate: true,
    showInfo: true,
    hideMessages: true,
    showProgressBar: false,
    finishedByDate: true,
    tasksDirection: false,
    tasksTimer: false
  }),
  actions: {
    toggleShowDate() {
      this.showDate = !this.showDate;
    },
    toggleShowInfo() {
      this.showInfo = !this.showInfo;
    },
    toggleHideMessages() {
      this.hideMessages = !this.hideMessages;
    },
    toggleShowProgressBar() {
      this.showProgressBar = !this.showProgressBar;
    },
    toggleFinishedByDate() {
      this.finishedByDate = !this.finishedByDate;
    },
    toggleTasksDirection() {
      this.tasksDirection = !this.tasksDirection;
    },
    toggleTasksTimer() {
      this.tasksTimer = !this.tasksTimer;
    }
  }
});