import { http, HttpResponse } from "msw";

export const handlers = [
  http.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskitem`, () => {
    return HttpResponse.json([
      {
        id: 1,
        title: "Task 1",
        description: "Description for task 1",
        start: "2024-07-11T10:00:00",
        end: "2024-07-11T11:00:00",
        status: "Completed",
        priority: "Low",
        color: "clsStatusCompletedGreen",
        createdDateTime: "2024-07-05T21:33:02.4652512",
        lastUpdatedDateTime: "2024-07-05T21:33:02.4652882",
      },
      {
        id: 2,
        title: "Task 2",
        description: "Description for task 2",
        start: "2024-07-13T12:00:00",
        end: "2024-07-15T12:00:00",
        status: "New",
        priority: "Low",
        color: "clsLowPriorityBlue",
        createdDateTime: "2024-07-05T21:33:02.4653258",
        lastUpdatedDateTime: "2024-07-05T21:33:02.4653259",
      },
      {
        id: 4,
        title: "Task 4",
        description: "Description for task 4",
        start: "2024-07-20T10:00:00",
        end: "2024-07-20T11:00:00",
        status: "New",
        priority: "High",
        color: "clsHighPriorityOrange",
        createdDateTime: "2024-07-05T21:33:02.4653278",
        lastUpdatedDateTime: "2024-07-05T21:33:02.4653278",
      },
    ]);
  }),
];
