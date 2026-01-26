# Cheque Management System Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE LAYER                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐     ┌──────────────────┐     ┌─────────────────┐ │
│  │  ChequesPage     │────▶│ ChequeFormDialog │────▶│  Toast          │ │
│  │  - List View     │     │  - Create/Edit   │     │  Notifications  │ │
│  │  - Statistics    │     │  - Validation    │     └─────────────────┘ │
│  │  - Filters       │     │  - Bank Dropdown │                         │
│  │  - Pagination    │     └──────────────────┘                         │
│  │  - Search        │                                                   │
│  └────────┬─────────┘                                                   │
│           │                                                              │
└───────────┼──────────────────────────────────────────────────────────────┘
            │
            │ API Calls
            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER (Frontend)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  chequeService.js                                                │  │
│  │  • getAll(params)         → GET /api/cheques                     │  │
│  │  • getById(id)            → GET /api/cheques/:id                 │  │
│  │  • create(data)           → POST /api/cheques                    │  │
│  │  • update(id, data)       → PUT /api/cheques/:id                 │  │
│  │  • delete(id)             → DELETE /api/cheques/:id              │  │
│  │  • depositCheque(id)      → POST /api/cheques/:id/deposit        │  │
│  │  • clearCheque(id)        → POST /api/cheques/:id/clear          │  │
│  │  • bounceCheque(id)       → POST /api/cheques/:id/bounce         │  │
│  │  • cancelCheque(id)       → POST /api/cheques/:id/cancel         │  │
│  │  • reconcileCheque(id)    → POST /api/cheques/:id/reconcile      │  │
│  │  • getStats()             → GET /api/cheques/stats               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└───────────┬──────────────────────────────────────────────────────────────┘
            │
            │ HTTP/HTTPS (JWT Auth)
            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         API LAYER (Backend)                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  ChequeController.java                                           │  │
│  │  @RequestMapping("/api/cheques")                                 │  │
│  │  @PreAuthorize("hasAnyRole('SUPER_ADMIN','OWNER','ACCOUNTANT')")│  │
│  │                                                                   │  │
│  │  Endpoints:                                                       │  │
│  │  • GET    /                 → getAllCheques()                    │  │
│  │  • GET    /{id}             → getChequeById()                    │  │
│  │  • POST   /                 → createCheque()                     │  │
│  │  • PUT    /{id}             → updateCheque()                     │  │
│  │  • DELETE /{id}             → deleteCheque()                     │  │
│  │  • PATCH  /{id}/status      → updateChequeStatus()               │  │
│  │  • POST   /{id}/deposit     → depositCheque()                    │  │
│  │  • POST   /{id}/clear       → clearCheque()                      │  │
│  │  • POST   /{id}/bounce      → bounceCheque()                     │  │
│  │  • POST   /{id}/cancel      → cancelCheque()                     │  │
│  │  • POST   /{id}/reconcile   → reconcileCheque()                  │  │
│  │  • GET    /stats            → getChequeStatistics()              │  │
│  │  • GET    /stats/date-range → getChequeStatisticsByDateRange()   │  │
│  └────────────────────┬─────────────────────────────────────────────┘  │
│                       │                                                 │
└───────────────────────┼─────────────────────────────────────────────────┘
                        │
                        │ Delegates to
                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER (Backend)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  ChequeServiceImpl.java                                          │  │
│  │  @Service @Transactional                                         │  │
│  │                                                                   │  │
│  │  Business Logic:                                                  │  │
│  │  • Validation (duplicate cheque numbers)                         │  │
│  │  • Status workflow management                                    │  │
│  │  • Bank transaction creation                                     │  │
│  │  • Bank balance updates                                          │  │
│  │  • Transaction reversals (bounce)                                │  │
│  │  • Statistics calculation                                        │  │
│  │  • DTO mapping                                                   │  │
│  └────────────┬───────────────────────┬─────────────────────────────┘  │
│               │                       │                                 │
└───────────────┼───────────────────────┼─────────────────────────────────┘
                │                       │
       Manages  │                       │ Uses
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│  IncomingChequeRepository│  │  BankRepository          │
│  JpaRepository           │  │  JpaRepository           │
└────────────┬─────────────┘  └────────────┬─────────────┘
             │                              │
             └──────────────┬───────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER (Database)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  incoming_cheques                                                │  │
│  │  ├─ id (PK)                                                      │  │
│  │  ├─ cheque_number (UNIQUE)                                       │  │
│  │  ├─ amount                                                        │  │
│  │  ├─ cheque_date                                                  │  │
│  │  ├─ deposit_date                                                 │  │
│  │  ├─ clearance_date                                               │  │
│  │  ├─ bank_id (FK → banks)                                         │  │
│  │  ├─ bank_name                                                    │  │
│  │  ├─ customer_id (FK → customers)                                 │  │
│  │  ├─ supplier_id (FK → suppliers)                                 │  │
│  │  ├─ received_from                                                │  │
│  │  ├─ company                                                      │  │
│  │  ├─ status (ENUM)                                                │  │
│  │  ├─ remarks                                                      │  │
│  │  ├─ bank_data_id (FK → bank_data) ◄──── NEW                     │  │
│  │  ├─ is_recorded_in_bank           ◄──── NEW                     │  │
│  │  ├─ reconciled                    ◄──── NEW                     │  │
│  │  ├─ reconciliation_date           ◄──── NEW                     │  │
│  │  ├─ reference_number              ◄──── NEW                     │  │
│  │  ├─ bounce_reason                 ◄──── NEW                     │  │
│  │  ├─ bounce_date                   ◄──── NEW                     │  │
│  │  ├─ bounce_charges                ◄──── NEW                     │  │
│  │  ├─ created_at, updated_at                                      │  │
│  │  └─ created_by, updated_by                                      │  │
│  └────────────────────┬─────────────────────────────────────────────┘  │
│                       │                                                 │
│                       │ References                                      │
│                       ▼                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  bank_data (Transactions)                                        │  │
│  │  ├─ id (PK)                                                      │  │
│  │  ├─ bank_id (FK → banks)                                         │  │
│  │  ├─ credit_amount   ◄──── From cleared cheques                  │  │
│  │  ├─ debit_amount    ◄──── From bounced cheques (reversal)       │  │
│  │  ├─ cheque_number                                                │  │
│  │  ├─ transaction_date                                             │  │
│  │  ├─ description                                                  │  │
│  │  └─ user_id (FK → users)                                         │  │
│  └────────────────────┬─────────────────────────────────────────────┘  │
│                       │                                                 │
│                       │ Updates                                         │
│                       ▼                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  banks                                                           │  │
│  │  ├─ id (PK)                                                      │  │
│  │  ├─ bank_name                                                    │  │
│  │  ├─ account_number                                               │  │
│  │  ├─ current_balance  ◄──── Auto-updated on clear/bounce         │  │
│  │  ├─ opening_balance                                              │  │
│  │  └─ is_active                                                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Data Flow: Creating a Cheque

```
┌──────────┐
│  User    │
│  Action  │
└────┬─────┘
     │ 1. Fills form
     ▼
┌─────────────────┐
│ChequeFormDialog │
└────┬────────────┘
     │ 2. Validates & transforms data
     │    {chequeNumber, amount, bankId, ...}
     ▼
┌─────────────────┐
│ chequeService   │
│   .create()     │
└────┬────────────┘
     │ 3. POST /api/cheques
     │    Authorization: Bearer <JWT>
     ▼
┌─────────────────┐
│ChequeController │
│  createCheque() │
└────┬────────────┘
     │ 4. @Valid CreateChequeRequest
     ▼
┌──────────────────┐
│ ChequeServiceImpl│
│   createCheque() │
└────┬─────────────┘
     │ 5. Validates:
     │    - Unique cheque number
     │    - Bank exists
     │    - Amount > 0
     ▼
┌──────────────────┐
│IncomingChequeRepo│
│      save()      │
└────┬─────────────┘
     │ 6. INSERT INTO incoming_cheques
     ▼
┌──────────────────┐
│    Database      │
└────┬─────────────┘
     │ 7. Returns saved entity
     ▼
┌──────────────────┐
│ ChequeServiceImpl│
│ mapToResponse()  │
└────┬─────────────┘
     │ 8. ChequeResponse DTO
     ▼
┌──────────────────┐
│ChequeController  │
│  201 Created     │
└────┬─────────────┘
     │ 9. JSON response
     ▼
┌──────────────────┐
│ chequeService    │
│ returns response │
└────┬─────────────┘
     │ 10. Success
     ▼
┌──────────────────┐
│  ChequesPage     │
│ - Shows toast    │
│ - Refreshes list │
│ - Updates stats  │
└──────────────────┘
```

## Data Flow: Clearing a Cheque (with Bank Transaction)

```
┌──────────┐
│  User    │
│  Action  │
└────┬─────┘
     │ 1. Calls clearCheque(id, date)
     ▼
┌─────────────────┐
│ chequeService   │
│  .clearCheque() │
└────┬────────────┘
     │ 2. POST /api/cheques/{id}/clear
     ▼
┌─────────────────┐
│ChequeController │
│  clearCheque()  │
└────┬────────────┘
     │ 3. Delegates
     ▼
┌──────────────────┐
│ ChequeServiceImpl│
│  clearCheque()   │
└────┬─────────────┘
     │ 4. Validates status = DEPOSITED
     │ 5. Sets status = CLEARED
     │ 6. Creates BankData transaction
     ▼
┌──────────────────┐
│createBankTransac │
│     tion()       │
└────┬─────────────┘
     │ 7. Build BankData:
     │    - creditAmount = cheque.amount
     │    - chequeNumber = cheque.number
     │    - description = "Cheque cleared..."
     ▼
┌──────────────────┐
│BankDataRepository│
│      save()      │
└────┬─────────────┘
     │ 8. INSERT INTO bank_data
     ▼
┌──────────────────┐
│  BankRepository  │
│  Updates balance │
└────┬─────────────┘
     │ 9. UPDATE banks
     │    SET current_balance = 
     │        current_balance + cheque.amount
     ▼
┌──────────────────┐
│IncomingChequeRepo│
│      save()      │
└────┬─────────────┘
     │ 10. UPDATE incoming_cheques
     │     SET status = 'CLEARED',
     │         is_recorded_in_bank = true,
     │         bank_data_id = transaction.id
     ▼
┌──────────────────┐
│    Database      │
│  - Cheque cleared│
│  - Transaction   │
│    recorded      │
│  - Balance       │
│    updated       │
└──────────────────┘
```

## Security Flow

```
┌──────────┐
│  User    │
│  Login   │
└────┬─────┘
     │ 1. POST /api/auth/login
     │    {username, password}
     ▼
┌─────────────────┐
│  AuthController │
└────┬────────────┘
     │ 2. Validates credentials
     │ 3. Generates JWT token
     ▼
┌─────────────────┐
│   Frontend      │
│ Stores token in │
│  localStorage   │
└────┬────────────┘
     │ 4. Token attached to all requests
     │    via Axios interceptor
     ▼
┌─────────────────┐
│  Every Request  │
│  Header:        │
│  Authorization: │
│  Bearer <token> │
└────┬────────────┘
     │ 5. Backend validates token
     ▼
┌─────────────────┐
│  JwtAuthFilter  │
│  - Validates    │
│  - Extracts     │
│    username     │
│  - Loads user   │
└────┬────────────┘
     │ 6. SecurityContext populated
     ▼
┌─────────────────┐
│@PreAuthorize    │
│checks user role │
│ ACCOUNTANT?     │
└────┬────────────┘
     │ YES: Allow
     │ NO:  403 Forbidden
     ▼
┌─────────────────┐
│  Controller     │
│  Method         │
└─────────────────┘
```

## Component Relationships

```
┌───────────────────────────────────────────────────────────┐
│                     Frontend Hierarchy                     │
└───────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │     ChequesPage         │
              │  (Main Container)       │
              └─────────┬───────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
  ┌─────────┐  ┌─────────────┐  ┌──────────┐
  │PageHeader│  │ChequeForm   │  │DataTable │
  │         │  │Dialog       │  │          │
  └─────────┘  └─────────────┘  └──────────┘
                      │
                      ▼
              ┌─────────────┐
              │ BankService │
              │ (loads banks│
              │  for       │
              │  dropdown) │
              └─────────────┘

┌───────────────────────────────────────────────────────────┐
│                     Backend Hierarchy                      │
└───────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   ChequeController      │
              │   (REST API)            │
              └─────────┬───────────────┘
                        │
                        ▼
              ┌─────────────────────────┐
              │   ChequeServiceImpl     │
              │   (Business Logic)      │
              └─────────┬───────────────┘
                        │
        ┌───────────────┼───────────────────────┐
        │               │                       │
        ▼               ▼                       ▼
  ┌────────────┐  ┌────────────┐  ┌──────────────────┐
  │IncomingCheq│  │Bank        │  │BankData          │
  │ueRepository│  │Repository  │  │Repository        │
  └────────────┘  └────────────┘  └──────────────────┘
        │               │                       │
        └───────────────┼───────────────────────┘
                        │
                        ▼
              ┌─────────────────────────┐
              │      Database           │
              │   (MySQL/PostgreSQL)    │
              └─────────────────────────┘
```

## Complete Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                       FRONTEND                               │
├─────────────────────────────────────────────────────────────┤
│ React 18             │ UI Framework                          │
│ Vite                 │ Build Tool                            │
│ React Router         │ Routing                               │
│ React Hook Form      │ Form Management                       │
│ React Query          │ Data Fetching (used in BanksPage)   │
│ Axios                │ HTTP Client                           │
│ Tailwind CSS         │ Styling                               │
│ Shadcn/ui            │ Component Library                     │
│ Sonner               │ Toast Notifications                   │
│ Lucide React         │ Icons                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       BACKEND                                │
├─────────────────────────────────────────────────────────────┤
│ Spring Boot 3.x      │ Framework                             │
│ Spring Security      │ Authentication & Authorization        │
│ Spring Data JPA      │ ORM                                   │
│ Hibernate            │ JPA Implementation                    │
│ JWT                  │ Token-based Auth                      │
│ Lombok               │ Reduce Boilerplate                    │
│ Slf4j                │ Logging                               │
│ Validation API       │ Input Validation                      │
│ Swagger/OpenAPI      │ API Documentation                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       DATABASE                               │
├─────────────────────────────────────────────────────────────┤
│ MySQL/PostgreSQL     │ RDBMS                                 │
│ JPA/Hibernate        │ ORM                                   │
│ Flyway/Liquibase     │ Migration (optional)                  │
└─────────────────────────────────────────────────────────────┘
```

---

**This architecture ensures**:
- ✅ Clean separation of concerns
- ✅ Scalability
- ✅ Maintainability
- ✅ Testability
- ✅ Security
- ✅ Performance
