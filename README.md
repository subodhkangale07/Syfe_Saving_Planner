# 💰 Goal-Based Savings Planner

A lightweight, client-side savings planner that helps users create and track multiple financial goals with real-time currency conversion.

---

## 🌟 Features

- **Goal Creation**: Create financial goals with custom names, target amounts, and currency selection (INR/USD)
- **Real-time Currency Conversion**: Live INR ↔ USD exchange rates from ExchangeRate-API
- **Progress Tracking**: Visual progress bars and contribution tracking for each goal
- **Dashboard Overview**: Total targets, savings, and overall completion percentage
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Data Persistence**: Goals and contributions persist using `localStorage`


---

## 📸 Screenshots

### 📊 Dashboard Overview  
![Dashboard](https://github.com/user-attachments/assets/3b1b0f7f-0d2a-4832-8eb6-bb36dcc84e62)  
*Main dashboard showing all goals and overall progress*

### ➕ Add New Goal  
![Add Goal](https://github.com/user-attachments/assets/4026a0f6-0505-4662-81b2-4f8cf192c3a0)  
*Goal creation form with currency selection and validation*

### 🎯 Goal Cards  
![Goal Cards](https://github.com/user-attachments/assets/77b70bab-1448-42dd-947a-89d634f80999)  
*Individual goal cards displaying goal name, target amount, current savings, and progress bar*

### 💸 Add Contribution Modal  
![Add Contribution](https://github.com/user-attachments/assets/23e17e0e-76ec-4da3-ab1b-646b23febb05)  
*Modal to record contributions with amount and date selection*

### 🏅 Achievement Section  
![Achievement Section](https://github.com/user-attachments/assets/90d1c5e7-8f27-4b5e-be79-498a1e909e8d)  
*Displays milestone badges for user accomplishments such as first goal added, 50% savings completed, and full goal completion*


---

## 🛠️ Tech Stack

- **Framework**: React 18+ with JavaScript
- **Styling**: Tailwind CSS Modules
- **Icons**: React Icons (Lucide React)
- **API**: ExchangeRate-API
- **Storage**: localStorage
- **Deployment**: Vercel

---

## 📂 Project Structure

```

src/
├── components/
│   ├── AchievementSystem.jsx
│   ├── AddGoalModal.jsx
│   ├── ContributionModal.jsx
│   ├── Dashboard.jsx
│   ├── DataExport.jsx
│   ├── GoalCard.jsx
│   ├── GoalInsights.jsx
│   ├── GoalTemplates.jsx
│   └── LoadingSpinner.jsx
├── utils/
│   └── api.js
├── assets/
├── App.css
├── App.jsx
├── index.css
└── main.jsx

````

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/goal-based-savings-planner.git
   cd goal-based-savings-planner


2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables (optional)**

   ```bash
   cp .env.example .env
   # Add your ExchangeRate-API key if required
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

---

## 💡 Key Features Explained

### ✅ Goal Management

* Custom names, targets, and currency options
* Percentage-based progress visualization
* Contributions with date tracking

### 💱 Currency Conversion

* Real-time INR ↔ USD conversion
* Fallback to cached rates
* Manual refresh with timestamp

### 📊 Dashboard Analytics

* Total and goal-wise savings
* Visual milestones and achievements

### 💾 Data Persistence

* Saves to `localStorage`
* No server required

---

## 🔧 Technical Decisions

* **Component-based architecture** for modularity
* **CSS Modules** for scoped styling
* **React Hooks** for state
* **localStorage** for persistent data

---

## ⚙️ Performance Optimizations

* Lazy loading for modals
* Debounced API requests
* Cached exchange rates

---

## 🔐 Error Handling

* API/network fallbacks
* Input validation with user feedback
* Loading states for smoother UX

---

## ✅ Core Requirements Fulfilled

* ✔️ Goal creation and progress display
* ✔️ Real-time currency conversion
* ✔️ Dashboard with aggregated stats
* ✔️ Fully interactive and user-friendly
* ✔️ Modular, clean, and maintainable code

---

## 🌟 Bonus Features

* 🏆 Achievement System
* 📋 Goal Templates
* 📤 Data Export (JSON/CSV)
* 📈 Advanced Analytics
* 🌙 Dark Mode
* 🗂️ Goal Categories

---

## 🚦 API Rate Limiting

Uses ExchangeRate-API (Free Tier - 1,500 requests/month):

* Cached for 1 hour
* Manual refresh available
* Graceful fallback handling

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run all tests with coverage
npm run test:coverage
```

---

## 🚀 Deployment

### On Vercel (Recommended)

1. Push code to GitHub
2. Connect repo on Vercel
3. Vercel auto-deploys on each push

### On Netlify

```bash
npm run build
```

Deploy the `dist` folder

### Manual Deployment

```bash
npm run build
# Upload the dist folder to your hosting service
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch

   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes

   ```bash
   git commit -m "Add amazing feature"
   ```
4. Push to GitHub

   ```bash
   git push origin feature/amazing-feature
   ```
5. Create a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

* [ExchangeRate-API](https://www.exchangerate-api.com/)
* [React](https://reactjs.org/)
* [Lucide React Icons](https://lucide.dev/)


