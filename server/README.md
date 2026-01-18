Client (React Frontend)
        |
        |  HTTP Requests (Axios + JWT Token)
        v
-------------------------------------------------
|               Express Server                  |
|               server.js                       |
-------------------------------------------------
        |
        v
-------------------------------------------------
|               Routes Layer                    |
|                                               |
|  authRoutes.js     → /user/*                  |
|  customerRoute.js  → /customer/*              |
|  itemRoutes.js     → /item/*                  |
|  invoiceRoutes.js  → /invoice/*               |
-------------------------------------------------
        |
        | (Protected routes pass through auth middleware)
        v
-------------------------------------------------
|            Auth Middleware (auth.js)           |
|  ✔ Verifies JWT token                          |
|  ✔ Extracts req.userId                        |
-------------------------------------------------
        |
        v
-------------------------------------------------
|              Controllers Layer                |
|                                               |
|  authController.js                            |
|     └─ registerUser / loginUser               |
|                                               |
|  customerController.js                        |
|     └─ create / get / update / delete customer|
|                                               |
|  itemController.js                            |
|     └─ create / get / update / delete item    |
|                                               |
|  invoiceController.js                         |
|     └─ createInvoice                          |
|     └─ getInvoices                            |
-------------------------------------------------
        |
        v
-------------------------------------------------
|                 Models Layer                  |
|                                               |
|  userModel.js                                 |
|  customerModel.js                             |
|  itemModel.js                                 |
|  invoiceModel.js                              |
-------------------------------------------------
        |
        v
-------------------------------------------------
|                MongoDB Database               |
|                                               |
|  users collection                             |
|  customers collection                         |
|  items collection                             |
|  invoices collection                          |
-------------------------------------------------


invoice creation
------------------
User clicks "Create Invoice" (Frontend)
        |
        v
POST /invoice
(payload: customerId + items[])
        |
        v
auth middleware
✔ verifies token
✔ sets req.userId
        |
        v
invoiceController.createInvoice
        |
        |-- Generate invoiceNo
        |-- Calculate:
        |      subTotal = Σ(item.price × quantity)
        |      grandTotal = subTotal
        |
        |-- Create Invoice document:
        |      userId     ← req.userId
        |      customerId ← payload
        |      items[]    ← payload
        |
        v
Invoice saved in MongoDB
        |
        v
Response sent to client
✔ success: true
✔ invoice data


invoice fetching flow
------------------------
Frontend requests invoices
        |
        v
GET /invoice
        |
        v
auth middleware
✔ verifies token
✔ sets req.userId
        |
        v
Invoice.find({ userId: req.userId })
        |
        |-- populate customerId
        |-- populate userId
        |-- sort by createdAt desc
        |
        v
Invoices returned to frontend
        |
        v
Dashboard / Reports calculations
✔ totalSales
✔ todaySales
✔ last 5 invoices


jwt flow
----------
Login / Register
        |
        v
JWT issued by server
        |
        v
Stored in localStorage
        |
        v
Axios sends token in headers
        |
        v
auth middleware protects routes
