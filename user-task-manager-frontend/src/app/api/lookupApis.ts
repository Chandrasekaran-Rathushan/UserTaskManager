import { apiRequest } from "./apiRequest";

export interface ListItem {
  key: string;
  value: number;
}

export const getTaskStatuses = async (token: string): Promise<ListItem[]> => {
  const response = await apiRequest<ListItem[]>({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskitem/statuses`,
    method: "GET",
    token: token,
  });

  return response;
};

export const getTaskPriorities = async (token: string): Promise<ListItem[]> => {
  const response = await apiRequest<ListItem[]>({
    url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskitem/priorities`,
    method: "GET",
    token: token,
  });

  return response;
};
