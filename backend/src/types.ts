export interface TaskItem {
  id: number;
  label: string;
  type: string;
  created: string;
  info: string | null;
  maxDate: string | null;
  maxTime: string | null;
  reopen: boolean;
  timer: boolean;
  closed?: boolean;
  result?: string | null;
  closed_date?: string | null;
}

export interface HistoryItem {
  id: number;
  type: string;
  label: string;
  text: string;
  path: string;
  date: string;
  song_length?: string | null;
  status: string;
  created: string;
}
