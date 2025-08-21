# 🏋️ Weight Tracker

A modern, full-stack web application for tracking weight progress with beautiful charts and dark mode support.

## 🌟 Features

- **📊 Visual Charts** - Interactive weight progress visualization using Chart.js
- **🌙 Dark Mode** - Beautiful dark/light theme toggle with persistent settings
- **📱 Responsive Design** - Optimized for desktop and mobile devices
- **🔐 Secure Authentication** - JWT-based user authentication with refresh tokens
- **📝 Weight Management** - Add, edit, delete weight entries with notes
- **🔔 Toast Notifications** - Real-time feedback for user actions
- **📄 Pagination** - Efficient data loading with pagination support
- **⚡ Fast Performance** - Optimized React components and API endpoints

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Chart.js** - Interactive charts and data visualization
- **React Router** - Client-side routing
- **CSS Modules** - Scoped styling with CSS modules
- **Custom Hooks** - Reusable logic with custom React hooks

### Backend
- **Node.js** - Server runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **JWT** - JSON Web Tokens for authentication
- **Joi** - Data validation and sanitization
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection against abuse

## 🌐 Live Demo

**🔗 [Try Weight Tracker Live](https://weighttracker-1.onrender.com/)**

The application is deployed and ready to use! You can create an account and start tracking your weight progress immediately.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ligo-code/weightTracker.git
   cd weightTracker
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   Create `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/weighttracker
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   # Start server (from server directory)
   npm run dev
   
   # Start client (from client directory)
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Documentation

- **📚 [API Documentation](docs/API.md)** - Complete API reference with examples
- **📋 [Changelog](CHANGELOG.md)** - Project development history
- **🚀 [Deployment Info](DEPLOYMENT_INFO.md)** - Live deployment details

## 🏗️ Project Structure

```
weightTracker/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api/           # API service functions
│   │   ├── components/    # React components
│   │   │   ├── Layout/    # Layout components
│   │   │   └── UI/        # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   └── styles/        # CSS modules
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── db/               # Database configuration
│   ├── middleware/       # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── package.json
└── README.md
```

## 🎨 Component Architecture

### Key Components
- **App.jsx** - Main application component with theme management
- **WeightTracker.jsx** - Core weight management interface
- **WeightChart.jsx** - Chart visualization component
- **AuthForm.jsx** - Authentication form component
- **Toast.jsx** - Notification system component

### Custom Hooks
- **useToast** - Toast notification management
- **useAuth** - Authentication state management

## 🔧 Development

### Available Scripts

#### Client
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

#### Server
```bash
npm run dev      # Start with nodemon
npm start        # Start production server
```

### Code Style
- ESLint configuration for consistent code style
- CSS Modules for scoped styling
- Functional components with hooks
- Modern ES6+ syntax

## 🌐 Deployment

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password Hashing** using bcrypt
- **Request Validation** with Joi schemas
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for cross-origin requests
- **Helmet.js** for security headers
- **XSS Protection** with sanitization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ligo-code**
- GitHub: [@Ligo-code](https://github.com/Ligo-code)

---

⭐ **This project showcases modern full-stack development skills and is part of my professional portfolio.**