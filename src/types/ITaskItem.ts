export default interface ITaskItem {
  id: number,
  label: string,
  type: string,
  created: string,
  info: string | null,
  maxDate: string | null,
  maxTime: string | null,
  reopen: boolean,
  timer: boolean,
  closed?: boolean,
  result?: string,
  closed_date?: string | null | undefined
};