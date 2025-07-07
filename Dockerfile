# Build stage
FROM node:20.19-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
# Copy only package.json and yarn.lock first to leverage Docker cache
COPY package.json yarn.lock ./
# Install all dependencies (including dev dependencies needed for build)
RUN yarn install --frozen-lockfile

# Disable telemetry and set build environment variables
RUN yarn next telemetry disable
ENV NEXT_PUBLIC_ESLINT_DISABLE=true
ENV NEXT_PUBLIC_TYPESCRIPT_DISABLE=true
ENV NODE_ENV=production

# Copy application code
COPY . .

# Build the application
RUN yarn run build

# Production stage
FROM node:20.19-alpine AS runner

# Set working directory
WORKDIR /app

# Create a non-root user and switch to it for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

# Set environment variables
ENV NODE_ENV=production

# Copy only the necessary files from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/package.json /app/yarn.lock ./
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/tailwind.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/postcss.config.mjs ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile && \
    yarn cache clean

# Expose the port the app will run on
EXPOSE 3000

# Switch to non-root user
USER nextjs

# Start the application
CMD ["yarn", "start"]
