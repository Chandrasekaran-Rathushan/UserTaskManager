import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AuthForm from "../src/app/app-auth/auth-form";

jest.mock("axios");

describe("LoginForm", () => {
  it("should render login form", () => {
    const mockFn = jest.fn();

    const { getByLabelText, getByText } = render(
      <AuthForm isSignIn={true} onSubmit={mockFn} disableSubmit={false} />
    );

    expect(getByLabelText(/email/i)).toBeInTheDocument();
    expect(getByLabelText(/password/i)).toBeInTheDocument();
    expect(getByText(/sign-in/i)).toBeInTheDocument();
  });

  it("should handle form submission", async () => {
    const mockFn = jest.fn(() => {
      console.log("onSubmit");
    });

    const { getByLabelText, getByTestId } = render(
      <AuthForm isSignIn={true} onSubmit={mockFn} disableSubmit={false} />
    );
    const emailInput = getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = getByLabelText(/password/i) as HTMLInputElement;
    const submitButton = getByTestId("loginSubmitBtn") as HTMLButtonElement;

    const email = "admin@utm.com";
    const password = "Admin@123";

    userEvent.type(emailInput, email);
    userEvent.type(passwordInput, password);

    fireEvent.change(emailInput, { target: { value: email } });
    expect(emailInput.value).toMatch(email);
    fireEvent.change(passwordInput, { target: { value: password } });
    expect(passwordInput.value).toMatch(password);

    await waitFor(() => {
      fireEvent.submit(submitButton);
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
