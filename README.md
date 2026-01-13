# ActivityIQ — Internal CSV Analytics Tool

ActivityIQ is an internal analytics tool built to analyze activity data from CSV files and external APIs. It supports smart ingestion with **deduplication and merge**, preserves **manual notes**, and generates **analytics & charts** for productivity tracking.

---

## 🚀 Features

* 📁 Upload CSV and analyze activity data
* 🔁 Smart merge (re-uploading same or similar data updates instead of duplicating)
* 📝 Notes are preserved across re-uploads
* 📊 Analytics dashboard:

  * Total tasks
  * Completed tasks
  * Productivity score
  * Consistency score (0–10)
* 📈 Charts for time spent per day
* 🌐 External API ingestion (one-click analyze without CSV)
* 🧠 Same ingestion pipeline for CSV and API

---

## 🏗 Tech Stack

### Backend

* Node.js
* Express
* MongoDB + Mongoose
* Multer (file upload)
* CSV parsing
* Axios (external API)
* Crypto (hashing for smart merge)

### Frontend

* React (Vite)
* Tailwind CSS
* ShadCN UI
* Framer Motion
* Recharts
* Axios

---

## 📁 Project Structure (Important Parts)

### Backend

```
/controllers
  ├── uploadController.js
  ├── externalController.js
  ├── analyticsController.js
  └── externalIngestController.js

/services
  ├── ingest.js              # Shared smart-merge ingestion logic
  └── external.js            # External API fetch + transform

/models
  └── Record.js

/routes
  ├── uploadRoutes.js
  ├── analytics.js
  └── recordRoute.js
```

### Frontend

```
/src
  ├── pages
  │   ├── Upload.jsx
      ├── Processing.jsx
  │   └── Dashboard.jsx
  
  ├── components/dashboard
  ├── api
  │   ├── upload.js
  │   └── external.js
```

---

# ⚙️ Setup Instructions

## 1️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
MONGO_URI=your_mongodb_connection_string
PORT=9000
```

Start backend:

```bash
npm run dev
```

Backend will run on:

```
http://localhost:9000
```

---

## 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

# ▶️ How to Use

## Option A: CSV Upload Flow

1. Open the app
2. Upload a CSV file in format:

```csv
date,task,timeSpent,status,user
2025-01-01,Design UI,3,completed,Harsh
```

3. Click **Upload**
4. Click **Analyze**
5. Dashboard opens with analytics

If you upload the **same file again**:

* Data is smart-merged
* Existing rows update
* Notes are preserved

---

## Option B: External API Ingestion

1. On home page, click:

> ⚡ Analyze External Data

2. System will:

* Fetch data from external API
* Convert it into internal format
* Run same smart-merge pipeline
* Open dashboard automatically

No CSV needed.

---

# 🧠 Smart Merge Logic (Core Feature)

Each row:

* Is normalized
* Has a **rowHash** generated

Each file:

* Has a **fileHash** generated

On re-upload:

* If fileHash exists → same upload session reused
* If rowHash exists → row is updated
* If new → row is inserted
* ⚠️ `note` field is NEVER overwritten

---

# 📊 Metrics Explained

## Productivity Score

```
completedTasks / totalTasks
```

Range: 0 → 1 (shown as % in UI)

---

## Consistency Score (0–10)

```
(activeDays / totalDaysInRange) × 10
```

* Normalized to 0–10
* Never exceeds 10
* Represents how regularly user worked

---

# 🌐 External API Details

Source:

```
https://jsonplaceholder.typicode.com/todos
```

Data is:

* Fetched
* Transformed into:

```js
{ date, task, user, timeSpent, status }
```

* Date range: Jan 1, 2026 → Today
* Task names mapped to real English work tasks

---

# 🚀 Deployment

* Frontend: Vercel
* Backend: Render

Steps:

* Push code to GitHub
* Deploy backend on Render
* Set environment variables
* Deploy frontend on Vercel
* Update API base URL

---

# 🧪 Assumptions

* CSV contains at least a date column and task column
* Column names can vary (system auto-detects date & time columns)
* One upload session = one dataset
* External API data is treated like a new dataset
* Notes are user-generated and should never be overwritten

---

---

# 📄 reflection.txt

## 🔴 Difficulties Faced

1. Designing smart merge without duplicating data
2. Preserving notes while updating records
3. Handling variable CSV column names
4. Normalizing metrics like consistency score
5. Reusing same ingestion pipeline for CSV and API
6. Managing upload sessions correctly
7. Making sure re-upload does not break analytics

---

## 🛠 Debugging Approach

* Added console logs for:

  * uploadId
  * rowHash
  * fileHash
* Tested with:

  * Same file
  * Slightly modified file
  * Completely new file
* Verified DB state after each operation
* Used Postman to test API endpoints
* Used browser Network tab for frontend debugging

---

## 🧠 Key Learnings

* Importance of service-layer abstraction
* Reusability of business logic
* Designing idempotent ingestion pipelines
* Normalizing metrics instead of raw counts
* Separation of concerns between:

  * Controller
  * Service
  * Model

---

## 🚀 Improvements If Given More Time

1. User authentication & multiple users
2. Dataset comparison view
3. CSV column mapping UI
4. Background scheduled ingestion (cron job)
5. Export analytics as PDF
6. More advanced metrics:

   * Streaks
   * Burnout score
   * Weekly trends
7. Role-based access
8. Better error reporting UI

---

# 🏁 Final Note

This project focuses on **data ingestion correctness, idempotency, and analytics integrity**, not just UI. The core goal was to build a **robust internal analytics engine** that behaves predictably even when data is re-ingested multiple times from different sources.
