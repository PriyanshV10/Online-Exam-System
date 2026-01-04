# Frontend Documentation

## Overview
This is a modern React-based Single Page Application (SPA) built with Vite and styled with Tailwind CSS (v4). It serves as the user interface for the Online Exam System, providing distinct experiences for Administrators and Students.

## Technology Stack
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Installation & Setup

### Prerequisites
1.  Install **Node.js** (LTS version recommended).
2.  Install **npm** (usually comes with Node.js).

### Setup Steps
1.  Navigate to the `Frontend` directory:
    ```bash
    cd Frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and visit the URL shown in the terminal (usually `http://localhost:5173`).

## Project Structure

### Key Directories
- `src/components`: Contains reusable UI components.
    - `Navbar.jsx`: Navigation bar handling dynamic links based on user role.
    - `ConfirmDialog.jsx`: Custom dialog for critical actions.
    - `ExamList.jsx`: Reusable list component for displaying exams.
- `src/pages`: Represents full-page views mapped to routes.
    - **Admin Pages**:
        - `AdminDashboard.jsx`: Main hub for admins.
        - `CreateExam.jsx`, `EditExam.jsx`, `UpdateExam.jsx`: Exam management.
        - `ExamManagement.jsx`: List and manage exams.
        - `UserManagement.jsx`: Manage registered users.
    - **Student Pages**:
        - `StudentDashboard.jsx`: Main hub for students.
        - `ExamAttempt.jsx`: The actual exam-taking interface.
        - `Result.jsx`: Displays score and review of answers after submission.
    - **Auth Pages**: `Login.jsx`, `Register.jsx`.

### Configuration Files
- `vite.config.js`: Vite configuration settings.
- `tailwind.config.js` / `index.css`: Tailwind CSS configuration and imports.
- `package.json`: Project metadata and dependencies.

## Key Features

### Role-Based Access
- **Admin**: Can create, update, publish, and delete exams. Can manage users.
- **Student**: Can view published exams, attempt them, and view results.

### Exam System
- **Creation**: Admins can define exam details (title, duration) and add questions with multiple options.
- **Publishing**: Exams must be "Published" to be visible to students in the "Published Exams" tab.
- **Taking Exams**:
    - Timed attempts (auto-submit on timeout).
    - Interactive question navigation.
    - Real-time selection saving.
- **Results**: Immediate feedback with score calculation and question review showing correct vs selected answers.
