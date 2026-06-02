FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
RUN corepack enable pnpm && pnpm install --ignore-scripts --no-frozen-lockfile

COPY . .
ENV NODE_ENV=production
RUN pnpm build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
