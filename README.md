# Node.js Express Project Template (ESM)

## Introduction

This is a project template for building Node.js applications using Express and ECMAScript Modules (ESM). It follows a modular and scalable structure, making it easy to maintain and expand.

## Project Structure

```
.
├── app.js                                  # Main application entry point
├── package.json                            # Project metadata and dependencies
├── README.md                               # Project documentation
├── configs                                 # Configuration files (e.g., environment settings)
└── src
    ├── routes                              # Route definitions
    ├── middlewares                         # Express middleware functions
    ├── controllers                         # Controllers handling business logic
    ├── services                            # Service layer for data processing
    └── utils                               # Utility functions
```

## Folder Structure Explanation

- **app.js**: The main entry point of the application where the Express app is initialized and middleware is set up.
- **package.json**: Contains metadata about the project, including dependencies and scripts.
- **configs/**: Stores configuration files.
- **src/**: The core application logic resides here.
  - **routes/**: Defines API endpoints and routes.
    - `index.js`: Automatically loads and registers all route files dynamically. If a route file is named `user.route.js`, it will be registered as `/{prefix}/user`. The `prefix` value is set in `app.js` when calling `await initRoutes("/api", app);`.
    - `user.route.js`: Example route for user-related operations.
  - **middlewares/**: Contains custom middleware functions.
    - `auth.middleware.js`: Handles authentication and authorization.
    - `monitoring.middleware.js`: Logs and monitors requests.
    - `response.middleware.js`: Formats and standardizes API responses.
  - **controllers/**: Implements business logic for handling requests and responses.
    - `user.controller.js`: Handles user-related API logic.
  - **services/**: Contains the service layer, which abstracts business logic from controllers.
    - `user.service.js`: Provides user-related operations like data fetching and processing.
  - **utils/**: Utility functions to support the application.
    - `error.util.js`: Standardized error handling utilities.
    - `logger.util.js`: Logging functionalities for debugging and monitoring.

## Getting Started

### Prerequisites

- Node.js v18 & above (recommended to use with NVM)

- [VS Code Extension] Prettier

- [VS Code Extension] JavaScript (ES6) Code Snippets

- [VS Code Setting] Set Default Formatter to Prettier

- [VS Code Setting] Enable Format On Save

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Millennium-Radius/maips-psm.git
   cd maips-psm
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start/Stop the server:
   ```sh
   npm start
   pm2 logs psm-service
   pm2 restart psm-service
   pm2 stop psm-service
   ```
4. Seed config into redis:
   ```sh
   node src/scripts/seedZakatConfig.js
   ```

## Usage

### Running in Development Mode (with hot reload)

```sh
npm start
```

### Running in Production Mode

Using PM2:

```sh
pm install -g pm2
pm run build
pm start
pm2 start app.js
```

Using Docker:

```sh
docker build -t node-express-template .
docker run -p 3000:3000 node-express-template
```

## Features

- **Modular structure** for scalability
- **ESM support** for modern JavaScript syntax
- **Middleware-based architecture** for authentication, monitoring, and response formatting
- **Service-layer abstraction** for clean separation of concerns
- **Utility functions** for error handling and logging
- **Automatic route loading** based on filename structure

## Contributing

Feel free to submit issues and pull requests to improve this template.
