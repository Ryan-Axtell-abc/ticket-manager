FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
#RUN npm run build

# Install serve globally
#RUN npm install -g serve

# Expose port 3000
#EXPOSE 3000

# Start serving the built app
#CMD ["serve", "-s", "dist", "-l", "3000"]


EXPOSE 5173

# Run Vite dev server (not build + serve)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]