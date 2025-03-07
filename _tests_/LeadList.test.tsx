// __tests__/LeadList.test.tsx
"use client";

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LeadList from "../app/leadlist/page";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

// Mock next/navigation so that useRouter returns a push function.
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("LeadList Page", () => {
  const setup = () =>
    render(
      <Provider store={store}>
        <LeadList />
      </Provider>,
    );

  // Before each test, we also override global.fetch to return valid JSON for leads.
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]), // Return an empty array (or provide dummy leads if desired)
        ok: true,
      }),
    ) as jest.Mock;
  });

  it("renders sidebar, main header, and authentication modal initially", () => {
    setup();
    // Use a more specific query for the main header.
    expect(screen.getByRole("heading", { name: /Leads/i })).toBeInTheDocument();
    // Verify one of the sidebar nav items (e.g. "Settings") is present.
    expect(screen.getByText("Settings")).toBeInTheDocument();
    // The authentication modal should be visible initially since authorized is false.
    expect(screen.getByText("Authorization")).toBeInTheDocument();
  });

  it("hides authentication modal after successful login", async () => {
    setup();

    // The auth modal should be present initially.
    expect(screen.getByText("Authorization")).toBeInTheDocument();

    // Query for username and password inputs using aria-label.
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    // Simulate entering valid credentials.
    fireEvent.change(usernameInput, { target: { value: "admin" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    // Click the login button.
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    // Wait for the modal to disappear.
    await waitFor(() => {
      expect(screen.queryByText("Authorization")).not.toBeInTheDocument();
    });
  });
});
