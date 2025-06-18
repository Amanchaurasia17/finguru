
# 💼 FinGuru

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Build](https://img.shields.io/badge/build-passing-success)
![Tech](https://img.shields.io/badge/MERN-FinTech-blueviolet)

**FinGuru** is a modern, AI-powered personal finance management platform designed to help users gain control over their finances. It offers intelligent insights into spending patterns, investment planning, tax optimization, and financial goal tracking — all in one place.

---

## 🔍 Overview

FinGuru combines financial data analytics with smart automation and user-centric design. With features like UPI transaction classification, budgeting recommendations, tax-saving strategies, and personalized stock/SIP/IPO suggestions, FinGuru becomes your virtual financial advisor.


---

## ✨ Key Features

### 🧾 Transaction Intelligence
- Fetch and classify UPI transaction data (via Setu API)
- Auto-categorize expenses: food, groceries, rent, etc.
- Visualize monthly income vs. spending

### 📈 Investment Advisory
- Risk-based stock, SIP, and IPO recommendations
- AI-curated suggestions for long-term and short-term wealth growth

### 🧮 Tax Optimization
- Compare old vs. new tax regimes
- Section-wise deduction suggestions (80C, 80D, etc.)
- CA-style tax summary with PDF generation option

### 💬 AI Financial Assistant
- Chatbot available on every screen for instant guidance
- Real-time financial tips, FAQs, and support

### 🔐 Secure Authentication
- Firebase Authentication for user login & signup
- Role-based access and encrypted data storage

---

## 🧠 Tech Stack

| Layer         | Technology                                  |
|---------------|----------------------------------------------|
| Frontend      | React.js, Tailwind CSS, Chart.js             |
| Mobile App    | React Native (planned)                       |
| Backend       | Express.js (Node.js), FastAPI (ML service)   |
| Database      | MongoDB (Mongoose)                           |
| Auth          | Firebase Authentication                      |
| API Gateway   | Express as proxy between Frontend & FastAPI  |
| 3rd Party APIs| Setu API, Market Data APIs                   |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Amanchaurasia17/finguru.git
cd finguru
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following keys:
```
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
FIREBASE_API_KEY=<your_firebase_key>
SETU_API_KEY=<your_setu_api_key>
```

> 🔐 **Note**: We use two secure config files that are ignored via `.gitignore`:
> - `.env` — for environment variables  
> - `serviceAccountKey.json` — for Firebase Admin credentials

### 4. Run the App
```bash
npm run dev
```

---

## 🔌 API Endpoints (Core)

| Method | Endpoint                  | Description                           |
|--------|---------------------------|---------------------------------------|
| POST   | /api/auth/register        | User registration                     |
| POST   | /api/auth/login           | User login                            |
| GET    | /api/profile              | Fetch user profile                    |
| PUT    | /api/profile              | Update risk, income, goals, etc.      |
| POST   | /api/transactions/upload  | Upload CSV/JSON transaction data      |
| GET    | /api/transactions         | Get all transactions                  |
| POST   | /api/ai/analyze-spending  | Classify & analyze spending behavior  |
| POST   | /api/tax/optimize         | Get optimized tax plan                |
| GET    | /api/recommendations      | Get stock/SIP/IPO suggestions         |

---

## 📊 Visual Features

- **Spending Pie Chart**: Expense category breakdown  
- **Monthly Tracker**: Savings vs. Target  
- **Tax Comparison Table**: Old vs. New regime  
- **Risk Meter**: Visualize user risk profile  
- **Smart Tips**: Budgeting & investment advice

---

## 🧪 Future Enhancements

- 🔄 Real-time bank sync (via Open Banking APIs)
- 📱 Mobile App deployment (React Native)
- 📧 Email reports & notifications
- 📂 Integration with tax filing platforms (e.g., ClearTax)
- 🔎 Search & filter transactions by category/date

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙋‍♂️ Author & Credits

Developed with 💙 by:

- [Aman Chaurasiya](https://github.com/Amanchaurasia17) — Full-stack Development  
- [RaviKant Prajapati](https://github.com/ravee360) — AI/ML Modules 

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo  
2. Create a new branch: `git checkout -b feature/your-feature`  
3. Make your changes  
4. Submit a pull request with a clear description

---

## 📬 Contact

For any queries, reach out via [GitHub](https://github.com/Amanchaurasia17) or open an issue.

---

**Empowering India to be financially wise — one transaction at a time.**
