# NEXUS Admin Dashboard 🚀

A modern, full-stack admin dashboard featuring a secure user authentication system, dynamic data visualizations, and a responsive UI.

## 🌟 Key Features

- **Full-Stack Authentication**: Secure Registration and Login system using FastAPI and PostgreSQL.
- **JWT Security**: Token-based authentication (JSON Web Tokens) to protect dashboard routes.
- **Dynamic Dashboard**: Responsive UI with sidebar navigation, top bar, and multiple interactive sections.
- **Data Visualization**: Integrated charts using Chart.js for sales, analytics, and stock monitoring.
- **User Profiles**: Personalized experience where the dashboard updates based on the logged-in user.
- **Modern UI/UX**: Premium design with glassmorphism effects, smooth animations, and a clean beige/blue palette.

## 🛠️ Technology Stack

### Backend
- **FastAPI**: High-performance Python web framework.
- **PostgreSQL**: Robust relational database for user data storage.
- **SQLAlchemy**: Powerful Python SQL toolkit and ORM.
- **Bcrypt**: For secure password hashing.
- **Python-Jose**: For JWT creation and verification.

### Frontend
- **HTML5/CSS3**: Clean structure and modern styling with CSS variables.
- **JavaScript (ES6+)**: Dynamic interactivity and API communication.
- **Bootstrap 5**: Responsive layout and UI components.
- **Chart.js**: Interactive data visualizations.
- **Font Awesome**: Professional iconography.

## 📁 File Structure

```
admintemplate1/
├── backend/            # FastAPI Backend API
│   ├── main.py        # API endpoints and logic
│   ├── database.py    # Database connection setup
│   ├── models.py      # SQLAlchemy models
│   ├── schemas.py     # Pydantic validation models
│   └── auth_utils.py  # Auth & JWT utilities
├── landing.html       # Landing Page (Entry Point)
├── login.html         # User Login Page
├── register.html      # User Registration Page
├── index.html         # Main Dashboard (Protected)
├── style.css          # Global Styles
├── script.js          # Main Interactive Logic
└── create_db.py       # Initial Database Setup Script
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- PostgreSQL
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd admintemplate1
   ```

2. **Setup Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r backend/requirements.txt
   ```

4. **Database Configuration**
   - Ensure PostgreSQL is running.
   - Create a database named `nexus_db`.
   - Update `backend/database.py` with your credentials or use the `create_db.py` script.

5. **Run Database Initialization**
   ```bash
   python create_db.py
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   uvicorn backend.main:app --reload
   ```
   The API will be available at `http://127.0.0.1:8000`.

2. **Launch the Frontend**
   - Simply open `landing.html` in your browser or use a VS Code extension like **Live Server**.

## 🔐 Authentication Workflow

1. **Register**: New users sign up via `register.html`. Passwords are hashed before storage.
2. **Login**: Users authenticate via `login.html`. On success, a JWT is issued and stored in `localStorage`.
3. **Authorize**: `index.html` (Dashboard) checks for the token in the browser. If missing, the user is redirected to the Landing Page.
4. **Fetch Profile**: The dashboard calls the `/users/me` endpoint to display personalized user data.

## 🤝 Contributing
Feel free to fork this project and submit pull requests for any features or bug fixes.

## 📄 License
This project is open-source and available under the MIT License.
