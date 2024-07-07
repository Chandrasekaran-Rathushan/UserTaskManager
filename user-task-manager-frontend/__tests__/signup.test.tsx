import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AuthForm from "../src/app/app-auth/auth-form";

jest.mock("axios");

describe("UserRegistrationForm", () => {
  it("should render user registration form", () => {
    const mockFn = jest.fn();

    const { getByLabelText, getByText, getByTestId } = render(
      <AuthForm isSignIn={false} onSubmit={mockFn} disableSubmit={false} />
    );

    expect(getByLabelText(/email/i)).toBeInTheDocument();
    expect(getByTestId("password")).toBeInTheDocument();
    expect(getByTestId("confirmPassword")).toBeInTheDocument();
    expect(getByText(/sign-up/i)).toBeInTheDocument();
  });

  it("should handle user register form submission", async () => {
    const mockFn = jest.fn(() => {
      console.log("onSubmit");
    });

    const { getByLabelText, getByTestId } = render(
      <AuthForm isSignIn={false} onSubmit={mockFn} disableSubmit={false} />
    );
    const emailInput = getByLabelText(/email/i) as HTMLInputElement;

    const passwordInput = getByTestId("password") as HTMLInputElement;
    const confirmPasswordInput = getByTestId(
      "confirmPassword"
    ) as HTMLInputElement;

    const submitButton = getByTestId("submitBtn") as HTMLButtonElement;

    const email = "admin@utm.com";
    const password = "Admin@123";
    const confirmPassword = "Admin@123";

    userEvent.type(emailInput, email);
    userEvent.type(passwordInput, password);
    userEvent.type(confirmPasswordInput, confirmPassword);

    fireEvent.change(emailInput, { target: { value: email } });
    expect(emailInput.value).toMatch(email);
    fireEvent.change(passwordInput, { target: { value: password } });
    expect(passwordInput.value).toMatch(password);

    fireEvent.change(confirmPasswordInput, {
      target: { value: confirmPassword },
    });
    expect(confirmPasswordInput.value).toMatch(confirmPassword);

    await waitFor(() => {
      fireEvent.submit(submitButton);
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
