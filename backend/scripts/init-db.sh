#!/bin/bash

# Create database
psql -U postgres -c "CREATE DATABASE aidocs_assistant;"

# Run migrations
psql -U postgres -d aidocs_assistant -f src/db/migrations/001_initial_schema.sql

echo "Database initialized successfully!" 