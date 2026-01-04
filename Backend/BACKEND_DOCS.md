# Backend Documentation

## Overview
This is a pure Java Servlet-based web application (WAR) that serves as the backend for the Online Exam System. It provides a RESTful API for managing users, exams, questions, and attempts.

## Technology Stack
- **Language**: Java 17+ (Jakarta EE)
- **Build Tool**: Maven
- **Server**: Apache Tomcat (or any Servlet 6.0 compatible container)
- **Database**: MySQL 8.0
- **Libraries**:
    - `jakarta.servlet-api`: Servlet API
    - `mysql-connector-java`: JDBC Driver
    - `gson`: JSON serialization/deserialization
    - `jbcrypt`: Password hashing

## Installation & Setup

### Prerequisites
1.  Install **JDK 17** or higher.
2.  Install **Maven**.
3.  Install **MySQL Server**.
4.  Install **Tomcat 10** (or similar container supporting Jakarta EE 10/Servlet 6.0).

### Database Setup
1.  Create a MySQL database (e.g., `exam_db`).
2.  Update the database connection settings in functionality like `DBUtil.java` (found in `src/main/java/com/exam/util`).
3.  The application expects the following tables (ensure these exist):
    - `users` (id, name, email, password, role, status)
    - `exams` (id, title, description, duration, total_marks, status, created_by)
    - `questions` (id, exam_id, text, marks, correct_option_id)
    - `options` (id, question_id, label, text)
    - `attempts` (id, user_id, exam_id, started_at, submitted_at, score)
    - `answers` (id, attempt_id, question_id, selected_option_id)

### Build & Run
1.  Open text terminal in `Backend/`.
2.  Run `mvn clean install` to build the `.war` file.
3.  Deploy the generated WAR file (from `target/`) to your Tomcat `webapps` folder.
4.  Start Tomcat.
5.  The API will be available at `http://localhost:8080/exam-system/api/` (depending on context path).

## API Reference

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/login` | user login (returns session) |
| `POST` | `/api/register` | Register a new user |
| `POST` | `/api/logout` | Invalidate session |

### Admin - Exam Management
**Base URL**: `/api/admin/exams`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | List all exams |
| `POST` | `/` | Create a new exam |
| `GET` | `/{id}` | Get details of a specific exam |
| `PUT` | `/{id}` | Update an exam |
| `DELETE` | `/{id}` | Delete an exam |
| `POST` | `/{id}/publish` | Publish an exam (make it available to students) |

### Admin - Question Management
**Base URL**: `/api/admin/exams`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/{id}/questions` | Get all questions for an exam |
| `POST` | `/{id}/questions` | Add a new question to an exam |
| `PUT` | `/{id}/questions/{qid}` | Update a question |
| `DELETE` | `/{id}/questions/{qid}` | Delete a question |

### Student - Exam Access
**Base URL**: `/api/exams`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | List all published exams |
| `GET` | `/{id}` | Get details of an exam |
| `POST` | `/{id}/attempt` | Start an attempt for an exam |

### Attempts & Results
**Base URL**: `/api/attempts`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/{id}` | Get attempt details (questions and status) |
| `POST` | `/{id}/answer` | Submit an answer for a specific question |
| `POST` | `/{id}/submit` | Finalize and submit the exam attempt |
| `GET` | `/{id}/result` | Get the result/score of a submitted attempt |
