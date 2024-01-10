
# MERN Stack E-commerce Store

MERN E-Commerce with Admin Panel, Redux Toolkit, Stripe Payment, Cloud Deployment, Email Invoice, and many features.


## Features

- Basic E-commerce Features- Product lists, Product Details, Cart, Checkout 
- Secure Card Payments / Cash payments
- Admin Panel - Add/Edit Orders. Add/Edit Products
- Sorting, Filtering, and Pagination queries using Mongoose
- Authentication with Passport JS strategies
- Order Emails, Reset Password Emails
- User Profile and user orders

## Technical Details

- React 18 with Tailwind CSS
- Redux Toolkit with Async Thunk
- React Router v6
- JSON-server for front-end testing
- MongoDB for Database
- Mongoose v7 as ODM
- REST API using Express
- Authentication using Passport JS
- API Authentication using Passport JWT
- MongoDB Atlas cloud database
- Vercel Server deployment
- Email using Nodemailer - using GMail SMTP system
- Payments using Stripe - PaymentIntent based custom flow


## Run Locally

Clone the project

```bash
  git clone https://github.com/UjwalPatel05/mern-ecommerce.git
```

Install dependencies

```bash
  npm install
```

Setup .env file
```bash
ENDPOINT_SECRET = 
JWT_SECRET_KEY = 
SESSION_KEY = 
STRIPE_SERVER_KEY = 
MONGODB_URL = 
PORT = 
EMAIL_ADDRESS = 
EMAIL_PASSWORD = 
FRONT_END_URL = 

```

Start the server

```bash
  nodemon index.js
```


## Screenshots

Dashboard
![Dashboard](https://res.cloudinary.com/djstjnl11/image/upload/v1704866041/jei5hfx6yxr6rxj0gv2u.png)

Product Details
![Product Details](https://res.cloudinary.com/djstjnl11/image/upload/v1704866042/rh8bft1s4q7na53nkafp.png)

Cart
![Cart](https://res.cloudinary.com/djstjnl11/image/upload/v1704866041/qhmuqsiwwytpax9jhhpc.png)

Checkout
![Checkout](https://res.cloudinary.com/djstjnl11/image/upload/v1704866041/wjd21kxkjtutzfrcwyos.png)

Order Success
![Order](https://res.cloudinary.com/djstjnl11/image/upload/v1704866041/uizfuinikowidxj8scgw.png)

Orders Page
![Orders](https://res.cloudinary.com/djstjnl11/image/upload/v1704866041/kcqsdp2akymlcv5zcyei.png)
## Tech Stack

**Client:** React JS, tailwindcss

**Server:** Node JS, Express JS, MongoDB

**API:** Stripe, Nodemailer


