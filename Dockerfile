# Use Node.js LTS (Long Term Support) version
FROM public.ecr.aws/docker/library/node:18-alpine


# Create app directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 