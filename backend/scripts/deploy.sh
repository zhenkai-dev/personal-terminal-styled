#!/bin/bash

# Personal Terminal Backend Deployment Script
# This script handles production deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_MODE=${1:-docker} # docker or pm2
ENVIRONMENT=${2:-production}

echo -e "${BLUE}🚀 Personal Terminal Backend Deployment${NC}"
echo "========================================="
echo "Mode: $DEPLOYMENT_MODE"
echo "Environment: $ENVIRONMENT"
echo ""

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required files exist
if [ ! -f ".env" ]; then
    print_error ".env file not found. Please create it from .env.example"
    exit 1
fi

if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the correct directory?"
    exit 1
fi

# Pre-deployment checks
echo -e "${BLUE}🔍 Running pre-deployment checks...${NC}"

# Check if all required environment variables are set
required_vars=("DATABASE_URL" "JWT_SECRET")
for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env; then
        print_error "$var is not set in .env file"
        exit 1
    fi
done

print_status "Environment variables check passed"

# Build the project
echo -e "\n${BLUE}🔨 Building project...${NC}"
npm run build

print_status "Project built successfully"

# Docker deployment
if [ "$DEPLOYMENT_MODE" = "docker" ]; then
    echo -e "\n${BLUE}🐳 Docker deployment...${NC}"
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Stop existing containers
    echo "Stopping existing containers..."
    docker-compose down || true
    
    # Build and start containers
    echo "Building and starting containers..."
    docker-compose up -d --build
    
    # Wait for services to be ready
    echo "Waiting for services to be ready..."
    sleep 30
    
    # Check if backend is healthy
    if curl -f http://localhost:3001/health &> /dev/null; then
        print_status "Backend is healthy and running"
    else
        print_error "Backend health check failed"
        echo "Container logs:"
        docker-compose logs backend
        exit 1
    fi
    
    # Run database migrations
    echo "Running database migrations..."
    docker-compose exec backend npm run migrate
    
    # Seed database if needed
    if [ "$ENVIRONMENT" = "production" ]; then
        echo "Seeding database..."
        docker-compose exec backend npm run db:seed
    fi
    
    print_status "Docker deployment completed"
    echo ""
    echo "Services are running:"
    echo "- Backend API: http://localhost:3001"
    echo "- Health check: http://localhost:3001/health"
    echo ""
    echo "Useful commands:"
    echo "- View logs: docker-compose logs -f backend"
    echo "- Stop services: docker-compose down"
    echo "- Restart backend: docker-compose restart backend"

# PM2 deployment
elif [ "$DEPLOYMENT_MODE" = "pm2" ]; then
    echo -e "\n${BLUE}🔄 PM2 deployment...${NC}"
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        print_error "PM2 is not installed. Install it with: npm install -g pm2"
        exit 1
    fi
    
    # Install production dependencies
    echo "Installing production dependencies..."
    npm ci --only=production
    
    # Generate Prisma client
    echo "Generating Prisma client..."
    npm run db:generate
    
    # Run database migrations
    echo "Running database migrations..."
    npm run migrate
    
    # Seed database if needed
    if [ "$ENVIRONMENT" = "production" ]; then
        echo "Seeding database..."
        npm run db:seed
    fi
    
    # Stop existing PM2 processes
    pm2 stop ecosystem.config.js || true
    pm2 delete ecosystem.config.js || true
    
    # Start with PM2
    echo "Starting application with PM2..."
    pm2 start ecosystem.config.js --env $ENVIRONMENT
    
    # Save PM2 configuration
    pm2 save
    
    # Setup PM2 startup script
    pm2 startup || true
    
    print_status "PM2 deployment completed"
    echo ""
    echo "Application is running with PM2"
    echo ""
    echo "Useful commands:"
    echo "- View status: pm2 status"
    echo "- View logs: pm2 logs personal-terminal-backend"
    echo "- Restart: pm2 restart personal-terminal-backend"
    echo "- Stop: pm2 stop personal-terminal-backend"

else
    print_error "Invalid deployment mode. Use 'docker' or 'pm2'"
    exit 1
fi

echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo "API is available at: http://localhost:3001"
echo "Health check: http://localhost:3001/health"