# What is it?

This project is a gamified in browser Python IDE for practicing coding exercises, with an integrated LLM assistant to help when you're stuck. You write code, run it directly in the browser, pass automated tests, earn XP and stars, and climb a leaderboard against the other players.
It's a group project built by a team of 4, with a Java backend and a TypeScript/React frontend.

![[ping_1.png]]

# The Exercises
Each exercise has a difficulty, a category, starter code and a set of hidden tests. The home page lets you search and filter exercises by difficulty and category, and shows your overall progress.

![[ping_2.png]]

# The LLM Assistant
Next to the tests and console tabs, an "Ask LLM" tab lets you chat with an AI assistant about the exercise and your current code.

![[ping_6.png]]

# Gamification
Solving an exercise for the first time awards XP and up to 3 stars, based on how many hints were used and how many attempts it took. XP feeds into levels and unlocks confetti celebrations on solve. A streak counter tracks consecutive days of activity, and a leaderboard ranks all players by total XP using standard competition ranking.
![[ping_4.png]]

# The Backend
The backend is a Java REST API built with Quarkus, structured in clean layers:

* `presentation/rest`: REST resources for users, files/folders, progress, and the LLM chat
* `domain/service`: business logic
* `data/model` + `data/repository`: persistence layer
* `converter`: maps internal models to API request/response DTOs

Authentication uses JWT: logging in returns a signed token valid one hour, refreshable while authenticated. Passwords are encrypted before storage. Some endpoints are restricted to the admin role.
![[ping_5.png]]
![[ping_7.png]]

# The Frontend
Built with React + TypeScript / Vite, React Router for navigation, and Tailwind CSS with shadcn/ui components for the interface. Key pieces:

* `pages/`: exercise list, exercice filters, editor + tests + LLM chat, Leaderboard, Login, Signup
* `hooks/usePyodide`: loads Pyodide and runs the user's code against the exercise's tests in-browser
* `context/AuthContext` and `context/GameProgressContext`: hold the authenticated user and their live progress, synced with the backend
* `api/`: typed fetch wrappers for auth, progress and LLM endpoints, attaching the JWT to authenticated requests

# Technical Stack
* Backend: Java, Quarkus, JAX-RS, JWT (SmallRye/MicroProfile), Lombok
* Frontend: React, TypeScript, Vite, React Router, Tailwind CSS, shadcn/ui, CodeMirror, Pyodide
* Auth: JWT-based, role-based access control
* Containerized with Docker / docker-compose
- Claude for the frontend