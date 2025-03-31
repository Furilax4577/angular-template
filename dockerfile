# ---------- STAGE 1 : build Angular SSR ----------
    FROM node:20-alpine AS builder

    ARG BASE_URL
    ENV BASE_URL=$BASE_URL

    WORKDIR /app
    
    # Copier package.json et installer dépendances
    COPY package*.json ./
    RUN npm install
    
    # Copier tout le code
    COPY . .
    
    # Build Angular SSR (browser + server)
    RUN npm run build
    
    # ---------- STAGE 2 : production image ----------
    FROM node:20-alpine AS app
    
    WORKDIR /app
    
    # Copier le dist Angular SSR depuis le builder
    COPY --from=builder /app/dist /app/dist
    COPY --from=builder /app/node_modules /app/node_modules
    COPY --from=builder /app/package.json /app/package.json
    
    # Lancer l'app SSR
    CMD ["npm", "run", "serve:ssr:angular-project"]
    