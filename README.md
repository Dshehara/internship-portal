# InternHub Sri Lanka 🎓

A full-stack internship portal connecting Sri Lankan undergraduate students 
with companies offering internship opportunities.

## 🔗 Live Demo
https://dshehara.github.io/internship-portal

---

## 📌 Features

### For Students
- Register and login securely (JWT authentication)
- Build a profile with skills, phone number, and CV link
- Browse all internship listings with search and filters
- Apply for internships with one click
- Track all application statuses in My Applications

### For Companies
- Register and login as a company
- Create and manage a company profile
- Post internship listings (title, description, location, duration, deadline)
- Edit or delete listings anytime
- View all applicants for each listing including their skills and CV link

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 4.x |
| Security | Spring Security, JWT (JSON Web Tokens) |
| Database | MySQL 8.0, Spring Data JPA, Hibernate |
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| UI Framework | Bootstrap 5.3 |
| Build Tool | Maven |

---

## 🏗 Project Architecture

Client (Browser)
│
│ HTTP Requests (JSON)
▼
Spring Boot REST API (Port 8080)
│
├── Controllers → Handle HTTP requests
├── Services → Business logic
├── Repositories → Database queries (JPA)
│
▼
MySQL Database (Port 3306)

---

## 📁 Backend Structure

src/main/java/com/internship/portal/
├── config/
│ ├── JwtUtil.java # JWT token generation & validation
│ └── SecurityConfig.java # Spring Security configuration
├── controller/
│ ├── AuthController.java # Register & Login endpoints
│ ├── StudentController.java # Student profile endpoints
│ ├── CompanyController.java # Company profile endpoints
│ ├── ListingController.java # Internship listing CRUD
│ └── ApplicationController.java # Apply & track applications
├── service/
│ ├── StudentService.java
│ ├── CompanyService.java
│ ├── ListingService.java
│ └── ApplicationService.java
├── model/
│ ├── Student.java
│ ├── Company.java
│ ├── Listing.java
│ └── Application.java
└── repository/
├── StudentRepository.java
├── CompanyRepository.java
├── ListingRepository.java
└── ApplicationRepository.java

---

## 📁 Frontend Structure

internship-frontend/
├── index.html # Landing page
├── register.html # Student & Company registration
├── login.html # Login page
├── dashboard.html # Student dashboard & profile
├── listings.html # Browse internship listings
├── my-applications.html # Student application tracker
├── company-dashboard.html # Company dashboard
├── post-listing.html # Post new internship
├── css/
│ └── style.css # Custom design system
└── js/
├── nav.js # Shared navbar & API config
├── auth.js # Register & Login logic
├── dashboard.js # Student profile logic
├── listings.js # Listings & Apply logic
├── company.js # Company dashboard logic
└── applications.js # My Applications logic

---

## ⚙️ How to Run Locally

### Prerequisites
- Java JDK 21+
- MySQL 8.0+
- A modern browser (Chrome recommended)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/internship-portal.git
cd internship-portal
```

### 2. Set up the database
Open MySQL and run:
```sql
CREATE DATABASE internship_portal;
```

### 3. Configure the backend
Open `portal/src/main/resources/application.properties` and update:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 4. Run the backend
Open the `portal` folder in IntelliJ IDEA and run `PortalApplication.java`.
The API will start at `http://localhost:8080`

### 5. Open the frontend
Open `internship-frontend/index.html` with Live Server in VS Code,
or simply double-click it in your browser.

---

## 🔐 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/student/register` | Register student |
| POST | `/api/auth/student/login` | Student login |
| POST | `/api/auth/company/register` | Register company |
| POST | `/api/auth/company/login` | Company login |

### Students
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students/me` | Get my profile |
| PUT | `/api/students/me` | Update my profile |

### Companies
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/companies/me` | Get company profile |
| PUT | `/api/companies/me` | Update company profile |
| GET | `/api/companies/my-listings` | Get my posted listings |

### Listings
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/listings` | Get all listings (public) |
| GET | `/api/listings/{id}` | Get one listing |
| POST | `/api/listings` | Post a listing (company) |
| PUT | `/api/listings/{id}` | Edit listing (company) |
| DELETE | `/api/listings/{id}` | Delete listing (company) |

### Applications
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/applications/{listingId}` | Apply for internship |
| GET | `/api/applications/my` | Get my applications |
| GET | `/api/applications/listing/{id}` | Get applicants for listing |

---

## 👩‍💻 Author

**Dilmi Rathnayake**  
Software Engineering Undergraduate  
Built as a portfolio project — 2026
