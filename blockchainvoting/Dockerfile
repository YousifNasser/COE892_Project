# Step 1: Use an official node image as a base
FROM node:20

# Step 2: Set up working directory for your app
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Install Truffle and Ganache globally
RUN npm install -g truffle
RUN npm install -g ganache-cli

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Expose the necessary ports
EXPOSE 3000 8545

# Step 7: Use a startup script to ensure the correct execution order
CMD ["sh", "-c", "ganache-cli -p 8545 -h 127.0.0.1 & sleep 5 && truffle migrate --reset && npm run dev"]
