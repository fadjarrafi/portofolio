FROM oven/bun:1.3.7-alpine AS builder
WORKDIR /app

COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile

COPY . .
ARG PUBLIC_GA_ID=""
ENV NODE_ENV=production
ENV PUBLIC_GA_ID=$PUBLIC_GA_ID
RUN bun run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
