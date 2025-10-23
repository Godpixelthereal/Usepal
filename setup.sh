#!/bin/bash

# Install dependencies
npm install next react react-dom
npm install tailwindcss postcss autoprefixer
npm install react-icons chart.js react-chartjs-2

# Initialize Tailwind CSS
npx tailwindcss init -p

# Create necessary directories
mkdir -p styles
mkdir -p components
mkdir -p pages
mkdir -p data
mkdir -p public

echo "Setup completed successfully!"