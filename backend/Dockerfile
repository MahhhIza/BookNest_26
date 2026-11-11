
FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm ci

# Copia o código do backend
COPY . .

# Compila o TypeScript
RUN npm run build

EXPOSE 3001

# Inicia a aplicação
CMD ["npm", "start"]