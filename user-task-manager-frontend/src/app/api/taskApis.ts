import { apiRequest } from "./apiRequest";

export enum TaskStatuses {
  New = 1,
  Ongoing = 2,
  Completed = 3,
  Suspended = 4,
}

export enum TaskPriorities {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
}

export interface TaskPayload {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  start: Date;
  end: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  start: Date;
  end: Date;
  color: string;
}

export const createTask = async (
  task: any,
  token: string
): Promise<Task> => {
  const response = await apiRequest<Task>({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskitem`,
    method: "POST",
    data: task,
    token: token,
  });
  return response;
};

export const getTasks = async (params: any, token: string): Promise<Task[]> => {
  const response = await apiRequest<Task[]>({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskitem`,
    method: "GET",
    token: token,
    params,
  });

  return response;
};

export const getTaskById = async (
  taskId: string,
  token: string
): Promise<Task> => {
  const response = await apiRequest<Task>({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskitem/${taskId}`,
    method: "GET",
    token: token,
  });
  return response;
};

export const updateTask = async (
  taskId: string,
  task: any,
  token: string
): Promise<Task> => {
  const response = await apiRequest<Task>({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskitem/${taskId}`,
    method: "PUT",
    data: task,
    token: token,
  });
  return response;
};

export const deleteTask = async (
  taskId: string,
  token: string
): Promise<boolean> => {
  const response = await apiRequest<boolean>({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskitem/${taskId}`,
    method: "DELETE",
    token: token,
  });

  return response;
};

export const changeTaskStatus = async (
  taskId: string,
  status: TaskStatuses,
  token: string
): Promise<Task> => {
  const params = new URLSearchParams({ status: status.toString() }).toString();
  const response = await apiRequest<Task>({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskitem/${taskId}/update-status?${params}`,
    method: "PATCH",
    token: token,
  });
  return response;
};

export const changeTaskPriority = async (
  taskId: string,
  priority: TaskPriorities,
  token: string
): Promise<Task> => {
  const params = new URLSearchParams({
    priority: priority.toString(),
  }).toString();

  const response = await apiRequest<Task>({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskitem/${taskId}/update-priority?${params}`,
    method: "PATCH",
    token: token,
  });
  return response;
};
