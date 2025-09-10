# 🚀 Auth API Project

This project provides authentication APIs built with **Node.js + Express**.  
It supports **user registration with file uploads**, **OTP verification**, **login**, and **password management**.  
For email testing, it uses **MailHog** (local email server).  

---

## 📦 1. Installation & Project Setup

1. **Clone the repository** (or download it):
   ```bash
   git clone https://github.com/lekanallade/rit-backend.git
   Move to the root of the project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment setup**: create a `.env` file in the root:
   ```env
   PORT=3000
   ```

4. **Start the server**:
   ```bash
   npm start
   ```
   Server runs at:  
   👉 `http://localhost:3000`

---

## 📧 2. Setting Up MailHog (Windows)

We use MailHog to **catch emails locally** (e.g., OTP or password reset emails).

### Option 1: Run MailHog directly (no Docker)
1. Download the MailHog Windows binary:  
   👉 [MailHog Releases](https://github.com/mailhog/MailHog/releases)  
   Get: `MailHog_windows_amd64.exe`

2. Place it somewhere, e.g.:  
   `C:\Mailhog\MailHog.exe`

3. Run it:
   ```powershell
   C:\Mailhog\MailHog.exe
   ```

4. MailHog runs on:
   - **SMTP server** → `localhost:1025`
   - **Web UI** → [http://localhost:8025](http://localhost:8025)

⚠️ In your code, configure emails to use:
- Host: `localhost`
- Port: `1025`
- No TLS, no authentication

Check all captured emails at 👉 [http://localhost:8025](http://localhost:8025)

---

## 🔑 3. Auth Routes

Base URL:  
```
http://localhost:3000/api/auth
```

### 1. **POST** `/signup`
Registers a user with **profile picture** and **ID document**.

- **Body type**: form-data  
- **Fields**:
  - `profilePicture`: file (required)  
  - `idDocument`: file (required)  
  - `name`: string  
  - `email`: string  
  - `password`: string  

**Response:**
```json
{
  "message": "User registered successfully. OTP sent to email."
}
```

---

### 2. **POST** `/verify-otp`
Verifies OTP after signup.

- **Body (raw, JSON):**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Account verified successfully."
}
```

---

### 3. **POST** `/signin`
Logs in a user.

- **Body (raw, JSON):**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response:**
```json
{
  "token": "JWT_ACCESS_TOKEN",
  "user": {
    "id": 1,
    "email": "john@example.com"
  }
}
```

---

### 4. **POST** `/forgot-password`
Sends password reset instructions.

- **Body (raw, JSON):**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset instructions sent to email."
}
```

---

### 5. **POST** `/reset-password`
Resets the user password.

- **Body (raw, JSON):**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successfully."
}
```

---

## 🧪 4. Testing with Postman

1. Open **Postman**.  
2. Create a new **Collection** → *Auth API*.  
3. Add the following requests:

### Signup (POST `/signup`)
- Method: `POST`
- URL: `http://localhost:3000/api/auth/signup`
- Body: `form-data`
  - Key: `profilePicture` (type: File, select a file)
  - Key: `idDocument` (type: File, select a file)
  - Key: `name`, `email`, `password` (type: Text)

### Verify OTP (POST `/verify-otp`)
- Method: `POST`
- URL: `http://localhost:3000/api/auth/verify-otp`
- Body: raw JSON:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Sign In (POST `/signin`)
- Method: `POST`
- URL: `http://localhost:3000/api/auth/signin`
- Body: raw JSON:
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

### Forgot Password (POST `/forgot-password`)
- Method: `POST`
- URL: `http://localhost:3000/api/auth/forgot-password`
- Body: raw JSON:
```json
{
  "email": "john@example.com"
}
```

### Reset Password (POST `/reset-password`)
- Method: `POST`
- URL: `http://localhost:3000/api/auth/reset-password`
- Body: raw JSON:
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}
```

---

## ✅ 5. Summary

- Start the project → `npm start`  
- Start MailHog → `MailHog.exe`  
- Open MailHog UI → [http://localhost:8025](http://localhost:8025)  
- Test routes using **Postman**  
- Emails sent by the app will **appear in MailHog** (no real email delivery)  

---
