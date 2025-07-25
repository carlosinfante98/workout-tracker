# 🏋️ Workout Challenge Tracker

A modern, full-stack workout tracking application built with React and Node.js. Transform your fitness journey with comprehensive workout logging, progress analytics, and streak tracking.

## 🌟 Features

- **🔐 User Authentication**: Secure registration and login with JWT tokens
- **📊 Workout Tracking**: Log multiple workout types with duration and notes
- **📈 Progress Analytics**: Interactive charts showing workout distribution and monthly progress
- **🔥 Streak Tracking**: Monitor current and longest workout streaks
- **💪 Dashboard**: Personalized dashboard with stats and recent workouts
- **📱 Responsive Design**: Mobile-friendly interface with modern UX
- **🎨 Modern UI**: Built with TailwindCSS for a beautiful, consistent design

## 🛠️ Tech Stack

### Frontend

- **React** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Zustand** - State management
- **Chart.js** - Interactive charts and visualizations
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Prisma** - Database ORM and migrations
- **PostgreSQL/SQLite** - Database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Joi** - Input validation
- **Helmet** - Security headers
- **Morgan** - HTTP request logger
- **Rate Limiting** - API protection

### DevOps & Deployment

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancing
- **PostgreSQL** - Production database
- **Prisma Migrations** - Database schema management

## 📁 Project Structure

```
workout-tracker/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   └── ui/          # Generic UI components
│   │   ├── pages/           # Route pages
│   │   ├── store/           # Zustand state management
│   │   └── lib/             # Utilities and API client
│   ├── public/              # Static assets
│   ├── Dockerfile           # Client container config
│   └── package.json         # Frontend dependencies
├── server/                   # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── routes/          # API routes
│   │   └── config/          # Configuration files
│   ├── prisma/              # Database schema and migrations
│   ├── Dockerfile           # Server container config
│   └── package.json         # Backend dependencies
├── deployment/              # Deployment scripts
├── docker-compose.yml       # Multi-container setup
├── nginx.conf              # Reverse proxy config
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd workout-tracker
```

### 2. Environment Setup

Create environment files:

**Server (.env in server/ directory):**

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/workout_tracker"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

**Client (.env in client/ directory):**

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Development Setup

#### Option A: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up --build

# The application will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
# - Database: localhost:5432
```

#### Option B: Local Development

```bash
# Start backend
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

# In another terminal, start frontend
cd client
npm install
npm run dev
```

### 4. Using the Application

1. **Register**: Create a new account or use the demo
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your workout statistics and progress
4. **Log Workouts**: Click "Log Workout" to add new exercises
5. **Analytics**: View charts showing your workout distribution and progress

## 🔧 Development

### Backend Development

```bash
cd server

# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev

# Run tests
npm test

# Access Prisma Studio (database GUI)
npm run studio
```

### Frontend Development

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database Operations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## 📊 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Workout Endpoints

- `POST /api/workouts` - Create new workout
- `GET /api/workouts` - Get user's workouts (paginated)
- `GET /api/workouts/stats` - Get workout statistics
- `GET /api/workouts/monthly` - Get monthly workout data
- `GET /api/workouts/dashboard` - Get dashboard data

### Health Check

- `GET /health` - Service health status

## 🚀 Deployment

### Using Docker Compose

```bash
# Deploy to production
./deployment/deploy.sh prod

# Deploy to development
./deployment/deploy.sh dev

# View logs
./deployment/deploy.sh prod logs

# Stop services
./deployment/deploy.sh prod stop

# Clean up
./deployment/deploy.sh prod cleanup
```

### Cloud Deployment Options

#### 1. Heroku

```bash
# Install Heroku CLI
heroku create workout-tracker-app
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET="your-secret-key"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main
```

#### 2. Railway

```bash
# Install Railway CLI
railway login
railway new workout-tracker
railway add postgresql

# Deploy
railway up
```

#### 3. DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure build settings:
   - **Backend**: Node.js, build command: `npm install && npx prisma generate`
   - **Frontend**: Static site, build command: `npm run build`
3. Add environment variables
4. Deploy

#### 4. AWS ECS/Fargate

1. Build and push Docker images to ECR
2. Create ECS task definitions
3. Set up Application Load Balancer
4. Configure RDS PostgreSQL instance
5. Deploy with ECS service

### Environment Variables for Production

**Backend:**

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="production"
CORS_ORIGIN="https://your-frontend-domain.com"
```

**Frontend:**

```env
VITE_API_URL="https://your-backend-domain.com/api"
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: Joi schema validation
- **Rate Limiting**: API endpoint protection
- **CORS Configuration**: Cross-origin request handling
- **Security Headers**: Helmet middleware protection
- **SQL Injection Prevention**: Prisma ORM protection

## 🔍 Monitoring & Logging

### Health Checks

```bash
# Backend health
curl http://localhost:5000/health

# Frontend health
curl http://localhost:3000/health

# Database health
docker-compose exec postgres pg_isready -U postgres
```

### Logging

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f server
docker-compose logs -f client
```

## 🧪 Testing

### Backend Tests

```bash
cd server
npm test
```

### Frontend Tests

```bash
cd client
npm test
```

## 📈 Performance Optimization

### Frontend

- **Code Splitting**: React.lazy for route-based splitting
- **Asset Optimization**: Vite build optimization
- **Caching**: Static asset caching with Nginx
- **Compression**: Gzip compression for assets

### Backend

- **Database Indexing**: Optimized database queries
- **Connection Pooling**: Efficient database connections
- **Response Compression**: Gzip middleware
- **Rate Limiting**: Prevents API abuse

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI components inspired by [Tailwind UI](https://tailwindui.com/)
- Charts powered by [Chart.js](https://www.chartjs.org/)

## 📞 Support

For support, email support@workouttracker.com or join our Slack channel.

---

**Happy Tracking! 🏋️‍♂️💪**
# Trigger redeploy for environment variables
# Force redeploy for auth fix
