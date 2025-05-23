# Bookstore Microservices API

A modern, scalable bookstore API built with Node.js microservices architecture. Features include book management, user authentication, order processing, and real-time inventory tracking. Built with Express, MongoDB, and JWT authentication.

## Features

- **Microservices Architecture**
  - Book Service: Manage book catalog and reviews
  - User Service: Handle user authentication and profiles
  - Order Service: Process orders and payments
  - API Gateway: Route requests to appropriate services

- **Book Management**
  - CRUD operations for books
  - Advanced search and filtering
  - Book reviews and ratings
  - Stock management
  - ISBN validation

- **User Features**
  - User registration and authentication
  - JWT-based authorization
  - User profiles and preferences
  - Order history

- **Order Processing**
  - Create and manage orders
  - Payment processing
  - Order status tracking
  - Email notifications

## Tech Stack

- **Backend**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - Swagger for API documentation

- **Development Tools**
  - Nodemon for development
  - Concurrently for running multiple services
  - Environment variables with dotenv

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` files in each service directory:

```env
# Book Service (.env)
PORT=5002
MONGODB_URI=mongodb://localhost:27017/bookstore_books
JWT_SECRET=your_jwt_secret

# User Service (.env)
PORT=5001
MONGODB_URI=mongodb://localhost:27017/bookstore_users
JWT_SECRET=your_jwt_secret

# Order Service (.env)
PORT=5003
MONGODB_URI=mongodb://localhost:27017/bookstore_orders
JWT_SECRET=your_jwt_secret

# API Gateway (.env)
PORT=5000
BOOK_SERVICE_URL=http://localhost:5002
USER_SERVICE_URL=http://localhost:5001
ORDER_SERVICE_URL=http://localhost:5003
```

## Running the Application

1. Start MongoDB:
```bash
mongod
```

2. Start all services in development mode:
```bash
npm run dev
```

Or start individual services:
```bash
npm run dev:book    # Book Service
npm run dev:user    # User Service
npm run dev:order   # Order Service
npm run dev:gateway # API Gateway
```

## API Documentation

Each service includes Swagger documentation. Access them at:
- Book Service: http://localhost:5002/api-docs
- User Service: http://localhost:5001/api-docs
- Order Service: http://localhost:5003/api-docs
- API Gateway: http://localhost:5000/api-docs

## API Endpoints

### Book Service
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/books/search` - Search books
- `POST /api/books/:id/reviews` - Add review
- `GET /api/books/:id/reviews` - Get book reviews

### User Service
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Order Service
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

## Testing

Run tests for all services:
```bash
npm test
```

## Project Structure

```
server/
├── api-gateway/
│   └── server.js
├── book-service/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── swagger/
│   └── server.js
├── user-service/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── swagger/
│   └── server.js
├── order-service/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── swagger/
│   └── server.js
└── package.json
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Environment variable protection

## Performance Optimizations

- MongoDB indexing
- Response caching
- Pagination
- Efficient database queries
- Connection pooling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

Kush Varshney 