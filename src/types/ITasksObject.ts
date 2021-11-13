import ITaskItem from "./ITaskItem";

export default interface ITasksObject {
  [key: string]: ITaskItem[]
}