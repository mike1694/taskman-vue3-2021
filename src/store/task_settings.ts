export default {
  namespaced: true,
  state: {
    show_date: true as boolean,
    show_info: true as boolean,
    hide_messages: true as boolean,
    show_progress_bar: false as boolean,
    finished_by_date: true as boolean,
    tasks_direction: false as boolean,
    tasks_timer: false as boolean
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
    get_show_date: (state: any): boolean => state.show_date,
    get_show_info: (state: any): boolean => state.show_info,
    get_hide_messages: (state: any): boolean => state.hide_messages,
    get_show_progress_bar: (state: any): boolean => state.show_progress_bar,
    get_finished_by_date: (state: any): boolean => state.finished_by_date,
    get_tasks_direction: (state: any): boolean => state.tasks_direction,
    get_tasks_timer: (state: any): boolean => state.tasks_timer
  }
};