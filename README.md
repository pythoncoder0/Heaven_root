# Heaven Root

Heaven Root is a real estate web application that allows users to browse, list, and chat about properties. Built with React (Vite), Node.js, Express, Prisma, and Socket.IO.

## Features

- User authentication and profile management
- Browse and search property listings
- Add, update, and delete property posts
- Real-time chat between users (Socket.IO)
- Save/bookmark properties
- Responsive and modern UI

## Tech Stack

- **Frontend:** React, Vite, SCSS
- **Backend:** Node.js, Express, Prisma ORM
- **Database:** PostgreSQL (or your configured DB)
- **Real-time:** Socket.IO

## Getting Started

### Prerequisites

- Node.js and npm installed
- PostgreSQL or your preferred database
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/pythoncoder0/Heaven_root.git
   cd Heaven_root
   ```

2. **Install dependencies:**
   - For backend:
     ```sh
     cd api
     npm install
     ```
   - For frontend:
     ```sh
     cd ../client
     npm install
     ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` in both `api` and `client` folders and set your variables.

4. **Run the backend:**
   ```sh
   cd api
   npm run dev
   ```

5. **Run the frontend:**
   ```sh
   cd ../client
   npm run dev
   ```

6. **Start the Socket.IO server (if separate):**
   ```sh
   cd ../socket
   node app.js
   ```

## Usage

- Register or log in to your account.
- Browse or search for properties.
- Click the chat icon on a property to start a conversation with the owner.
- Add, update, or delete your own property listings.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
