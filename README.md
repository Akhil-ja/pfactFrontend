# Clinic Calendar Application

This is a simple web application designed to manage clinic appointments, featuring a login system, a calendar view, and an appointment booking form.

## Features

*   **Login (Mock Auth):** Simple login with hardcoded credentials (`staff@clinic.com` / `123456`).
*   **Calendar View:** Displays appointments in a month view (desktop) or single-day view (mobile).
*   **Appointment Management:** Add, edit, and delete appointments.
*   **Data Persistence:** Appointment data is stored in `localStorage`.
*   **Filtering:** Filter appointments by patient or doctor.
*   **Dark Mode:** Toggle between light and dark themes.
*   **Past Booking Prevention:** Prevents booking appointments in the past.

## Tech Stack

*   **Frontend:** React.js
*   **Styling:** Tailwind CSS
*   **Calendar Library:** `react-big-calendar`
*   **Date Utilities:** `date-fns`

## How to Run

To get the application up and running on your local machine, follow these steps:

1.  **Navigate to the Frontend Directory:**
    ```bash
    cd Frontend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    ```bash
    npm run dev
    ```

    The application will typically be available at `http://localhost:5173` (or another port if 5173 is in use).

4.  **Login:**
    Use the pre-filled credentials:
    *   **Email:** `staff@clinic.com`
    *   **Password:** `123456`
