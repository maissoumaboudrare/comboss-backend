FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# vérif hono build
# RUN npm run build
EXPOSE 3010
CMD ["npm", "run", "dev"]