# Reef-Challenge

## Description

This project is a product and order management system with secure authentication using JWT. It includes features like product management, order viewing, sales reports generation, and an admin dashboard with key metrics.

## Getting Started

### Steps to Run the Project:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Artem-Tsymbal/reef-challenge.git
   ```

2. **Navigate to the project’s root directory:**

   ```bash
   cd reef-challenge
   ```

3. **Run Docker Compose to build and start the containers:**

   ```bash
   docker-compose up -d --build
   ```

4. **Wait for the containers to be fully built, then navigate to [http://localhost:3000](http://localhost:3000) to access the frontend.**  
   The backend will be available at [http://localhost:5001](http://localhost:5001) for GraphQL queries.

### Stopping and Removing Containers and Database:

To stop and remove containers along with the database, run:

```bash
docker-compose down -v
```

## Features Implemented

1. **Secure Login and Registration with JWT:**

   - A secure login and registration system using Node.js and JWT.
   - Proper session management and token expiration handling.

2. **Product Management:**

   - Features for creating, editing, and deleting products.
   - Each product includes a name, description, price, and image.

3. **Order Management:**

   - Display a list of customer orders with details such as order ID, customer name, order date, and status.
   - Ability to update the status of customer orders.

4. **Form Validation and Error Handling:**

   - Implemented form validation and error handling for product and order management forms.

5. **Authentication and Authorization:**

   - Secured routes with authentication and authorization.
   - PostgreSQL database to store user, product, and order data.

6. **Unit Tests:**

   - Unit tests for critical sections of backend (yarn run test).

7. **Sales Reports:**

   - Generate sales reports showing total sales, number of orders, and average order value.
   - Date range filters for reports.

8. **Search Feature:**

   - Implemented a search feature to filter products or orders.

9. **Notifications:**

   - Send notifications when a new order is placed or when the status of an order is updated.

10. **Admin Dashboard:**

    - Admin dashboard with statistics and charts showing key metrics.

11. **GraphQL API:**
    - Implemented a GraphQL API as an alternative to the RESTful API for more efficient data querying.
