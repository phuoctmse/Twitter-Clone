# Twitter Api

This is a Twitter api project built with Node.js, Express, TypeScript, and MongoDB.

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm

### Installation

1. Clone the repository:

```sh
git clone https://github.com/phuoctmse/twitter-api.git
cd twitter-api
```

2. Install dependencies:

```sh
npm install
```

3. Create a .env file in the root directory and add your environment variables:

```sh
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET_KEY=your_jwt_secret_key
ACCESS_TOKEN_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
PASSWORD_SECRET=your_password_secret
```

#### Running the Project

1. Start the development server:

```sh
npm run dev
```

2. The server will be running on http://localhost:3000.

### Building the Project

Build the project:
Fix code formatting with Prettier:
npm run prettier:fix

License
This project is licensed under the MIT License.
