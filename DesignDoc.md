# Design Document: Alma Immigration Leads Application

## 1. Introduction

This document explains the design and architectural decisions made for the Alma Immigration Leads Application. The application is designed to support both a public-facing lead form and an internal administrative interface for managing immigration leads. The key goals are modularity, responsiveness, scalability, and ease of maintenance.

## 2. System Overview

The application consists of two primary components:

- **Public Lead Form:**  
  Prospects fill out a form that collects personal details, visa interests, and a resume/CV upload. Upon submission, they are presented with a confirmation page.
- **Internal Leads List UI:**  
  An admin interface protected by an inline authentication modal. This interface allows authorized users to view, filter, sort, and update leads (from PENDING to REACHED_OUT).

The backend is powered by Next.js API routes with a mocked in-memory store (suitable for development/demo). State management in the frontend is handled with Redux Toolkit.

## 3. Architectural Design

### 3.1 Project Structure

- **app/**

  - `page.tsx`: Public lead form page.
  - `confirmation.tsx`: Confirmation page after form submission.
  - `admin/`: Contains pages for the internal admin interface.
  - `api/`: Contains API routes for leads and authentication.
  - `styles/`: Contains global and component-specific CSS modules.

- **components/**

  - `LeadForm.tsx`: The public lead form component.
  - `Sidebar.tsx`: Sidebar for the admin interface.
  - `Filters.tsx`: Component for filtering/searching leads.
  - `LeadTable.tsx`: Table component that displays lead data.

- **redux/**

  - `store.ts`: Configures the Redux store using Redux Toolkit.
  - `slices/leadSlice.ts`: Manages lead state (adding, updating).

- \***\*tests**/\*\*  
  Contains unit and integration tests written with Jest and React Testing Library.

- **public/**  
  Contains static assets (logos, icons) and the uploads folder for resumes.

- **screenshots/**  
  Contains screenshots of key application screens (Lead Form, Confirmation, Admin Dashboard).

### 3.2 Data Flow

1. **Public Form Submission:**  
   The form data is collected and validated on the client side using React Hook Form. Files are handled using the `formidable` package in a Next.js API route. The API route creates a new lead (with file handling and validation) and stores it in an in-memory array. The Redux store is then updated via a fetch call on the admin side.

2. **Internal Admin UI:**  
   The admin UI fetches lead data from the API route and stores it in a centralized Redux store. It allows authorized users to filter, sort, and update lead statuses. State updates are propagated through Redux actions, ensuring consistent state management across components.

3. **Authentication:**  
   The admin interface is protected by an inline modal that appears on top of the admin UI. This is a lightweight mock authentication mechanism intended for demo purposes.

## 4. Technology Stack

- **Next.js:**  
  For server-side rendering, API routes, and routing. The App Router provides a modern file-based routing system.
- **React:**  
  The primary library for building user interfaces.
- **TypeScript:**  
  For static type checking and improved developer experience.
- **Redux Toolkit & React-Redux:**  
  Centralized state management and predictable state updates.
- **React Hook Form:**  
  For managing form state and validation.
- **Formidable:**  
  For handling file uploads (multipart/form-data) in API routes.
- **CSS Modules:**  
  For scoped, modular styling of components.
- **Jest & React Testing Library:**  
  For unit and integration testing.
- **jest-fetch-mock:**  
  For mocking fetch calls in tests.
- **Additional Libraries:**  
  React Icons for iconography and optional libraries for country selection.

## 5. Design Choices

### 5.1 Modularity and Component-Based Architecture

- **Reusability:**  
  Each component (LeadForm, Sidebar, Filters, LeadTable) is designed to be self-contained. This promotes code reusability and simplifies maintenance.

- **Separation of Concerns:**  
  The project is divided into clear sections (public pages, admin pages, API routes, state management, and tests), making it easier for developers to understand and work on different parts of the application.

### 5.2 State Management with Redux Toolkit

- **Centralized State:**  
  The Redux store holds lead data, making it easy to manage state across multiple components (e.g., LeadTable, Filters).

- **Predictable Updates:**  
  Redux Toolkit provides concise and predictable actions and reducers, ensuring that state transitions (like changing a lead’s status) are managed consistently.

### 5.3 API Routes with Next.js

- **Mocked In-Memory Store:**  
  For development and demo purposes, leads are stored in memory via API routes. This simplifies the setup and demonstrates functionality without needing a database.

- **File Uploads:**  
  The file upload functionality is implemented using Formidable. The API route ensures that resumes are stored in a local `public/uploads` directory, and the file is moved or copied as necessary.

### 5.4 Responsiveness

- **Adaptive Layout:**  
  Both the public and admin interfaces are designed to be responsive. For example, the admin sidebar collapses on small screens and can be toggled via a hamburger menu.

- **Scrollable Tables:**  
  The admin leads table is wrapped in a container that allows horizontal scrolling on smaller screens, ensuring that all content remains accessible.

### 5.5 Testing and Quality Assurance

- **Unit and Integration Tests:**  
  Key components are thoroughly tested using Jest and React Testing Library. This ensures that the application’s core functionalities (form validation, submission, filtering, sorting, and authentication) work as expected.

- **Mocking:**  
  External dependencies such as `fetch` and `next/navigation` are mocked to isolate component behavior during tests.
