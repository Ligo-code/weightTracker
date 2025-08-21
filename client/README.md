# Weight Tracker - Frontend

React-based frontend for the Weight Tracker application.

## 🛠️ Tech Stack

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Chart.js** - Interactive data visualization
- **React Router** - Client-side routing
- **CSS Modules** - Scoped component styling

## 🚀 Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts
- `npm run dev` - Start development server on http://localhost:5173
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── api/                 # API service functions
│   ├── auth.js         # Authentication services
│   └── weight.js       # Weight management services
├── components/         # React components
│   ├── Layout/         # Layout components (Navbar, Footer)
│   └── UI/             # UI components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── styles/             # CSS modules and global styles
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── router.jsx          # Route configuration
```

## 🎨 Styling

- **CSS Modules** for component-scoped styles
- **Dark/Light theme** support with CSS custom properties
- **Responsive design** for mobile and desktop
- **Consistent color scheme** with green theme

## 🔗 API Integration

The frontend communicates with the backend API at:
- Development: `http://localhost:5000`
- Production: `https://weighttracker-heqj.onrender.com`

### Authentication
- JWT tokens stored in localStorage
- Automatic token refresh handling
- Protected routes with authentication guards

### Error Handling
- Toast notifications for user feedback
- Comprehensive error boundaries
- API error handling with retry logic

## 📱 Features

### Core Features
- User authentication (login/register)
- Weight entry management (CRUD)
- Interactive weight charts
- Dark/light theme toggle
- Responsive mobile design

### UI Components
- **AuthForm** - Login/register form
- **WeightTracker** - Main weight management interface
- **WeightChart** - Chart visualization
- **Toast** - Notification system
- **Navbar** - Navigation with theme toggle

### Custom Hooks
- **useToast** - Toast notification management
- **useAuth** - Authentication state (future enhancement)

## 🔧 Configuration

### Environment Variables
Create `.env` file in client directory:
```env
VITE_API_URL=http://localhost:5000
```

### Vite Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});
```

## 🎯 Best Practices

### Component Guidelines
- Use functional components with hooks
- Implement proper prop validation
- Keep components small and focused
- Use CSS Modules for styling

### State Management
- Local state with useState
- Context for global state (theme)
- Custom hooks for reusable logic

### Performance
- Lazy loading for route components
- Memoization for expensive calculations
- Optimized re-renders with proper dependencies

## 🚀 Deployment

### Build Process
```bash
# Create production build
npm run build

# Files will be generated in dist/ directory
```

### Deployment Platforms
- **Vercel** - Automatic deployment from Git
- **Netlify** - Static site hosting
- **GitHub Pages** - Free hosting for public repos

### Production Considerations
- Environment variables configuration
- API URL updates for production
- Asset optimization and caching
- Error monitoring setup

## 🔍 Debugging

### Development Tools
- React Developer Tools browser extension
- Vite's built-in HMR for fast development
- Console logging for API calls and state changes

### Common Issues
- CORS errors: Check API server configuration
- Build failures: Verify all dependencies are installed
- Routing issues: Ensure React Router setup is correct

## 📈 Performance Monitoring

- Bundle size analysis with `npm run build`
- Lighthouse audits for performance metrics
- React DevTools Profiler for component performance

## 🧪 Testing (Future Enhancement)

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test
```

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
