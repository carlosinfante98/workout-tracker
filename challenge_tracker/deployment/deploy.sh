#!/bin/bash

# Workout Tracker Deployment Script
# Usage: ./deploy.sh [dev|prod]

set -e

# Configuration
ENVIRONMENT=${1:-dev}
COMPOSE_FILE="docker-compose.yml"
COMPOSE_FILE_PROD="docker-compose.prod.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
}

# Check environment files
check_env_files() {
    if [ "$ENVIRONMENT" = "prod" ]; then
        if [ ! -f "server/.env" ]; then
            error "server/.env file not found. Please create it from server/.env.example"
        fi
        if [ ! -f "client/.env" ]; then
            error "client/.env file not found. Please create it from client/.env.example"
        fi
    fi
}

# Build and start services
deploy() {
    log "Starting deployment for $ENVIRONMENT environment..."
    
    # Choose compose file
    if [ "$ENVIRONMENT" = "prod" ]; then
        COMPOSE_FILE=$COMPOSE_FILE_PROD
    fi
    
    # Check if compose file exists
    if [ ! -f "$COMPOSE_FILE" ]; then
        error "Compose file $COMPOSE_FILE not found"
    fi
    
    # Stop existing services
    log "Stopping existing services..."
    docker-compose -f $COMPOSE_FILE down --remove-orphans
    
    # Build and start services
    log "Building and starting services..."
    docker-compose -f $COMPOSE_FILE up --build -d
    
    # Wait for services to be ready
    log "Waiting for services to start..."
    sleep 10
    
    # Check service health
    check_health
    
    log "Deployment completed successfully!"
}

# Check service health
check_health() {
    log "Checking service health..."
    
    # Check database
    if docker-compose -f $COMPOSE_FILE exec postgres pg_isready -U postgres > /dev/null 2>&1; then
        log "✓ Database is healthy"
    else
        warning "Database health check failed"
    fi
    
    # Check backend
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        log "✓ Backend is healthy"
    else
        warning "Backend health check failed"
    fi
    
    # Check frontend
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log "✓ Frontend is healthy"
    else
        warning "Frontend health check failed"
    fi
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    docker-compose -f $COMPOSE_FILE exec server npx prisma migrate deploy
    docker-compose -f $COMPOSE_FILE exec server npx prisma generate
    log "Database migrations completed"
}

# Show logs
show_logs() {
    log "Showing service logs..."
    docker-compose -f $COMPOSE_FILE logs -f
}

# Stop services
stop() {
    log "Stopping services..."
    docker-compose -f $COMPOSE_FILE down
    log "Services stopped"
}

# Clean up
cleanup() {
    log "Cleaning up..."
    docker-compose -f $COMPOSE_FILE down --volumes --remove-orphans
    docker system prune -f
    log "Cleanup completed"
}

# Main script
main() {
    log "Workout Tracker Deployment Script"
    log "Environment: $ENVIRONMENT"
    
    check_docker
    check_env_files
    
    case "${2:-deploy}" in
        deploy)
            deploy
            ;;
        migrate)
            run_migrations
            ;;
        logs)
            show_logs
            ;;
        stop)
            stop
            ;;
        cleanup)
            cleanup
            ;;
        *)
            echo "Usage: $0 [dev|prod] [deploy|migrate|logs|stop|cleanup]"
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 