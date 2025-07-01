#!/bin/bash

echo "Starting Jekyll blog locally..."
echo "This script helps you run your blog locally."
echo ""

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "Docker is available. Using Docker for best compatibility."
    echo "Starting Jekyll at http://localhost:4000"
    echo ""
    docker run --rm \
        --volume="$PWD:/srv/jekyll:Z" \
        --publish 4000:4000 \
        jekyll/jekyll:4.2.2 \
        jekyll serve --watch --port 4000 --host 0.0.0.0 --livereload
else
    echo "Docker not found. Please install Docker Desktop for macOS from:"
    echo "https://www.docker.com/products/docker-desktop/"
    echo ""
    echo "Alternatively, you can try:"
    echo "1. Install rbenv or rvm to manage Ruby versions"
    echo "2. Install Ruby 3.0 or later"
    echo "3. Run: bundle install"
    echo "4. Run: bundle exec jekyll serve"
fi