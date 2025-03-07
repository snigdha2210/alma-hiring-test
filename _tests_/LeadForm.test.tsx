// __tests__/LeadForm.test.tsx
"use client";

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LeadForm from "@/components/LeadForm";

// This tells Jest to use the manual mock in __mocks__/next/navigation.ts
jest.mock("next/navigation");

import { useRouter } from "next/navigation";
import fetchMock from "jest-fetch-mock";

// (Optional) If you haven't already, set up fetchMock in jest.setup.ts

describe("LeadForm", () => {
  const pushMock = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    fetchMock.resetMocks();
  });

  it("renders the lead form", () => {
    render(<LeadForm />);
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
  });

  it("shows validation errors when required fields are missing", async () => {
    render(<LeadForm />);
    // Click the submit button without filling any fields.
    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Wait for error messages to appear.
    await waitFor(() => {
      expect(screen.getByText("First Name is required")).toBeInTheDocument();
      expect(screen.getByText("Last Name is required")).toBeInTheDocument();
      expect(screen.getByText("Invalid Email")).toBeInTheDocument();
      expect(screen.getByText("LinkedIn is required")).toBeInTheDocument();
      expect(screen.getByText("Country is required")).toBeInTheDocument();
      expect(
        screen.getByText("Please select at least one visa"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Additional Information is required"),
      ).toBeInTheDocument();
    });
  });

  it("accepts input values", async () => {
    render(<LeadForm />);
    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const linkedinInput = screen.getByPlaceholderText(
      "Linkedin / Personal Website URL",
    );
    const additionalInfoInput = screen.getByPlaceholderText(
      "Tell us more about your immigration goals. What is your current immigration status? What is your past immigration history?",
    );

    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Doe");
    await userEvent.type(emailInput, "johndoe@example.com");
    await userEvent.type(linkedinInput, "https://linkedin.com/in/johndoe");
    await userEvent.type(additionalInfoInput, "Looking for H1B options.");

    expect(firstNameInput).toHaveValue("John");
    expect(lastNameInput).toHaveValue("Doe");
    expect(emailInput).toHaveValue("johndoe@example.com");
    expect(linkedinInput).toHaveValue("https://linkedin.com/in/johndoe");
    expect(additionalInfoInput).toHaveValue("Looking for H1B options.");
  });
});
