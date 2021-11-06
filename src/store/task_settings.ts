export default {
  namespaced: true,
  state: {
    show_date: true,
    show_info: true,
    hide_messages: true,
    show_progress_bar: false,
    finished_by_date: true,
    tasks_direction: false,
    tasks_timer: false
  },
  mutations: {
    toggle_show_date: (state: any) => state.show_date = !state.show_date,
    toggle_show_info: (state: any) => state.show_info = !state.show_info,
    toggle_hide_messages: (state: any) => state.hide_messages = !state.hide_messages,
    toggle_show_progress_bar: (state: any) => state.show_progress_bar = !state.show_progress_bar,
    toggle_finished_by_date: (state: any) => state.finished_by_date = !state.finished_by_date,
    toggle_tasks_direction: (state: any) => state.tasks_direction = !state.tasks_direction,
    toggle_tasks_timer: (state: any) => state.tasks_timer = !state.tasks_timer,
  },
  getters: {
    get_show_date: (state: any) => state.show_date,
    get_show_info: (state: any) => state.show_info,
    get_hide_messages: (state: any) => state.hide_messages,
    get_show_progress_bar: (state: any) => state.show_progress_bar,
    get_finished_by_date: (state: any) => state.finished_by_date,
    get_tasks_direction: (state: any) => state.tasks_direction,
    get_tasks_timer: (state: any) => state.tasks_timer
  }
};