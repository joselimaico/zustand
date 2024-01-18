import { StateCreator, StoreApi, create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Task, TaskStatus } from "../../interfaces";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface TaskState {
  draggingTaskId?: string;
  tasks: Record<string, Task>;
  getTaskByStatus: (status: TaskStatus) => Task[];
  setDraggingTaskId: (taskId: string) => void;
  removeDraggingTaskId: () => void;
  changeStatus: (taskId: string, status: TaskStatus) => void;
  onTaskDrop: (status: TaskStatus) => void;
  addTask: (title: string, status: TaskStatus) => void;
  totalTasks: () => number;
}

const StoreApi: StateCreator<TaskState, [["zustand/immer", never]]> = (
  set,
  get
) => ({
  draggingTaskId: undefined,
  tasks: {
    "ABC-1": { id: "ABC-1", title: "Task 1", status: "open" },
    "ABC-2": { id: "ABC-2", title: "Task 2", status: "in-progress" },
    "ABC-3": { id: "ABC-3", title: "Task 3", status: "open" },
    "ABC-4": { id: "ABC-4", title: "Task 4", status: "open" },
  },
  getTaskByStatus: (status: TaskStatus) => {
    const tasksValues = Object.values(get().tasks);
    return tasksValues.filter((task) => task.status === status);
  },
  setDraggingTaskId: (taskId: string) => {
    set({ draggingTaskId: taskId });
  },
  removeDraggingTaskId: () => {
    set({ draggingTaskId: undefined });
  },
  changeStatus: (taskId: string, status: TaskStatus) => {
    const task = { ...get().tasks[taskId] };
    task.status = status;
    // set((state) => ({
    //   tasks: {
    //     ...state.tasks,
    //     [taskId]: task,
    //   },
    // }));
    // ? funciona con el middleware immer
    set((state) => {
      state.tasks[taskId] = task;
    });
  },
  onTaskDrop: (status: TaskStatus) => {
    const taskId = get().draggingTaskId;
    get().changeStatus(taskId!, status);
    get().removeDraggingTaskId();
  },
  addTask: (title: string, status: TaskStatus) => {
    const newTask: Task = { id: uuidv4(), title, status };

    // set((state) => ({
    //   tasks: {
    //     ...state.tasks,
    //     [newTask.id]: newTask,
    //   },
    // }));
    //? funciona con el middleware immer
    set((state) => {
      state.tasks[newTask.id] = newTask;
    });
  },
  totalTasks: () => {
    return Object.values(get().tasks).length;
  },
});

// export const useTaskStore = create<TaskState>()(
//   devtools(
//     immer(
//       persist(StoreApi, {
//         name: "task-storage",
//       })
//     )
//   )
// );
export const useTaskStore = create<TaskState>()(
  devtools(persist(immer(StoreApi), { name: "task-storage" }))
);
// export const useTaskStore = create<TaskState>()(devtools(immer(StoreApi)));
