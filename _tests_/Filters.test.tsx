// __tests__/Filters.test.tsx
"use client";

import React from "react";
import { render, screen } from "@testing-library/react";
import Filters from "@/components/Filters";
import { describe, expect, it, jest } from "@jest/globals";

describe("Filters", () => {
  it("renders search input and status filter", () => {
    const setSearchTerm = jest.fn();
    const setStatusFilter = jest.fn();
    render(
      <Filters
        searchTerm=''
        setSearchTerm={setSearchTerm}
        statusFilter=''
        setStatusFilter={setStatusFilter}
      />,
    );
    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
