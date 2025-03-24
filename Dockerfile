# Install dependencies only when needed
FROM node:20.11.1-alpine AS deps
ARG NEXT_PUBLIC_API_URL
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# Production image, copy all the files and run next
FROM node:20.11.1-alpine AS runner
ARG NEXT_PUBLIC_API_URL
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV production

RUN npm run build

FROM nginx:alpine as last

WORKDIR /usr/share/nginx/

RUN rm -rf html
RUN mkdir html

WORKDIR /

COPY ./nginx/nginx.conf /etc/nginx

COPY --from=runner /app/dist /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
