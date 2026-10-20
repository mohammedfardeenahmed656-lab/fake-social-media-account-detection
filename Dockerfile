FROM node:22-alpine

WORKDIR /app

# Copy application sources
COPY package.json ./
COPY server.js data.js app.js styles.css index.html ./
COPY data/ ./data/
COPY python/ ./python/
COPY test/ ./test/

# Non-root secure user
USER node

EXPOSE 3000

ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
