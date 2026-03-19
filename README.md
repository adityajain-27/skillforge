<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Plotly.js-3-3F4F75?logo=plotly&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" />
</p>

<h1 align="center">🌍 Cli-Lens</h1>
<h3 align="center">Climate Intelligence Platform — Visualize, Analyze & Report Climate Data</h3>

<p align="center">
  A full-stack web platform that transforms raw scientific climate datasets (NetCDF) into interactive visualizations, time-series trend analyses, anomaly detection, and exportable reports — all in the browser.
</p>

<p align="center">
  <a href="https://cli-lens.vercel.app">🔗 Live Demo</a> •
  <a href="https://drive.google.com/file/d/11oDQog4BsvgoyL7C9saj2jgHu_qvCMT9/view?usp=drivesdk">🎥 Project Video</a> •
  <a href="#features">✨ Features</a> •
  <a href="#tech-stack">🛠️ Tech Stack</a> •
  <a href="#getting-started">🚀 Getting Started</a>
</p>

---

## 🔑 Demo Credentials

To evaluate the live platform quickly without signing up, use these test accounts:
- **Pro Researcher:** `aditya1@test.com` | Password: `adi123`
- **Free Analyst:** `akshay@123.com` | Password: `ak123`

---

## 📌 Problem Statement

Climate scientists generate **petabytes** of data annually — temperature records, precipitation maps, sea-level measurements — stored in complex scientific file formats (NetCDF). Analyzing this data typically requires Python scripting, specialized libraries, and hours of processing. **Non-technical stakeholders** (policymakers, students, journalists) are completely locked out.

## 💡 Solution

**Cli-Lens** democratizes climate data analysis. Upload a NetCDF file, and the platform automatically:
- Parses variables, spatial coverage, and time ranges
- Renders interactive global heatmaps
- Computes time-series trends with anomaly detection
- Generates downloadable reports

No code. No setup. Just answers.

---

## ✨ Features

### 🗺️ Interactive Map Visualization
- Global choropleth heatmaps powered by Plotly.js
- Side-by-side **dataset comparison** — different years, models, or variables
- Zoomable, interactive, color-coded by value

### 📈 Time-Series Predictions & Anomaly Detection
- **Location time-series** — historical values at any lat/lon with rolling mean + linear regression trend
- **Global spatial mean** — cosine-latitude weighted average over time
- **Anomaly detection** — flags data points > 2σ from mean (red dots)
- Trend rate per year automatically computed

### 📤 NetCDF Dataset Upload
- Drag-and-drop upload for `.nc` files (NASA, NOAA, CMIP6 format)
- Auto-detection of variables, spatial bounds, and time range
- No configuration or metadata forms needed

### 📄 Report Export (Pro)
- Live document preview of analysis report
- Includes spatial statistics, trend values, anomaly counts
- Downloads as structured JSON — publication-ready

### 📖 Story Mode
- Transforms data analysis into curated, narrated articles
- Makes climate insights accessible to non-technical audiences

### 📰 Climate News
- Live global climate headlines via GNews API
- Context alongside your own data analysis

### 💰 SaaS Model & Tiered Access
- Built as a **Software as a Service (SaaS)** platform with a freemium model.
- JWT-based signup/login with role selection (Researcher / Analyst)
- **Free tier** — full visualization & analysis
- **Pro tier** — unlocks report downloads, exports, and advanced features
- Clean upgrade prompts with lock icons (not broken buttons)

### 🌐 3D Globe View
- Interactive 3D globe for spatial data visualization

### 💬 Collaboration
- Comment threads on datasets and stories
- Annotation support for shared analysis

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, TailwindCSS, Plotly.js |
| **Backend** | Express.js 5, Node.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT (jsonwebtoken + bcrypt) |
| **File Handling** | Multer (NetCDF upload) |
| **News API** | GNews |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
cli-lens/
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── components/      # Reusable components (Sidebar, Footer, Charts)
│   │   ├── context/         # AuthContext (JWT, user state, isPro)
│   │   ├── pages/           # All page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SignInSignUp.jsx
│   │   │   ├── ResearcherDashboard.jsx
│   │   │   ├── DatasetUpload.jsx
│   │   │   ├── DatasetComparison.jsx
│   │   │   ├── ClimatePredictions.jsx
│   │   │   ├── GlobeView.jsx
│   │   │   ├── StoryMode.jsx
│   │   │   ├── ClimateNews.jsx
│   │   │   └── ReportExport.jsx
│   │   └── services/api.js  # Centralized API client
│   └── vite.config.js
│
├── backend/                 # Express.js API
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # Route handlers
│   ├── middlewares/         # Auth middleware (JWT verify)
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   │   ├── authRoutes.js
│   │   ├── datasetRoutes.js
│   │   ├── vizRoutes.js
│   │   ├── predictionRoutes.js
│   │   ├── newsRoutes.js
│   │   ├── storyRoutes.js
│   │   └── collabRoutes.js
│   └── app.js               # Express entry point
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **MongoDB Atlas** account (or local MongoDB)
- **GNews API key** ([get one free](https://gnews.io))

### 1. Clone the repository

```bash
git clone https://github.com/adityajain-27/Cli-Lens.git
cd Cli-Lens
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
GNEWS_API_KEY=your_gnews_api_key
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🌐 Deployment

| Service | Hosts | URL |
|---|---|---|
| **Vercel** | React frontend | [cli-lens.vercel.app](https://cli-lens.vercel.app) |
| **Render** | Express API | Backend URL |
| **MongoDB Atlas** | Database | Cloud-hosted |

### Environment Variables

**Render (backend):**
| Key | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `NODE_ENV` | `production` |
| `GNEWS_API_KEY` | Climate news feed |
| `FRONTEND_URL` | Vercel URL (for CORS) |

**Vercel (frontend):**
| Key | Purpose |
|---|---|
| `VITE_API_URL` | Render backend URL + `/api` |

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/login` | Login & receive JWT |
| `GET` | `/api/auth/profile` | Get user profile |
| `PATCH` | `/api/auth/upgrade` | Upgrade to Pro |
| `POST` | `/api/dataset/upload` | Upload NetCDF file |
| `GET` | `/api/dataset/list` | List all datasets |
| `DELETE` | `/api/dataset/:id` | Delete a dataset |
| `GET` | `/api/viz/map-data` | Spatial heatmap data |
| `GET` | `/api/viz/location-trend` | Location time-series |
| `GET` | `/api/viz/global-mean` | Global spatial mean |
| `GET` | `/api/viz/compare-datasets` | Compare two datasets |
| `GET` | `/api/prediction/trend` | Prediction trend |
| `GET` | `/api/news` | Live climate news |
| `GET` | `/api/stories` | Data stories |
| `POST` | `/api/collab/comments` | Add comment |

---

## 👨‍💻 Team

- **Aditya Jain** — Full Stack Developer
- **Akshay Chauhan** — Full Stack Developer
- **Shambhavi Chauhan** — Full Stack Developer
- **Devansh Parmar** — Full Stack Developer

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ for climate science
</p>
