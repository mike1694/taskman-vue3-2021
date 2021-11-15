export default interface IHistoryItem {
  id: number,
  type: string,
  label: string,
  text: string,
  path: string,
  date: string,
  song_length?: string,
  status: string,
  created: string
};