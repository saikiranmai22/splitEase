# SplitEase - Shared Expense Manager

SplitEase is a full-stack web application designed to simplify the process of sharing expenses with friends and groups. It allows users to track spending, split costs using various methods, and settle up debts efficiently.

##  Features

###  Group & Friend Management
- **Quick Group Creation**: Create groups and add existing friends directly.
- **Invite System**: Share unique invite links for others to join your groups.
- **Friends List**: Automatically tracks people you share groups with for easy access.

###  Expense Tracking
- **Flexible Splitting**: Split expenses equally, by exact amounts, or by percentages.
- **Soft Delete**: Remove expenses while maintaining a clean history.
- **Rupee Support**: All transactions are handled in Indian Rupees (₹).

###  Balances & Settlements
- **Smart Debt Calculation**: A "debt simplification" algorithm shows exactly who you owe with the fewest possible transactions.
- **Settle Up**: Record payments to clear debts and update balances in real-time.
- **History**: View a complete history of all settlements within a group.

##  Tech Stack

- **Frontend**: React (Vite), TypeScript, TailwindCSS, Lucide React.
- **Backend**: Spring Boot 3.4.1, Java 17, Spring Data JPA.
- **Database**: PostgreSQL.

##  Getting Started

### Prerequisites
- Java 17 or higher
- Node.js (v18+)
- PostgreSQL 14 or higher

### 1. Database Setup
1. Create a PostgreSQL database named `splitwise`.
2. Ensure you change your PostgreSQL user and password in `backend/src/main/resources/application.properties` to match your database credentials.

### 2. Run the Backend
```bash
cd backend
mvn spring-boot:run
```
The API will be available at `http://localhost:8080`.

### 3. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.
