#!/bin/bash

# Personal Terminal Backend Setup Script
# This script sets up the development and production environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Personal Terminal Backend Setup${NC}"
echo "========================================="

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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or later is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js $(node -v) is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

print_status "npm $(npm -v) is installed"

# Install dependencies
echo -e "\n${BLUE}📦 Installing dependencies...${NC}"
npm install

print_status "Dependencies installed"

# Setup environment file
if [ ! -f ".env" ]; then
    echo -e "\n${BLUE}🔧 Setting up environment file...${NC}"
    cp .env.example .env
    print_warning "Please update .env file with your actual configuration"
else
    print_status "Environment file already exists"
fi

# Create necessary directories
echo -e "\n${BLUE}📁 Creating directories...${NC}"
mkdir -p logs uploads

print_status "Directories created"

# Check if Docker is installed (optional)
if command -v docker &> /dev/null; then
    print_status "Docker $(docker --version | cut -d' ' -f3 | cut -d',' -f1) is installed"
    
    if command -v docker-compose &> /dev/null; then
        print_status "Docker Compose $(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1) is installed"
    else
        print_warning "Docker Compose is not installed (optional for development)"
    fi
else
    print_warning "Docker is not installed (optional for development)"
fi

# Generate Prisma client
echo -e "\n${BLUE}🗄️  Setting up database...${NC}"
npm run db:generate

print_status "Prisma client generated"

# Build the project
echo -e "\n${BLUE}🔨 Building project...${NC}"
npm run build

print_status "Project built successfully"

echo -e "\n${GREEN}🎉 Setup completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Update your .env file with the correct database URL and other settings"
echo "2. Run database migrations: npm run migrate"
echo "3. Seed the database: npm run db:seed"
echo "4. Start development server: npm run dev"
echo ""
echo "For production deployment:"
echo "- Use Docker: docker-compose up -d"
echo "- Or use PM2: pm2 start ecosystem.config.js"
echo ""
echo -e "${BLUE}📚 Check the README.md for detailed instructions${NC}"