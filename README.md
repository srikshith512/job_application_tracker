# Job Application Tracker

A full-stack MERN job application tracker with React, Node.js, Express, MongoDB Atlas, JWT authentication, protected REST API routes, CRUD actions, filtering, and a responsive dashboard UI.

## Run It Locally

1. Install dependencies:

```bash
npm.cmd run install:all
```

2. Create environment files:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

3. Edit `backend/.env` and add your MongoDB Atlas connection string:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/job_tracker?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

4. Start backend in one terminal:

```bash
npm.cmd run dev:backend
```

5. Start frontend in another terminal:

```bash
npm.cmd run dev:frontend
```

6. Open:

```text
http://localhost:5173
```

## How It Works

The frontend stores the JWT token after login/register and sends it as `Authorization: Bearer <token>` on API calls. The backend verifies that token with middleware before allowing access to job applications. Every application is saved with the logged-in user's ID, so each user only sees their own records.

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/applications`
- `POST /api/applications`
- `PUT /api/applications/:id`
- `DELETE /api/applications/:id`
- `GET /api/applications/stats`

## Demo Data

After configuring `backend/.env`, run:

```bash
npm.cmd run seed --prefix backend
```

Then login with:

```text
demo@example.com
password123
```
