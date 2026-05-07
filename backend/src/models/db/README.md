# Database

## Features

- MySQL database connection using `mysql2`
- Connection pooling
- Query helper utilities (`query`, `queryOne`)
- Automated database setup (schema + seed data)

## 🛠️ Tech Stack

- Node.js
- MySQL
- dotenv
- mysql2

## Get started

Install dependencies:

```bash
npm install
```

Create a `.env` file in the mursu-sushi-restaurant/backend/ - Use the .env.example as base for it.

## 🗄️ Database Setup

Run the setup script:

```bash
npm run db:setup
```

This will:

1. Create database user mursu_user (admin phase)
2. Create tables
3. Insert lookup data
4. Insert dummy data

## Database Usage

### Query multiple rows

```js
import { query } from './path/to/query.js';

const users = await query('SELECT * FROM users');
```

### Query single row

```js
import { queryOne } from './path/to/query.js';

const user = await queryOne('SELECT * FROM users WHERE id = ?', [1]);
```

## Structure

```
src/
  models/
    db/
      schemas/
        01_mursu_user.sql
        02_tables.sql
        03_lookup_tables.sql
        04_dummy_data.sql
        setup.db.js
      connection.js
      db.js
```

## Notes

- `multipleStatements: true` is enabled — be cautious with raw SQL input
- Never commit your `.env` file
