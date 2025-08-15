# Personal Terminal Backend

A Node.js/Express backend for Wong Zhen Kai's personal terminal-styled website. This backend provides command execution tracking, user analytics, and file download capabilities.

## 🚀 Features

- **Command Execution API**: Handle terminal commands with response tracking
- **User Analytics**: Track user interactions and command usage
- **File Downloads**: Serve resume files (PDF/Markdown)
- **Comprehensive Logging**: Winston-based logging with multiple transports
- **Database Management**: Prisma ORM with MySQL support
- **Docker Ready**: Full containerization support
- **Production Ready**: PM2 ecosystem, Nginx reverse proxy, health checks

## 📋 Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- Docker & Docker Compose (optional, for containerized deployment)

## 🛠️ Quick Start

### 1. Setup
```bash
# Clone and navigate to backend directory
cd backend

# Run setup script
./scripts/setup.sh

# Or manual setup:
npm install
cp .env.example .env
mkdir -p logs uploads
```

### 2. Configure Environment
Update `.env` file with your configuration:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/personal_terminal"

# Security
JWT_SECRET="your-super-secure-jwt-secret"

# CORS
ALLOWED_ORIGINS="http://localhost:3000,https://zhenkai-dev.com"

```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run migrate

# Seed initial data
npm run db:seed
```

### 4. Development
```bash
# Start development server
npm run dev

# The API will be available at http://localhost:3001
```

## 🐳 Docker Deployment

### Quick Start with Docker Compose
```bash
# Deploy everything (MySQL, Backend, Nginx)
./scripts/deploy.sh docker

# Or manually:
docker-compose up -d
```

### Individual Container
```bash
# Build image
docker build -t personal-terminal-backend .

# Run container
docker run -p 3001:3001 --env-file .env personal-terminal-backend
```

## 🔄 PM2 Deployment

```bash
# Deploy with PM2
./scripts/deploy.sh pm2

# Or manually:
npm run build
pm2 start ecosystem.config.js --env production
```

## 📚 API Documentation

### Base URL
```
Development: http://localhost:3001
Production: https://api.zhenkai-dev.com
```

### Endpoints

#### Health Check
```http
GET /health
```

#### Commands
```http
GET /api/commands                     # Get all commands
POST /api/commands/execute            # Execute a command
GET /api/commands/:name/response      # Get command response
GET /api/commands/download/:type      # Download resume (pdf/md)
```

#### Analytics
```http
GET /api/analytics/dashboard          # Dashboard stats
GET /api/analytics/summary            # Analytics summary
GET /api/analytics/commands           # Command analytics
GET /api/analytics/users              # User analytics
```

#### Users
```http
GET /api/users/:sessionId/profile     # Get user profile
PUT /api/users/:sessionId/profile     # Update user profile
DELETE /api/users/:sessionId          # Delete user data (GDPR)
```

### Request Examples

#### Execute Command
```bash
curl -X POST http://localhost:3001/api/commands/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "/about",
    "sessionId": "user-session-123",
    "nickname": "John",
    "timezone": "Asia/Kuala_Lumpur"
  }'
```

#### Get Analytics
```bash
curl "http://localhost:3001/api/analytics/dashboard"
```

## 🏗️ Architecture

### Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MySQL 8.0 with Prisma ORM
- **Logging**: Winston
- **Process Manager**: PM2
- **Containerization**: Docker
- **Reverse Proxy**: Nginx

### Project Structure
```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utilities
│   └── config/          # Configuration
├── prisma/              # Database schema & migrations
├── scripts/             # Deployment scripts
├── logs/                # Application logs
└── uploads/             # File uploads
```

### Database Schema
- **Users**: Session tracking and user profiles
- **Commands**: Available terminal commands
- **CommandExecutions**: Command usage analytics
- **CommandResponses**: Command response content
- **FileDownloads**: Download tracking
- **AnalyticsDaily**: Daily aggregated statistics

## 🔒 Security Features

- **Rate Limiting**: API request throttling
- **CORS Protection**: Configurable origin whitelist
- **Input Validation**: Request validation with express-validator
- **Security Headers**: Helmet.js security headers
- **Error Handling**: Secure error responses (no stack traces in production)
- **Session Tracking**: UUID-based session management

## 📊 Monitoring & Analytics

### Built-in Analytics
- User engagement metrics
- Command popularity rankings
- Geographic user distribution
- Performance monitoring (response times)
- Error tracking and reporting

### Health Monitoring
- `/health` endpoint for load balancer checks
- Database connectivity verification
- Memory usage reporting
- Service uptime tracking

### Logging
- Structured JSON logging
- Multiple log levels (error, warn, info, debug)
- File rotation and compression
- Request/response logging

## 🚀 Performance Features


### Database Optimization
- Indexed queries for performance
- Connection pooling
- Query optimization
- Scheduled analytics aggregation

### Scalability
- Cluster mode support (PM2)
- Horizontal scaling ready
- Stateless design
- Load balancer friendly

## 🔧 Configuration

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3001` |
| `DATABASE_URL` | MySQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

### Production Considerations
- Use strong JWT secrets
- Enable SSL/TLS
- Configure proper CORS origins
- Set up monitoring and alerting
- Regular database backups
- Log rotation and retention

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📝 Logging

Logs are written to:
- Console (development)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)

Log levels: `error`, `warn`, `info`, `debug`

## 🤝 Integration with Frontend

This backend is designed to work with the Next.js frontend located in the parent directory. The API provides:

1. **Command Execution**: Handles all terminal commands from the frontend
2. **User Management**: Tracks user sessions and preferences
3. **File Downloads**: Serves resume files
4. **Analytics**: Provides usage statistics

### Frontend Integration Points
- Session management via `X-Session-ID` header
- Command execution via POST `/api/commands/execute`
- File downloads via GET `/api/commands/download/:type`
- Real-time analytics for admin dashboard

## 🔄 Deployment Strategies

### Development
```bash
npm run dev
```

### Staging/Production with Docker
```bash
docker-compose up -d
```

### Production with PM2
```bash
npm run build
pm2 start ecosystem.config.js --env production
```

### CI/CD Pipeline
1. Run tests and linting
2. Build Docker image
3. Push to registry
4. Deploy to staging
5. Run integration tests
6. Deploy to production
7. Health check verification

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify MySQL is running
   - Check network connectivity


3. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process: `pkill -f node`

4. **Docker Issues**
   - Ensure Docker daemon is running
   - Check port conflicts
   - Verify .env configuration

### Logs and Debugging
```bash
# View application logs
tail -f logs/combined.log

# View error logs only
tail -f logs/error.log

# Docker logs
docker-compose logs -f backend

# PM2 logs
pm2 logs personal-terminal-backend
```

## 📞 Support

For issues and questions:
- Check the logs for error details
- Verify environment configuration
- Test database connectivity
- Check service health endpoints

## 🎯 Future Enhancements

- [ ] GraphQL API support
- [ ] WebSocket real-time features
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] API versioning
- [ ] Automated backups
- [ ] Performance monitoring integration

---

Built with ❤️ by Wong Zhen Kai | [GitHub](https://github.com/zhenkai-dev) | [Website](https://zhenkai-dev.com)