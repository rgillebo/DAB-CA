# Animal Adoption Platform

Animal Adoption is a web application that allows users to adopt animals listed in a database. 

## TECHNOLOGIES USED

- **Node.js:** JavaScript runtime used for server-side development. This app uses version "v20.10.0". 
- **Express:** Web framework for building the server and handling routes.
- **Express-sessions:** Middleware for Express applications to enable session support. 
- **Passport.js:** Authentication middleware for user login.
- **EJS:** Embedded JavaScript templates for rendering views.
- **Connect-Flash:** Middleware for displaying flash messages.
- **MySQL2:** MySQL client for Node.js. 
- **Sequelize:** ORM used for database interactions.
- **dotenv:** For managing environment variables. 
- **Morgan:** Middleware for logging HTTP requests for Node.js. 
- **Other dependencies** listed in the [package.json] file.

## INSTALLATION

### Prerequisites

- Node.js: [Download and install Node.js](https://nodejs.org/)

### Steps

1. **Download the project:**

- Navigate to the repository [https://github.com/noroff-backend-1/aug23ft-dab-ca-1-rgillebo](https://github.com/noroff-backend-1/aug23ft-dab-ca-1-rgillebo)
- Click on the "Code" button.
- In the dropdown, select "Download ZIP".
- Extract the downloaded ZIP file to your preferred directory.  

2. **Install Dependencies**

- Open a terminal or command prompt.
- Navigate to the project directory: 

    ```bash 
    cd path/to/aug23ft-dab-ca-1-rgillebo 
    ```

- Run the following command to install dependencies: 

    ```bash
    npm install
    ```
- Create environment variables by creating a ".env" file in the root of the project and add the following data: 

    ```bash
    # Server Configuration
    PORT=3000

    # Database Configuration
    DB_HOST=localhost
    DB_NAME=adoptiondb
    DB_USER=dabcaowner
    DB_PASS=dabca1234

    # Session Secret
    SESSION_SECRET=mytestingsecret

    # Node Environment
    NODE_ENV=development
    ```

 - Create a database for the project - please refer to [DATABASE](#database). 

 - Setting up the access to the database is done automatically, if a manual setup is required please refer to [DATABASEACCESS](#databaseaccess)


---

## USAGE

### Starting the application

1. If already navigated to project directory, skip to step 2. If not, in a terminal or command prompt run: 

    ```bash 
    cd path/to/aug23ft-dab-ca-1-rgillebo  
    ```

2. In a terminal or command prompt, run the following command to start the server: 

    ```bash
    npm start
    ```

3. **Follow instructions below:**

- **Home Page:** Visit [http://localhost:3000](http://localhost:3000) for the welcome page. Clicking the "Populate Database" button will populate the Animals page with data from the database. 
- **Animals:** Main area for users to view details about animals. Users must login to be able to access the adopt animal function.  
- **Login/Logout:** Use "Sign in" and "Logout" links in the navigation bar. 

4. **Admin only functionalities:**

- **Species:** Updating or deleting existing species. Species with relations cannot be deleted. Adding new species. 
- **Temperament:** Updating or deleting existing temperaments. Temperaments with relations cannot be deleted. Adding new temperaments. 
- **Animals:** Cancelling adoptions and using the "Number of Animals Per Size" button. 

---
## DATABASE

**To create the database for the web application run the following SQL script:** 

    
    CREATE DATABASE IF NOT EXISTS adoptiondb; 

---

## DATABASEACCESS

**In this web application the configuration is done in the /config/config.js using sequelize and depending on the .env file. If a manual setup of the database access is required, the following SQL script can be used:** 

    CREATE USER 'dabcaowner'@'localhost' IDENTIFIED BY 'dabca1234';
    GRANT ALL PRIVILEGES ON adoptiondb.* TO 'dabcaowner'@'localhost';
    FLUSH PRIVILEGES;
---

## STYLING

- Custom styling for an enhanced user interface.

---

## ADDITIONAL INFORMATION

- `/routes`: Server-side code for routes & authentication.
- `/public`: Contains static assets.
- `/public/js/common.js`: Client-side code for functionality. 
- `/views`: EJS templates for rendering pages.
- `/seeders`: Server-side code for fetching and populating data from database. 

---

## CONTRIBUTORS

- [Ruben Gillebo Kjær]

---