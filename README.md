<!-- omit from toc -->
# TaskTiger 🐯
<!-- omit from toc -->

### A school project by our hard-working team, _SOLID_.

The server works through a free service provider, so it does not run permanently. After the first request, it starts building up for approximately 2:30 minutes, then after a refresh you can reach the website [here](https://tasktiger.onrender.com).

<!-- omit from toc -->
## Table of Contents

- [SOLID](#solid)
- [About the Project](#about-the-project)
- [Used Technologies](#used-technologies)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
  - [Key Features](#key-features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend setup](#frontend-setup)
  - [Database setup](#database-setup)
  - [Backend setup](#backend-setup)
- [Screenshots](#screenshots)

## SOLID

- Siyar FAROUQ ([@siyar25](https://github.com/siyar25))
- Zoltán MIHÁLYFI ([@miz092](https://github.com/miz092))
- Dénes FÜLÖP ([@fulopdenes](https://github.com/fulopdenes))

## About the Project

This was our last team project in [Codecool](https://codecool.com/)'s 10-month Full-Stack developer course. It was a 4-sprint long project.<br>
**TaskTiger** is a platform where **clients** can connect with '**Taskers**' to complete different jobs/tasks for them, creating easier access to different service providers. All this within a few comfortable clicks/taps.<br>
The project includes authentication and authorization, profile pages, booking reservations, messaging, reviewing, along with many other features.

---

**This repository is only a _cleaner_ copy of the project's original repositories!**

- You can find the original backend repository [here](https://github.com/CodecoolGlobal/el-proyecte-grande-sprint-1-java-fulopdenes).
- And the original frontend repository [here](https://github.com/miz092/TaskTigerFrontend).

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

---

## Used Technologies

### Frontend

- JavaScript
- Node.js
- React.js
- Vite

### Backend

- Java 17
- Spring Boot
- Spring Security with JSON Web Tokens
- Spring Data JPA
- Project Lombok

### Database

- PostgreSQL

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

### Key Features

1. **User Registration and Authentication**: Secure user sign-up and login functionality with authentication.

2. **Role-based Access Control**: Assign and manage user roles for fine-grained access control.

3. **Password Encryption**: Ensure user data security through password encryption techniques.

4. **Tasker Discovery**: Enable users to explore a list of available Taskers for various services.

5. **Tasker Filtering**: Empower users to filter Taskers based on specific job criteria and preferences.

6. **In-App Messaging**: Implement a chat/messaging system for seamless communication.

7. **Calendar Views**: Provide users with monthly and weekly views for efficient scheduling.

8. **Appointment Booking**: Enable users to view available timeslots and book appointments with ease.

9. **Reservation Management**: Streamline reservation handling, including confirmation, cancellation, and deletion.

10. **Reviews and Ratings**: Allow users to leave feedback and ratings for services and events.

11. **Theme Customization**: Enhance user experience with both Dark and Light theme modes for the UI.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

## Getting Started

### Prerequisites

Before you begin, ensure you have the following tools and dependencies installed:

- **[Git](https://git-scm.com/)**: The version control system to clone the repository.
- **[Node.js](https://nodejs.org/)**: Required for frontend development.
- **[npm (Node Package Manager)](https://www.npmjs.com/)**: Comes with Node.js; you'll need it for managing frontend dependencies.
- **[Maven](https://maven.apache.org/)**: The build tool for the backend.
- **[Java 17](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html)**: Ensure you have Java 17 installed on your system.
- **[PostgreSQL Database](https://www.postgresql.org/)**: Create a new PostgreSQL database called `tasktiger`.

1. Clone the repository to your local machine using **Git**:

   ```bash
   git clone git@github.com:siyar25/TaskTiger.git
   ```

2. Navigate to the project directory:
   ```bash
   cd TaskTiger
   ```

### Frontend setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install the necessary dependencies by running:

   ```bash
   npm install
   ```

3. Start up the frontend by running:

   ```bash
   npm run dev
   ```

4. Now, your frontend should be up and running. Open your web browser and access the application at the specified at http://localhost:3000.

### Database setup

1. Open the `application.properties` file located in the backend directory `(/backend/src/main/resources/application.properties)` and change these values:

   ```properties
   # Database settings
   spring.datasource.url=jdbc:postgresql://localhost:5432/${DB_DATABASE}
   spring.datasource.username=${DB_USER}
   spring.datasource.password=${DB_PASSWORD}
   ```

- Replace `${DB_DATABASE}`, `${DB_USER}`, and `${DB_PASSWORD}` with your actual database configuration:
  - `${DB_DATABASE}`: The name of you database that you created in PostgreSQL (E.g. `'tasktiger'`)
  - `${DB_USER}`: The name of your user in PostgreSQL
  - `${DB_PASSWORD}`: The password of said user

### Backend setup

Now, you can build and run the backend application. Spring Boot will launch the server, and the endpoints will become live.

1. Change your directory to the backend folder:

   ```bash
   cd backend
   ```

2. Build the backend:

   ```bash
   mvn clean install
   ```

3. Run the backend:
   ```bash
   mvn spring-boot:run
   ```

- The application will initialize the database with some initial data. Once the server is up and running, you can access the backend API endpoints
- The backend will run on the `8080` port
- By updating the application.properties file with your database credentials, you ensure secure database access without exposing sensitive information as environment variables

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

## Screenshots

1. User Registration:

<p align="center" width="100%">
    <img width="80%" src="https://i.kek.sh/pRyliUBTBmf.jpg">
</p>

2. User Authentication:

<p align="center" width="100%">
    <img width="80%" src="https://i.kek.sh/ksBginDZ08D.jpg">
</p>

3. Ability to select a timeslot and book an appointment:

<p align="center" width="100%">
    <img width="80%" src="https://i.kek.sh/C14ZZLVPzrX.jpg">
</p>

4. Display available timeslots for scheduling appointments or bookings:

<p align="center" width="100%">
    <img width="60%" src="https://i.kek.sh/BYSFR6BzRoS.jpg">
</p>

5. Reservation handling: Confirm/Cancel:

<p align="center" width="100%">
    <img width="60%" src="https://i.kek.sh/ZKltdezlwr5.jpg">
</p>

6. Real-time chat or messaging functionality:

<p align="center" width="100%">
    <img width="60%" src="https://i.kek.sh/2rPvYmop2aT.jpg">
</p>

9. Ability for users to leave reviews or ratings for events or services:

<p align="center" width="100%">
    <img width="60%" src="https://i.kek.sh/fGHEr4yNzBx.jpg">
</p>

10. Reservation handling: Follow / Delete:

<p align="center" width="100%">
    <img width="60%" src="https://i.kek.sh/FIx1DChsnYF.jpg">
</p>

11. Dark & Light Theme UI mode.

<p align="center" width="100%">
  <img width="49%" src="https://i.kek.sh/YXjqOFNjn9z.jpg">
  <img width="49%" src="https://i.kek.sh/ugNAS3ulaij.jpg">
</p>

12. The backend endpoints:
<p align="center">
    <img width="75%" src="https://i.kek.sh/W8VKLwWG6JD.jpg">
</p>
<p align="center">
<img width="75%" src="https://i.kek.sh/MxqL5kiUokT.jpg">
</p>
<p align="center">
    <img width="75%" src="https://i.kek.sh/YTnLynn9xoS.jpg">
</p>
<p align="right">(<a href="#table-of-contents">back to top</a>)</p>
