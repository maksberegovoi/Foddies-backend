# Foddies API

Backend API for a recipe-sharing platform with user accounts, social features, recipe favorites, media uploads, and reference data such as categories, areas, ingredients, and testimonials. The service exposes a versioned REST API, persists data with Prisma and PostgreSQL, and ships with generated OpenAPI documentation.

---

## Tech Stack

- Runtime: Node.js
- Language: TypeScript
- Framework: Express 5
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- API documentation: Swagger UI + `@asteasolutions/zod-to-openapi`
- Authentication: JWT with HTTP-only auth cookie support and Bearer token support
- File uploads: Multer + Cloudinary
- Logging: Morgan
- Code quality: ESLint, Prettier, Husky, lint-staged
- CI: GitHub Actions

---

## Project Structure

```text
.
├── prisma/
│   ├── migrations/          # Prisma migration history
│   └── schema.prisma        # Database schema
├── src/
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Sign-up, sign-in, sign-out
│   │   ├── user/            # Current user, profiles, followers, avatar upload
│   │   ├── recipes/         # Recipe listing, filtering, favorites, creation, deletion
│   │   ├── categories/      # Recipe categories
│   │   ├── ingredients/     # Ingredients catalog
│   │   ├── areas/           # Areas / cuisines reference data
│   │   └── testimonials/    # Testimonials feed
│   ├── prisma/
│   │   ├── data/            # Seed JSON datasets
│   │   └── seed.ts          # Prisma seed script
│   ├── shared/
│   │   ├── api-docs/        # OpenAPI registry and Swagger wiring
│   │   ├── fileUpload/      # Cloudinary helpers
│   │   └── http/            # Errors, middleware, schemas, shared HTTP types
│   ├── app.ts               # Express app configuration
│   ├── env.ts               # Environment variable validation
│   ├── prisma.ts            # Prisma client bootstrap
│   ├── router.ts            # Main API router
│   └── server.ts            # Server startup and graceful shutdown
├── .env.example             # Example environment configuration
├── package.json             # Scripts and dependencies
└── tsconfig.json            # TypeScript configuration
```

Each feature module follows a consistent pattern built around `router`, `controller`, `service`, `dto`, `schema`, and `swagger` files.

---

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Foddies-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
cp .env.example .env
```

4. Update `.env` with working local values, especially `DATABASE_URL`, `JWT_SECRET`, and Cloudinary credentials if you want upload endpoints to work.

5. Apply database migrations:

```bash
npm run prisma:migrate:dev
```

6. Optionally seed the database:

```bash
npm run prisma:seed
```

If you want a shorter setup path, the repository also provides:

```bash
npm run setup
```

That script runs `npm install` and `prisma migrate dev`.

---

## Environment Variables

The application validates environment variables in `src/env.ts`.

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | Yes | HTTP port used by the Express server. |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs. |
| `JWT_EXPIRES_IN` | Yes | JWT lifetime. Allowed values: `15m`, `30m`, `1h`, `7d`, `30d`. |
| `NODE_ENV` | Yes | Runtime mode. Allowed values: `dev`, `production`. |
| `CORS_ALLOWED_ORIGINS` | Yes | Allowed frontend origins. Supports `*`, a single URL, or comma-separated URLs. |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name for avatar and recipe image uploads. |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret. |
| `AUTH_COOKIE_NAME` | No | Cookie name for the auth token. Defaults to `accessToken`. |
| `AUTH_COOKIE_DOMAIN` | No | Optional cookie domain override. |

Example:

```env
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET=secret-key
JWT_EXPIRES_IN=1h
NODE_ENV=dev
CORS_ALLOWED_ORIGINS=http://localhost:3000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Running the Project

Development mode:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Run the compiled server:

```bash
npm start
```

The API is mounted under:

```text
/api/v1
```

With the default example port, the base URL is:

```text
http://localhost:3000/api/v1
```

---

## Database

- Prisma schema lives in `prisma/schema.prisma`.
- The configured database provider is PostgreSQL.
- Prisma client is initialized in `src/prisma.ts` and connected during server startup.
- Migration history is stored in `prisma/migrations`.

Useful commands:

```bash
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:migrate:deploy
npm run prisma:studio
npm run prisma:seed
```

Seed behavior:

- The seed script is `src/prisma/seed.ts`.
- It loads JSON data from `src/prisma/data`.
- It clears existing `testimonial`, `recipe`, `ingredient`, `area`, `category`, and `user` records before re-inserting seed data.

### Database Models

- `User`: account data, avatar, stored token, follow graph, owned recipes, favorite recipes
- `Recipe`: recipe content, owner, category, area, image, favorites
- `Category`: recipe category reference data
- `Area`: area / cuisine reference data
- `Ingredient`: ingredient catalog
- `RecipeIngredient`: join table between recipes and ingredients with `measure`
- `Testimonial`: testimonial content

---

## API Overview

Base path: `/api/v1`

### Auth

- `POST /auth/signup`
- `POST /auth/signin`
- `POST /auth/signout`

### Users

- `GET /users/current`
- `GET /users/:id`
- `GET /users/:id/followers`
- `GET /users/:id/following`
- `POST /users/:id/follow`
- `DELETE /users/:id/follow`
- `PATCH /users/avatar`

### Recipes

- `GET /recipes`
- `GET /recipes/my`
- `GET /recipes/popular`
- `GET /recipes/favorite`
- `GET /recipes/:id`
- `POST /recipes/:id/favorite`
- `DELETE /recipes/:id/favorite`
- `POST /recipes`
- `DELETE /recipes/:id`

### Categories

- `GET /categories`

### Ingredients

- `GET /ingredients`

### Areas

- `GET /areas`

### Testimonials

- `GET /testimonials`

### Request Notes

- Authenticated endpoints use `authenticateMiddleware`.
- Authentication accepts either:
  - `Authorization: Bearer <token>`
  - the HTTP-only auth cookie set during sign-in
- `GET /recipes` supports filtering with `authorId`, `categoryId`, `areaId`, `ingredientIds`, `page`, and `limit`.
- `GET /recipes/my`, `GET /recipes/favorite`, `GET /users/:id/followers`, and `GET /users/:id/following` support `page` and `limit`.
- `GET /recipes/popular` and `GET /testimonials` support `limit`.
- `POST /recipes` expects `multipart/form-data` with an `image` file and recipe fields. The `ingredients` field is parsed as JSON.
- `PATCH /users/avatar` expects `multipart/form-data` with an `avatar` file.

---

## API Documentation

Swagger UI is available at:

```text
http://localhost:<PORT>/api-docs
```

The raw OpenAPI JSON is available at:

```text
http://localhost:<PORT>/api-docs-json
```

With the default example port, that is:

```text
http://localhost:3000/api-docs
http://localhost:3000/api-docs-json
```

---

## Scripts

| Script | Description |
| --- | --- |
| `npm run setup` | Installs dependencies and runs `prisma migrate dev`. |
| `npm run dev` | Starts the server in watch mode with `tsx`. |
| `npm run build` | Compiles TypeScript to `dist/`. |
| `npm start` | Runs the compiled server from `dist/server.js`. |
| `npm run lint` | Runs ESLint. |
| `npm run lint:fix` | Runs ESLint with auto-fix. |
| `npm run format` | Formats the codebase with Prettier. |
| `npm run format:check` | Checks formatting without writing changes. |
| `npm run typecheck` | Runs TypeScript type-checking without emitting files. |
| `npm run prisma:studio` | Opens Prisma Studio. |
| `npm run prisma:generate` | Generates Prisma Client. |
| `npm run prisma:migrate:dev` | Creates/applies migrations in development. |
| `npm run prisma:migrate:deploy` | Applies existing migrations, intended for deployed environments. |
| `npm run prisma:seed` | Runs the Prisma seed script. |
| `npm run prepare` | Installs Husky hooks. |

---

## Development Notes

- The codebase is organized by feature module rather than by technical layer across the whole app.
- Request validation is handled with Zod schemas close to each module.
- OpenAPI docs are generated from the same Zod-based contracts used by the API.
- Errors are normalized through `ApiError`, Zod error handling, and Prisma error handling in a single Express error middleware.
- File uploads are stored in memory with Multer and then uploaded to Cloudinary.
- CORS is configured from `CORS_ALLOWED_ORIGINS` and enables credentials.
- The project includes graceful shutdown logic that closes the HTTP server and disconnects Prisma on `SIGINT` and `SIGTERM`.
- Pre-commit formatting/linting is enabled through Husky and lint-staged.
- Formatting conventions in `.prettierrc`: 4 spaces, single quotes, no semicolons, `printWidth: 80`.
- ESLint enforces TypeScript rules including `consistent-type-imports` and unused variable checks.
- CI runs on pull requests to `dev` and `main`, and checks linting, formatting, type safety, Prisma generation, migration deploy, and build.
- No automated test script is currently configured in `package.json`.

---

## Contribution

Recommended workflow:

1. Branch from `dev`.
2. Make your changes in small, reviewable commits.
3. Run the local quality checks before opening a PR:

```bash
npm run lint
npm run format:check
npm run typecheck
npm run build
```

4. Open a pull request for review.

Because Husky runs `lint-staged` on pre-commit, staged `*.ts` and `*.js` files are auto-linted and formatted before the commit completes.
