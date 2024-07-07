import {
  render,
  fireEvent,
  waitFor,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EventModal from "@/app/components/calendar/calendar-event-modal";
import ReduxProvider from "@/store/redux-provider";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { SnackbarProvider } from "@/app/contexts/SnackbarContext";

jest.mock("axios");

jest.mock("@mui/lab/DateTimePicker", () => {
  return jest.requireActual("@mui/lab/DesktopDateTimePicker");
});

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

const handleClose = jest.fn();

const TaskForm = () => {
  return (
    <ReduxProvider>
      <SnackbarProvider>
        <AuthProvider>
          <EventModal open={true} handleClose={handleClose} />
        </AuthProvider>
      </SnackbarProvider>
    </ReduxProvider>
  );
};

describe("TaskForm", () => {
  it("should render task form", () => {
    const { getByLabelText, getByText, getByTestId, getByRole } = render(
      <TaskForm />
    );

    expect(getByTestId("title")).toBeInTheDocument();
    expect(getByTestId("description")).toBeInTheDocument();

    expect(getByLabelText(/start date/i)).toBeInTheDocument();
    expect(getByLabelText(/end date/i)).toBeInTheDocument();

    expect(getByLabelText(/status/i)).toBeInTheDocument();
    expect(getByLabelText(/priority/i)).toBeInTheDocument();

    expect(getByTestId("submitBtn")).toBeInTheDocument();
  });

  it("should handle task form validation", async () => {
    const { getByLabelText, getByTestId } = render(<TaskForm />);

    const statusInput = getByLabelText(/status/i) as HTMLInputElement;
    const priorityInput = getByLabelText(/priority/i) as HTMLInputElement;

    const titleInput = getByTestId("title") as HTMLInputElement;
    const descriptionInput = getByTestId("description") as HTMLInputElement;

    const startDateInput = getByTestId("startDate") as HTMLInputElement;
    const endDateInput = getByTestId("endDate") as HTMLInputElement;

    const submitButton = getByTestId("submitBtn") as HTMLButtonElement;

    const status = "New";
    const priority = "Low";
    const title = "Test Task";
    const description = "Test Dec";
    const startDate = "07/07/2024 10:00 AM";
    const endDate = "07/07/2024 11:00 AM";

    userEvent.type(statusInput, status);
    userEvent.type(priorityInput, priority);
    userEvent.type(titleInput, title);
    userEvent.type(descriptionInput, description);
    userEvent.type(startDateInput, startDate);
    userEvent.type(endDateInput, endDate);

    // without setting any data submitting the form to check validations
    await waitFor(() => {
      userEvent.click(submitButton);
    });

    const titleError = await screen.findByText(/title is required/i);
    expect(titleError).toBeInTheDocument();

    const DescError = await screen.findByText(/description is required/i);
    expect(DescError).toBeInTheDocument();

    const startDateError = await screen.findByText(/start date is required/i);
    expect(startDateError).toBeInTheDocument();

    const endDateError = await screen.findByText(/end date is required/i);
    expect(endDateError).toBeInTheDocument();

    const statusError = await screen.findByText(/status is required/i);
    expect(statusError).toBeInTheDocument();

    const priorityError = await screen.findByText(/priority is required/i);
    expect(priorityError).toBeInTheDocument();
  });

  it("should handle task form submission", async () => {
    const { getByLabelText, getByTestId } = render(<TaskForm />);

    const statusInput = getByLabelText(/status/i) as HTMLInputElement;
    const priorityInput = getByLabelText(/priority/i) as HTMLInputElement;

    const titleInput = getByTestId("title") as HTMLInputElement;
    const descriptionInput = getByTestId("description") as HTMLInputElement;

    const startDateInput = getByTestId("startDate") as HTMLInputElement;
    const endDateInput = getByTestId("endDate") as HTMLInputElement;

    const submitButton = getByTestId("submitBtn") as HTMLButtonElement;

    const status = "New";
    const priority = "Low";
    const title = "Test Task";
    const description = "Test Dec";
    const startDate = "07/07/2024 10:00 AM";
    const endDate = "07/07/2024 11:00 AM";

    // const startDate = new Date(2024, 7, 7);
    // const endDate = new Date(2024, 7, 8);

    userEvent.type(statusInput, status);
    userEvent.type(priorityInput, priority);
    userEvent.type(titleInput, title);
    userEvent.type(descriptionInput, description);

    fireEvent.change(titleInput, { target: { value: title } });
    expect(titleInput.value).toMatch(title);
    fireEvent.change(descriptionInput, { target: { value: description } });
    expect(descriptionInput.value).toMatch(description);

    // select status
    userEvent.click(statusInput);

    const statusOptionsPopupEl = await screen.findByRole("listbox", {
      name: /status/i,
    });
    userEvent.click(within(statusOptionsPopupEl).getByText(status));

    var statusInputAfterSelect = await screen.findByText(status);
    expect(statusInputAfterSelect.textContent).toEqual(status);

    // select priority
    userEvent.click(priorityInput);

    const priorityOptionsPopupEl = await screen.findByRole("listbox", {
      name: /priority/i,
    });
    userEvent.click(within(priorityOptionsPopupEl).getByText(priority));
    var priorityInputAfterSelect = await screen.findByText(priority);
    expect(priorityInputAfterSelect.textContent).toEqual(priority);

    userEvent.click(startDateInput);

    fireEvent.change(startDateInput, {
      target: { value: startDate },
    });

    expect(startDateInput.value).toBe(startDate);

    userEvent.click(endDateInput);

    fireEvent.change(endDateInput, { target: { value: endDate } });
    expect(endDateInput.value).toMatch(endDate);

    await waitFor(() => {
      userEvent.click(submitButton);
    });
  });
});
