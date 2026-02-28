# Deposit Flow Diagram

## Luồng nạp tiền hoàn chỉnh

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       │ 1. Vào /dashboard/deposit
       │    Nhập số tiền: 100,000đ
       │    Click "Tạo mã QR"
       ▼
┌─────────────────────────────────────────┐
│           Frontend (Next.js)            │
│  GET /payment/deposit/qr?amount=100000  │
└──────────────────┬──────────────────────┘
                   │
                   │ 2. Request với JWT token
                   ▼
┌─────────────────────────────────────────┐
│          Backend (NestJS)               │
│  PaymentController.generateDepositQR()  │
└──────────────────┬──────────────────────┘
                   │
                   │ 3. Generate transfer content
                   │    NAP ABC123XY (unique)
                   ▼
┌─────────────────────────────────────────┐
│         PaymentService                  │
│  - generateTransferContent(userId)      │
│  - generateQRUrl(amount, content)       │
└──────────────────┬──────────────────────┘
                   │
                   │ 4. Call VietQR API
                   ▼
┌─────────────────────────────────────────┐
│          VietQR API                     │
│  img.vietqr.io/image/ICB-106876543210   │
│  ?amount=100000&addInfo=NAP%20ABC123XY  │
└──────────────────┬──────────────────────┘
                   │
                   │ 5. Return QR URL + Bank Info
                   ▼
┌─────────────────────────────────────────┐
│           Frontend                      │
│  - Display QR code                      │
│  - Show bank info                       │
│  - Copy buttons                         │
│  - 5 min expiry timer                   │
└──────────────────┬──────────────────────┘
                   │
                   │ 6. User quét QR hoặc nhập thủ công
                   ▼
┌─────────────────────────────────────────┐
│        Banking App (VietinBank)         │
│  - Scan QR code                         │
│  - Confirm transfer                     │
│  - Amount: 100,000đ                     │
│  - Content: NAP ABC123XY                │
└──────────────────┬──────────────────────┘
                   │
                   │ 7. Transfer successful
                   ▼
┌─────────────────────────────────────────┐
│          VietinBank System              │
│  - Process transaction                  │
│  - Notify Sepay                         │
└──────────────────┬──────────────────────┘
                   │
                   │ 8. Transaction notification
                   ▼
┌─────────────────────────────────────────┐
│             Sepay System                │
│  - Receive bank notification            │
│  - Parse transaction data               │
│  - Call webhook                         │
└──────────────────┬──────────────────────┘
                   │
                   │ 9. POST /payment/sepay/webhook
                   │    Headers: x-signature
                   │    Body: {
                   │      transaction_id: "SEP123",
                   │      amount: 100000,
                   │      content: "NAP ABC123XY"
                   │    }
                   ▼
┌─────────────────────────────────────────┐
│          Backend (NestJS)               │
│  PaymentController.handleSepayWebhook() │
└──────────────────┬──────────────────────┘
                   │
                   │ 10. Verify signature
                   │     Parse content: NAP ABC123XY
                   │     Extract userId: ABC123
                   ▼
┌─────────────────────────────────────────┐
│         PaymentService                  │
│  - Find user by prefix ABC123           │
│  - Check transaction_id not duplicate   │
│  - Start atomic transaction             │
└──────────────────┬──────────────────────┘
                   │
                   │ 11. Database operations
                   ▼
┌─────────────────────────────────────────┐
│        PostgreSQL Database              │
│  BEGIN TRANSACTION;                     │
│                                         │
│  1. UPDATE User                         │
│     SET balance = balance + 100000      │
│     WHERE id = 'abc123...'              │
│                                         │
│  2. INSERT INTO Deposit                 │
│     (userId, amount, method,            │
│      transactionId, status)             │
│                                         │
│  3. INSERT INTO Transaction             │
│     (userId, type, amount,              │
│      oldBalance, newBalance)            │
│                                         │
│  COMMIT;                                │
└──────────────────┬──────────────────────┘
                   │
                   │ 12. Return success
                   ▼
┌─────────────────────────────────────────┐
│             Sepay System                │
│  - Receive 200 OK                       │
│  - Mark webhook as processed            │
└─────────────────────────────────────────┘
                   │
                   │ 13. User refresh page
                   ▼
┌─────────────────────────────────────────┐
│           Frontend                      │
│  GET /payment/deposit/history           │
│  - Show new transaction                 │
│  - Display updated balance              │
└─────────────────────────────────────────┘
```

## Timing

```
T+0s    : User tạo QR
T+0.5s  : QR hiển thị
T+10s   : User quét QR
T+15s   : User confirm transfer
T+20s   : Bank xử lý
T+25s   : Sepay nhận notification
T+26s   : Webhook được gọi
T+27s   : Backend cộng tiền
T+30s   : User refresh → Thấy tiền
```

## Error Handling

```
┌─────────────────────────────────────────┐
│         Webhook Error Cases             │
└─────────────────────────────────────────┘

1. Invalid Signature
   ├─ Verify signature fails
   ├─ Return 403 Forbidden
   └─ Sepay retry (max 3 times)

2. User Not Found
   ├─ Parse content: NAP ABC123XY
   ├─ Search user by prefix ABC123
   ├─ No match found
   ├─ Return {status: "FAILED"}
   └─ Sepay mark as failed

3. Duplicate Transaction
   ├─ Check transaction_id exists
   ├─ Already processed
   ├─ Return {status: "SUCCESS"}
   └─ Idempotency (no action)

4. Database Error
   ├─ Transaction rollback
   ├─ Return 500 Error
   └─ Sepay retry later
```

## Security Layers

```
┌─────────────────────────────────────────┐
│         Security Measures               │
└─────────────────────────────────────────┘

Layer 1: Webhook Signature
├─ Sepay signs with WEBHOOK_SECRET
├─ Backend verifies signature
└─ Prevents unauthorized webhooks

Layer 2: Unique Transfer Content
├─ Format: NAP <userId_8chars><random_4chars>
├─ Random part prevents guessing
└─ Each QR has unique content

Layer 3: Idempotency Check
├─ Check transaction_id in database
├─ Prevent duplicate processing
└─ Safe for webhook retries

Layer 4: Atomic Transaction
├─ BEGIN TRANSACTION
├─ Update balance + Create deposit + Log
├─ COMMIT or ROLLBACK
└─ Data consistency guaranteed

Layer 5: Amount Validation
├─ Min: 10,000đ
├─ Max: 50,000,000đ
└─ Prevent invalid amounts

Layer 6: QR Expiration
├─ QR expires after 5 minutes
├─ Reduce security window
└─ Force refresh for new content
```

## Database Schema

```sql
-- Deposit record
CREATE TABLE "Deposit" (
  id              TEXT PRIMARY KEY,
  userId          TEXT NOT NULL,
  amount          DECIMAL(20,2) NOT NULL,
  method          TEXT NOT NULL,        -- "SEPAY"
  transactionId   TEXT UNIQUE NOT NULL, -- From Sepay
  status          TEXT DEFAULT 'COMPLETED',
  createdAt       TIMESTAMP DEFAULT NOW()
);

-- Transaction log
CREATE TABLE "Transaction" (
  id          TEXT PRIMARY KEY,
  userId      TEXT NOT NULL,
  type        TEXT NOT NULL,            -- "DEPOSIT"
  amount      DECIMAL(20,2) NOT NULL,
  oldBalance  DECIMAL(20,2) NOT NULL,
  newBalance  DECIMAL(20,2) NOT NULL,
  description TEXT,
  referenceId TEXT,                     -- Link to Deposit.id
  createdAt   TIMESTAMP DEFAULT NOW()
);

-- User balance
CREATE TABLE "User" (
  id       TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  balance  DECIMAL(20,2) DEFAULT 0,
  ...
);
```

## API Endpoints

```
┌─────────────────────────────────────────┐
│         Payment Endpoints               │
└─────────────────────────────────────────┘

GET /payment/deposit/qr
├─ Auth: Required (JWT)
├─ Query: amount (number)
├─ Response: {qrUrl, bankInfo, expiresAt}
└─ Purpose: Generate QR code

GET /payment/deposit/history
├─ Auth: Required (JWT)
├─ Query: limit (number, default 10)
├─ Response: Deposit[]
└─ Purpose: Get transaction history

POST /payment/sepay/webhook
├─ Auth: None (verified by signature)
├─ Headers: x-signature
├─ Body: Sepay payload
├─ Response: {status, userId, amount}
└─ Purpose: Process deposit from Sepay
```

---

**Tóm tắt:** User tạo QR → Chuyển khoản → Sepay webhook → Backend cộng tiền → Done!
