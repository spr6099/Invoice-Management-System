
           #####  This project frontend structure   #####
frontend/
│
├── public/
│
├── src/
│   │
│   ├── api/                       # API layer (Axios-based service calls,used axiosInstance)
│   │   ├── authApi.js             # Handles user authentication (login/register)
│   │   ├── customerApi.js         # CRUD operations for customers
│   │   ├── itemApi.js             # CRUD operations for inventory items
│   │   └── invoiceApi.js          # Invoice creation and retrieval APIs
│   │
│   ├── assets/                    
│   │
│   ├── components/                # Reusable UI components
│   │   ├── common/
│   │   │   ├── Loader.jsx         # Global loading indicator
│   │   │   └── ProtectedRoute.jsx # Route guard for authenticated access 
│   │   │      
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.jsx         # Top navigation bar
│   │   │   ├── Sidebar.jsx        # Sidebar navigation menu
│   │   │   └── Layout.jsx         # Main page layout wrapper
│   │   │
│   │   └── invoice/
│   │       ├── Invoice.jsx  # Individual invoice item row
│   │       └── InvoiceList.jsx  # Invoice totals and summary section
│   │
│   ├── context/                   # Global state management (Context API)
│   │   ├── AuthContext.jsx        # Authentication state (user, token)
│   │   └── DataContext.jsx        # Shared data (customers, items, invoices)
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.js             # Auth-related helper hook
│   │   └── useData.js             # Data access and refresh hook
│   │
│   ├── pages/                     # Route-level application pages
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.jsx          
│   │   │   └── Register.jsx       
│   │   │
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx      # Dashboard with analytics & summaries
│   │   │
│   │   ├── customers/
│   │   │   └──  Customers.jsx      #  managecustomers
│   │   │
│   │   ├── items/
│   │   │   └──  Items.jsx          # manage items
│   │   │
│   │   ├── invoices/
│   │   │   ├── Invoice.jsx    # Create &List invoices
│   │   │   └──  InvoiceList.jsx   # View invoice details & PDF
│   │   │
│   │   └── reports/
│   │       └── Reports.jsx     # Customer-wise & Date-wise sales report
│   │
│   │
│   ├── utils/                     # Shared utility functions
│   │   ├── axiosInstance.js       # Centralized Axios configuration
│   │   └── customerValidation.js  # Validation datas
│   │
│   ├── App.jsx                    # Root application component
│   ├── main.jsx                   # Application bootstrap file
│   └── index.css                  # Global styles
│
├── .env                           # Environment variables
├── package.json                   # Project dependencies and scripts
└── README.md                      # Project documentation


                 Invoice creation logic
                --------------------
User opens Create Invoice page
          ▼
Fetch customers & items from backend
          ▼
User selects a customer
          ▼
User selects items from item list
          ▼
Default quantity set to 1 for each item
          ▼
User updates item quantities (if needed)
          ▼
Item total = price × quantity
          ▼
Invoice subtotal = sum of all item totals
          ▼
User clicks "Create Invoice"
          ▼
Validate:
  ├─ Customer selected
  └─ At least one item added
          ▼
Send invoice payload to backend API
          ▼
Invoice saved in database
          ▼
Item stock updated
          ▼
Invoice creation success response
          ▼
UI resets form & refreshes data




            Invoice List
            ----------
User opens Invoice Reports page
          ▼
useData() hook provides:
  ├─ customers
  ├─ invoices
  ├─ loading state
  └─ error state
          ▼
User optionally selects a customer
          ▼
Invoices are filtered by customerId
          ▼
Filtered invoices rendered in table
          ├─ Download PDF
          └─ Share Invoice


            Dashboard Logic
            ---------------
User opens Dashboard
        ▼
useData() hook fetches:
  ├─ Customers
  ├─ Items
  └─ Invoices
        ▼
Data stored in global state (Context)
        ▼
Dashboard consumes data via useData()
        ▼
Derived metrics calculated using useMemo()
        ▼
UI renders statistics, today’s sales, and recent invoices

Customers → customers.length
Items → items.length
Invoices → invoices.length