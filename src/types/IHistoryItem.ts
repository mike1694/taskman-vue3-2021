export default interface IHistoryItem {
  id: number,
  type: string,
  label: string,
  text: string,
  path: string,
  year: string | number,
  status: string,
  created: string
};