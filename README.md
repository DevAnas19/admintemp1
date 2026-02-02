# NEXUS Admin Dashboard 🚀

A modern, full-stack admin dashboard featuring a secure user authentication system, dynamic data visualizations, and a responsive UI.

## 🌟 Key Features

- **Full-Stack Authentication**: Secure Registration and Login system using FastAPI and PostgreSQL.
- **JWT Security**: Token-based authentication (JSON Web Tokens) to protect dashboard routes.
- **Dynamic Dashboard**: Responsive UI with sidebar navigation, top bar, and multiple interactive sections.
- **Data Visualization**: Integrated charts using Chart.js for sales, analytics, and stock monitoring.
- **User Profiles**: Personalized experience where the dashboard updates based on the logged-in user.
- **Modern UI/UX**: Premium design with glassmorphism effects, smooth animations, and a clean beige/blue palette.

---

## � Backend Architecture

The backend is built with **FastAPI**, a modern, high-performance web framework for Python. It follows a modular structure to ensure scalability and maintainability.

### 🛠️ Technology Stack & Why?
- **FastAPI**: Chosen for its high performance, automatic documentation (Swagger/ReDoc), and Python type hints support.
- **PostgreSQL**: A robust, production-ready relational database used for persistent storage of user data.
- **SQLAlchemy (ORM)**: Acts as a bridge between Python and SQL, allowing us to interact with the database using Python objects rather than raw SQL queries.
- **JWT (JSON Web Tokens)**: Used for stateless authentication. It allows the server to verify the user's identity without storing session data on the server.
- **Passlib (Bcrypt)**: Industry-standard for secure password hashing. It ensures that even if the database is compromised, user passwords remain secure.
- **Pydantic**: Used for data validation and settings management. It ensures that incoming request data matches the expected format.

### � Backend File Structure & Roles

- **`backend/main.py`**: The central hub of the API. It:
    - Initializes the FastAPI application.
    - Configures CORS (Cross-Origin Resource Sharing) to allow the frontend to communicate with the backend.
    - Defines the primary API routes (`/token`, `/register`, `/users/me`).
- **`backend/database.py`**: Manages the connection to the PostgreSQL database.
    - Creates the SQLAlchemy engine.
    - Provides a `get_db` dependency to inject database sessions into routes.
- **`backend/models.py`**: Defines the "Source of Truth" for the database.
    - Contains the `User` class which maps directly to the `users` table in PostgreSQL.
- **`backend/schemas.py`**: Defines the data structures for API requests and responses.
    - Prevents sensitive data (like hashed passwords) from being sent back to the client by defining specific "Response" models.
- **`backend/auth_utils.py`**: A dedicated utility file for security operations.
    - Contains logic for hashing passwords, verifying them, and creating/decoding JWT tokens.

---

## 🔄 Core Workflows

### 1. User Registration Flow
1. **Frontend**: User fills out the registration form in `register.html`.
2. **API Call**: A POST request is sent to `/register`.
3. **Validation**: `schemas.UserCreate` validates the input.
4. **Processing**:
    - The backend checks if the email is already in use.
    - `auth_utils.get_password_hash` hashes the plain-text password.
5. **Storage**: The new user record is saved via SQLAlchemy.
6. **Response**: A `UserResponse` object (excluding the password) is returned.

### 2. Authentication (Login) Flow
1. **Frontend**: User enters credentials in `login.html`.
2. **API Call**: A POST request is sent to `/token`.
3. **Verification**: 
    - The backend fetches the user by email.
    - `auth_utils.verify_password` compares the provided password with the stored hash.
4. **Token Generation**: If valid, `auth_utils.create_access_token` generates a JWT.
5. **Storage**: The frontend receives the token and stores it in `localStorage`.
6. **Access**: For subsequent requests, the frontend includes the token in the `Authorization: Bearer <token>` header.

---

## � How to Use

### Prerequisites
- **Python 3.8+**
- **PostgreSQL** installed and running.
- **Node.js** (optional, for advanced tooling but not strictly required for this repo).

### Setup & Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd admintemplate1
   ```

2. **Setup Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Backend Dependencies**
   ```bash
   pip install -r backend/requirements.txt
   ```

4. **Database Configuration**
   - Create a database in PostgreSQL (e.g., `nexus_db`).
   - Update the `DATABASE_URL` in `backend/database.py` with your credentials:
     `postgresql://user:password@localhost:5432/nexus_db`

5. **Initialize Database**
   ```bash
   python create_db.py
   ```

6. **Run the Backend Server**
   ```bash
   uvicorn backend.main:app --reload
   ```

7. **Launch the Frontend**
   - Open `landing.html` in your browser.
   - Or use **Live Server** extension in VS Code.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
