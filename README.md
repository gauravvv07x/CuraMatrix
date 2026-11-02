# CuraMatrix

## Medical Store Management System

CuraMatrix is a web-based medical store management system. It provides a
centralized interface for managing medicine records, inventory, billing,
sales information, expiry alerts, low-stock alerts, reports, shop
settings, and users.

> **Documentation scope:** This README is based on the folder structure
> and implementation details shared by the project team. Exact API
> paths, database fields, validation rules, and permissions should be
> confirmed from the source code before treating them as implementation
> facts.

## Table of Contents

1.  Project Overview
2.  Objectives
3.  Main Features
4.  Technology Stack
5.  Architecture
6.  Complete Project Structure
7.  Frontend Explanation
8.  Dashboard Modules
9.  Backend Explanation
10. Database Models
11. Authentication and Security
12. Application Workflows
13. User Roles
14. Installation
15. Environment Variables
16. Running the Project
17. Deployment
18. Git and GitHub
19. Benefits
20. Future Enhancements
21. Troubleshooting
22. Important Notes

------------------------------------------------------------------------

## 1. Project Overview

CuraMatrix is designed to support common medical store operations
through a web application. It separates the browser-facing frontend from
the server-side backend.

-   **Frontend:** HTML, CSS, and JavaScript pages that users interact
    with.
-   **Backend:** Node.js and Express.js application that processes
    requests and applies server-side logic.
-   **Database:** MongoDB stores application records.
-   **Email service:** Brevo API sends password-reset OTP emails.
-   **Hosting:** The backend is deployed on Render.

## 2. Objectives

-   Maintain medicine information in one application.
-   Add, view, update, and delete medicine records.
-   Review inventory information.
-   Identify medicines with low stock.
-   Track medicines approaching or past expiry.
-   Prepare customer bills.
-   Review previous billing and sales information.
-   Generate reports from available application data.
-   Manage users and roles.
-   Authenticate users and support password recovery.

## 3. Main Features

  -----------------------------------------------------------------------
  Feature                             Function
  ----------------------------------- -----------------------------------
  Login / Logout                      Provides authenticated access and
                                      allows users to end their session.

  User Management                     Supports administration of system
                                      users and their roles.

  Medicine Management                 Supports medicine record
                                      management.

  Inventory Management                Provides access to stock
                                      information.

  Billing                             Provides a workflow for preparing
                                      customer bills.

  Previous Bills                      Provides access to saved billing
                                      records.

  Sales                               Displays sales-related information.

  Low Stock Alerts                    Highlights medicines with low
                                      available stock.

  Expiry Tracking                     Helps identify medicines
                                      approaching or past expiry.

  Reports                             Presents sales, medicine, and
                                      inventory information.

  Shop Settings                       Provides shop-related
                                      configuration.

  Password Recovery                   Supports OTP-based password reset
                                      through email.
  -----------------------------------------------------------------------

## 4. Technology Stack

  Technology          Purpose
  ------------------- -------------------------------------------------------
  HTML5               Frontend page structure.
  CSS3                Layout, styling, colours, and typography.
  JavaScript          Frontend interactions and backend application logic.
  Node.js             JavaScript runtime for the backend.
  Express.js          Backend server and API routing framework.
  MongoDB             Document database for application data.
  Mongoose            Object modelling and MongoDB interaction.
  bcrypt / bcryptjs   Password hashing and password-hash comparison.
  JWT                 Token-based authentication.
  Brevo API           Transactional email delivery for password-reset OTPs.
  npm                 Node.js package and dependency management.
  Git                 Source-code version control.
  GitHub              Remote source-code repository.
  Render              Backend hosting platform.

## 5. Architecture

CuraMatrix follows a client-server architecture.

``` text
+----------------------------------------------------+
| USERS: Administrator / Pharmacist / Staff          |
+--------------------------+-------------------------+
                           |
                           v
+----------------------------------------------------+
| FRONTEND: HTML + CSS + JavaScript                  |
| Login | Dashboard | Medicines | Billing | Reports  |
| Sales | Alerts | Users | Shop Settings             |
+--------------------------+-------------------------+
                           |
                    HTTP API Requests
                           |
                           v
+----------------------------------------------------+
| BACKEND: Node.js + Express.js                      |
| Authentication | Medicine | Bill | User Routes    |
+--------------------------+-------------------------+
                           |
                           v
+----------------------------------------------------+
| MONGOOSE MODELS: User | Medicine | Bill            |
+--------------------------+-------------------------+
                           |
                           v
+----------------------------------------------------+
| MONGODB DATABASE                                   |
+----------------------------------------------------+
```

**Request flow:** A user interacts with the frontend; JavaScript sends a
request to an Express route; the backend processes it and uses a
Mongoose model to access MongoDB; the backend returns a response that
the frontend displays.

## 6. Complete Project Structure

The structure below reflects the folders and files visible in the
screenshots supplied by the project team. Some module folders may
contain additional files not visible in those screenshots.

``` text
CuraMatrix/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Bill.js
│   │   ├── Medicine.js
│   │   └── User.js
│   ├── node_modules/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bill.js
│   │   ├── medicine.js
│   │   └── users.js
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   ├── seedAdmin.js
│   └── server.js
├── frontend/
│   ├── favicon.png
│   ├── index.html
│   └── login/
│       ├── assets/
│       ├── dashboard/
│       │   ├── add-medicine/
│       │   ├── billing/
│       │   ├── expiry-alert/
│       │   ├── low-stock/
│       │   ├── medicines/
│       │   ├── reports/
│       │   ├── sales/
│       │   ├── shop-settings/
│       │   ├── users/
│       │   ├── dashboard.html
│       │   ├── dashboard.css
│       │   ├── dashboard.js
│       │   ├── logo3.png
│       │   ├── role-access.js
│       │   └── sidebar.css
│       ├── login.html
│       ├── login.css
│       └── login.js
└── .gitignore
```

### Root files

  -----------------------------------------------------------------------
  Path                                Function
  ----------------------------------- -----------------------------------
  `CuraMatrix/`                       Root folder containing the complete
                                      project.

  `.gitignore`                        Lists local, generated, or
                                      sensitive files Git should not
                                      track.

  `frontend/`                         Contains browser-side pages and
                                      assets.

  `backend/`                          Contains server code, routes,
                                      models, configuration, and
                                      dependencies.
  -----------------------------------------------------------------------

## 7. Frontend Explanation

The frontend provides the pages and controls through which users work
with CuraMatrix.

  -----------------------------------------------------------------------
  File / Folder                       Function
  ----------------------------------- -----------------------------------
  `frontend/index.html`               Initial webpage; sets the page
                                      title and favicon and redirects to
                                      the login page.

  `frontend/favicon.png`              CuraMatrix browser-tab and shortcut
                                      icon.

  `login/`                            Contains login files and the
                                      dashboard application.

  `login/assets/`                     Stores images and other login-page
                                      resources.

  `login/login.html`                  Defines the login page structure
                                      and form.

  `login/login.css`                   Styles the login page.

  `login/login.js`                    Handles login-page interactions and
                                      backend communication.
  -----------------------------------------------------------------------

### Login module

The login interface accepts the user's login details and sends them to
the backend for verification. It also provides the password-recovery
interaction. Credential verification and token generation are backend
responsibilities.

## 8. Dashboard Modules

The dashboard is the central interface available after successful login.

### Dashboard core files

  -----------------------------------------------------------------------
  File                                Function
  ----------------------------------- -----------------------------------
  `dashboard.html`                    Defines the main dashboard page
                                      structure.

  `dashboard.css`                     Controls dashboard layout and
                                      visual appearance.

  `dashboard.js`                      Handles dashboard interactions and
                                      data display.

  `sidebar.css`                       Styles the common navigation
                                      sidebar.

  `role-access.js`                    Controls frontend feature
                                      visibility according to user roles.

  `logo3.png`                         CuraMatrix logo displayed in the
                                      dashboard.
  -----------------------------------------------------------------------

### Feature modules

  -----------------------------------------------------------------------
  Folder                              Function
  ----------------------------------- -----------------------------------
  `add-medicine/`                     Provides the form and interface for
                                      adding medicine records.

  `medicines/`                        Provides access to existing
                                      medicine records and their
                                      management.

  `billing/`                          Provides the interface for
                                      selecting medicines and preparing
                                      customer bills.

  `sales/`                            Displays sales-related records and
                                      information.

  `low-stock/`                        Displays medicines identified as
                                      having low available stock.

  `expiry-alert/`                     Displays medicines approaching or
                                      past their expiry dates.

  `reports/`                          Presents reports related to sales,
                                      medicines, and inventory.

  `shop-settings/`                    Provides an interface for
                                      shop-related settings and
                                      information.

  `users/`                            Provides the interface for managing
                                      users and their roles.
  -----------------------------------------------------------------------

### Module details

**Add Medicine** - Accepts medicine information through a form. - Sends
the submitted information to the backend. - Displays the result of the
save operation.

**Medicines** - Displays existing medicine records. - Provides access to
medicine details. - Supports record management operations where
implemented.

**Billing** - Allows medicines to be selected for a customer purchase. -
Accepts purchase quantities. - Calculates bill totals. - Sends billing
information to the backend.

**Sales** - Displays sales-related information for review.

**Low Stock** - Identifies and displays medicine records with low
available stock. - Helps users identify items that may need
replenishment. - The exact threshold depends on the application's code.

**Expiry Alert** - Displays medicines approaching expiry or already
expired. - Helps users review expiry-related inventory information. -
The alert period depends on the application's code.

**Reports** - Presents available sales, medicine, and inventory
information. - Exact report types and export options depend on the
implementation.

**Shop Settings** - Provides access to shop-related information and
configuration. - Exact settings must be confirmed from its source code.

**Users** - Displays system users. - Provides user-management operations
and role-related controls where implemented.

## 9. Backend Explanation

The backend receives frontend requests, performs server-side processing,
and communicates with MongoDB.

### `server.js`

Main backend entry point. It initializes Express, configures middleware,
connects the database configuration, registers API routes, and starts
the server.

### `config/db.js`

Establishes the connection between the backend and MongoDB using the
configured database connection string.

### `routes/`

  -----------------------------------------------------------------------
  File                                Function
  ----------------------------------- -----------------------------------
  `auth.js`                           Handles login, authentication,
                                      forgot password, OTP verification,
                                      and password reset.

  `medicine.js`                       Handles medicine-related API
                                      operations.

  `bill.js`                           Handles bill creation and
                                      billing-record operations.

  `users.js`                          Handles user-management API
                                      operations.
  -----------------------------------------------------------------------

#### Authentication route: `auth.js`

The shared implementation includes: - Login using username, password,
and role. - Password-hash comparison using bcrypt. - JWT generation
after successful login. - Forgot-password request using username and
email. - Checking whether the matched account is active. - Generating a
six-digit OTP. - OTP expiry handling and incorrect-attempt limits. -
Sending OTP email through the Brevo HTTPS API. - OTP verification. -
Issuing a temporary password-reset token. - Validating the reset
token. - Hashing and updating the new password.

#### Medicine route: `medicine.js`

Handles medicine-related requests, including medicine record operations
such as adding, retrieving, updating, or deleting records where
implemented.

#### Bill route: `bill.js`

Handles billing-related requests, including bill creation and management
of billing records.

#### Users route: `users.js`

Handles user-related requests and user record management.

### `models/`

  -----------------------------------------------------------------------
  File                                Function
  ----------------------------------- -----------------------------------
  `User.js`                           Defines the Mongoose data structure
                                      for user records.

  `Medicine.js`                       Defines the Mongoose data structure
                                      for medicine records.

  `Bill.js`                           Defines the Mongoose data structure
                                      for billing records.
  -----------------------------------------------------------------------

The exact schema fields, data types, indexes, validation rules, and
relationships must be read from the model files; they are not assumed
here.

### Other backend files

  -----------------------------------------------------------------------
  File / Folder                       Function
  ----------------------------------- -----------------------------------
  `seedAdmin.js`                      Initializes or creates the
                                      administrator account, according to
                                      its script logic.

  `package.json`                      Stores project metadata,
                                      dependencies, and npm scripts.

  `package-lock.json`                 Records resolved dependency
                                      versions for repeatable
                                      installation.

  `node_modules/`                     Contains packages installed by npm.
                                      It is generated and normally
                                      excluded from Git.

  `.env`                              Stores private configuration values
                                      and secrets.
  -----------------------------------------------------------------------

## 10. Database Models

CuraMatrix uses MongoDB with Mongoose models.

  Model      Purpose
  ---------- -----------------------------------------------
  User       Represents application user and account data.
  Medicine   Represents medicine and inventory data.
  Bill       Represents billing records.

**General database flow:** 1. The frontend sends a request. 2. The
matching backend route receives it. 3. The route validates and processes
the request. 4. The route uses a Mongoose model. 5. Mongoose
communicates with MongoDB. 6. The backend returns the result to the
frontend.

Exact collection names and schema properties should be confirmed from
`User.js`, `Medicine.js`, and `Bill.js`.

## 11. Authentication and Security

### Login

The backend checks the supplied credentials and role. Password
verification uses bcrypt/bcryptjs. Successful authentication can issue a
JWT.

### Password hashing

Passwords are hashed before storage; password verification compares the
supplied password with the stored hash.

### JWT

A JSON Web Token supports authenticated access to protected application
resources according to the implemented frontend and backend logic.

### Forgot password and OTP flow

``` text
User submits registered username and email
                  |
                  v
Backend checks matching account and status
                  |
                  v
Backend generates a six-digit OTP
                  |
                  v
Brevo sends OTP to the registered email
                  |
                  v
User submits OTP
                  |
                  v
Backend validates OTP and expiry
                  |
                  v
Backend issues temporary reset token
                  |
                  v
User submits a new password
                  |
                  v
Backend validates token and saves password hash
```

### Security practices

-   Keep `.env` private.
-   Never commit database credentials, API keys, or JWT secrets.
-   Use HTTPS for deployed traffic.
-   Validate important inputs on the backend.
-   Protect sensitive routes with authentication and authorization.
-   Do not rely only on frontend role visibility to secure backend
    operations.

**Implementation note:** The shared OTP implementation stores reset OTP
data in process memory. Pending OTP data can therefore be lost if the
server restarts or redeploys; a user may need to request a new OTP.

## 12. Application Workflows

### Login workflow

``` text
Open website -> Login page -> Enter credentials
-> Frontend sends request -> Backend validates
-> Success: open dashboard / Failure: show error
```

### Add medicine workflow

``` text
Open Add Medicine -> Enter medicine details -> Submit
-> Frontend API request -> Medicine route
-> Medicine model -> MongoDB -> Response to frontend
```

### Billing workflow

``` text
Open Billing -> Select medicines and quantities
-> Calculate total -> Submit bill -> Bill route
-> Save billing record -> Display result
```

The exact stock deduction, payment processing, invoice generation, and
transaction rules must be confirmed from the billing source code.

## 13. User Roles

The project's use-case design identifies the following roles:

  -----------------------------------------------------------------------
  Role                                General responsibility
  ----------------------------------- -----------------------------------
  Administrator                       Oversees the system and manages
                                      users and application operations.

  Pharmacist                          Performs medicine, inventory, and
                                      billing activities allowed by
                                      assigned permissions.

  Staff                               Performs the activities allowed by
                                      the assigned role.
  -----------------------------------------------------------------------

Exact permissions must be confirmed from `role-access.js` and backend
authorization checks.

## 14. Installation

### Prerequisites

-   Node.js and npm.
-   MongoDB Atlas account or an accessible MongoDB instance.
-   Git.
-   Visual Studio Code or another code editor.
-   A modern web browser.

### Step 1: Clone the repository

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

### Step 2: Open the project

``` bash
cd CuraMatrix
```

### Step 3: Open the backend

``` bash
cd backend
```

### Step 4: Install dependencies

``` bash
npm install
```

### Step 5: Create the environment file

Create `backend/.env` and add the required environment variables. See
the next section.

### Step 6: Start the backend

Use a script defined in `backend/package.json`. For example, if a
`start` script exists:

``` bash
npm start
```

If a development script exists:

``` bash
npm run dev
```

Check `package.json` for the actual script names.

### Step 7: Open the frontend

Open `frontend/index.html` through the project's configured frontend
hosting or local development setup. Ensure the frontend API base URL
points to the correct backend service.

## 15. Environment Variables

Example variable names:

``` env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email
```

Replace the example values with private values from your own services.
Never put real secrets in this README, frontend code, screenshots, or
GitHub.

## 16. Running the Project

1.  Ensure MongoDB is reachable.
2.  Ensure the backend `.env` values are configured.
3.  Install backend dependencies using `npm install`.
4.  Start the backend using the script in `package.json`.
5.  Open the frontend through its configured local or hosted URL.
6.  Test login and the required modules.
7.  Check the browser console and backend logs if a request fails.

## 17. Deployment

### Backend on Render

The backend deployment URL shared for this project is:

**https://curamatrix-backend.onrender.com**

General deployment process: 1. Push the latest code to GitHub. 2.
Connect the repository to the Render web service. 3. Set the backend
root directory according to the repository layout. 4. Configure the
build and start commands from `package.json`. 5. Add required
environment variables in Render. 6. Deploy the service. 7. Review
deployment logs. 8. Test API requests and frontend integration.

### MongoDB Atlas

MongoDB Atlas hosts the database. The backend reads its connection
string from `MONGO_URI`.

### Brevo

Brevo sends password-reset OTP emails using its transactional email API.
Configure a valid API key and verified sender email in the backend
environment. Keep the API key private.

## 18. Git and GitHub

Git tracks changes; GitHub hosts the remote repository.

Common commands:

``` bash
git status
git add .
git commit -m "Describe your changes"
git push origin master
```

To retrieve remote changes:

``` bash
git pull origin master
```

Do not commit `.env`, `node_modules/`, or unnecessary local
operating-system files such as `desktop.ini`. Check `.gitignore` before
pushing.

## 19. Module-wise Functionality Summary

  -----------------------------------------------------------------------
  Module                              One-line functionality
  ----------------------------------- -----------------------------------
  Login / Logout                      Authenticates users and manages
                                      application access.

  Manage Users                        Allows authorized users to manage
                                      system accounts.

  Add Medicine                        Adds new medicine records.

  Manage Medicines                    Displays and manages existing
                                      medicine records.

  Manage Stock                        Provides access to medicine
                                      inventory information.

  Create Bill                         Prepares customer bills for
                                      selected medicines.

  View Previous Bills                 Displays previously stored billing
                                      records.

  View Sales                          Displays sales-related information.

  Low Stock Alerts                    Identifies medicines with low
                                      available stock.

  Expiry Tracking                     Identifies medicines approaching or
                                      past expiry.

  Generate Reports                    Presents reports based on available
                                      store data.

  Shop Settings                       Manages shop-related information
                                      and settings.

  Role Access                         Controls frontend feature
                                      visibility according to user roles.

  Password Recovery                   Verifies an email OTP and supports
                                      password reset.
  -----------------------------------------------------------------------

## 20. Benefits

-   Centralizes common medical store operations.
-   Organizes medicine records.
-   Makes stock information easier to review.
-   Helps identify low-stock medicines.
-   Helps monitor medicine expiry dates.
-   Provides a billing interface.
-   Maintains access to billing and sales information.
-   Provides user and role management.
-   Uses commonly adopted web technologies.
-   Supports a hosted backend service.

## 21. Future Enhancements

These are possible improvements, not claims about existing features: -
Automated database backups. - Detailed audit logs. - Advanced sales
analytics. - Invoice PDF generation and printing. - Configurable stock
thresholds. - Configurable expiry-alert periods. - Server-side rate
limiting for login and OTP routes. - Persistent storage for
password-reset OTPs. - Automated frontend and backend tests. - User
activity history. - Improved uptime monitoring. - Barcode scanning
support.

## 22. Troubleshooting

  -----------------------------------------------------------------------
  Problem                             What to check
  ----------------------------------- -----------------------------------
  Backend does not start              Node.js installation, dependencies,
                                      npm scripts, and server logs.

  MongoDB connection fails            `MONGO_URI`, database credentials,
                                      Atlas network access, and
                                      connection settings.

  Login fails                         Username, password, role, account
                                      status, API URL, and backend logs.

  OTP email is not sent               Brevo API key, sender email, sender
                                      verification, and Brevo API
                                      response.

  API request fails                   Backend URL, route path, HTTP
                                      method, request body, and browser
                                      console.

  Frontend does not load              HTML path, relative asset paths,
                                      hosting configuration, and browser
                                      console.

  Online changes are not visible      Git status, commit, push,
                                      deployment status, and browser
                                      cache.

  Protected page is inaccessible      Token presence and validity, role
                                      permissions, and backend
                                      authorization.
  -----------------------------------------------------------------------

## 23. Important Notes

1.  This README is based on the project structure and details shared by
    the team.
2.  Exact database fields must be confirmed from the model files.
3.  Exact API paths and HTTP methods must be confirmed from the route
    files.
4.  Exact role permissions must be confirmed in frontend and backend
    code.
5.  Actual npm scripts must be checked in `backend/package.json`.
6.  Confirm whether and how the frontend is hosted separately from the
    backend.
7.  Never publish `.env`, MongoDB credentials, JWT secrets, or Brevo API
    keys.
8.  Update this README whenever project functionality or deployment
    configuration changes.

------------------------------------------------------------------------

## Project Summary

CuraMatrix is a web-based medical store management system developed
using HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB. It
provides modules for authentication, user management, medicine
management, inventory monitoring, billing, sales, expiry alerts,
low-stock alerts, reports, and shop settings. Its frontend and backend
are organized separately to support structured development, maintenance,
and deployment.
