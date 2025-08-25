# Supabase Database Connection with Prisma

## Overview
This guide explains how to connect to a Supabase PostgreSQL database using Prisma ORM.

## Connection Types

### 1. Direct Connection (Port 5432)
Used for migrations and database administration:
```
postgresql://[USER]:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

### 2. Pooler Connection (Port 6543) - Recommended
Used for application queries with connection pooling:
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

## Setup Steps

### 1. Install Dependencies
```bash
npm install prisma @prisma/client
npm install -D prisma
```

### 2. Initialize Prisma
```bash
npx prisma init
```

### 3. Configure Environment Variables
Create a `.env` file with your database URL:
```env
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

### 4. Configure Prisma Schema
In `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 5. Generate Prisma Client
```bash
npx prisma generate
```

### 6. Run Migrations
```bash
npx prisma migrate dev
```

## Connection Parameters Explained

- **pgbouncer=true**: Enables PgBouncer connection pooling
- **connection_limit=1**: Limits connections per client (important for serverless)
- **pool_timeout=0**: Disables timeout (optional)

## Troubleshooting

### Connection Issues
1. **Network Unreachable**: Check internet connection and firewall settings
2. **Authentication Failed**: Verify credentials in Supabase dashboard
3. **Database Paused**: Unpause database in Supabase dashboard (free tier pauses after 7 days of inactivity)

### Common Errors

#### P1001: Can't reach database server
- Switch from direct connection (port 5432) to pooler connection (port 6543)
- Check if database is active in Supabase dashboard
- Verify network connectivity

#### P1002: Database server timeout
- Use pooler connection with `?pgbouncer=true`
- Add `&pool_timeout=0` to connection string

## Best Practices

1. **Use Pooler for Applications**: Always use the pooler connection (port 6543) for application queries
2. **Environment Variables**: Never commit credentials to version control
3. **Connection Limits**: Set appropriate connection limits for your use case
4. **SSL**: Supabase enforces SSL by default for security

## Example Usage

```javascript
// prisma/prisma.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;
```

```javascript
// Using in your application
import prisma from './prisma/prisma.js';

async function createUser(data) {
  return await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
    }
  });
}
```

## Resources

- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)