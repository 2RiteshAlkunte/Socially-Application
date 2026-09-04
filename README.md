# 3W Social Post Application

A full-stack mini social feed built for the 3W Full Stack Internship Assignment.

## Stack

- Frontend: React + Vite + Material UI
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Authentication: JWT + bcrypt
- Image uploads: Cloudinary
- Deployment: Vercel (frontend) + Render (backend)

## Features

- Signup/login with email and password
- JWT-protected routes
- Create text-only, image-only, or text + image posts
- Public paginated feed
- Like/unlike posts
- Add comments
- Like/comment usernames are embedded in the `posts` collection
- Responsive Material UI
- Optimistic like updates
- Loading/error/empty states

## MongoDB collections

Exactly two application collections are used:

1. `users`
2. `posts`

Likes and comments are embedded inside posts, so no separate collections are created for them.

## Local setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Fill in `.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=use_a_long_random_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set:

```env
VITE_API_URL=http://localhost:5000/api
```

Open the Vite URL shown in the terminal.

## MongoDB Atlas

1. Create a free MongoDB Atlas cluster.
2. Create a database user.
3. Add your development IP address to Network Access.
4. Copy the Node.js connection string.
5. Put it in `MONGODB_URI`.
6. For Render, allow the Render server to access Atlas. For a simple internship deployment, Atlas Network Access can use `0.0.0.0/0`, but use strong credentials and understand that this exposes the database endpoint to the internet.

The database name used here is `threew_social`.

## Cloudinary

Create a Cloudinary account and copy:

- Cloud name
- API key
- API secret

Put them in the backend `.env`.

Images are uploaded to Cloudinary and only the resulting URL is stored in MongoDB.

## Deployment

### Backend on Render

Create a new Web Service from the GitHub repository.

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Environment variables:

```env
PORT=5000
MONGODB_URI=...
JWT_SECRET=...
CLIENT_URL=https://YOUR-FRONTEND.vercel.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Render provides the public backend URL, for example:

`https://your-app.onrender.com`

### Frontend on Vercel

Import the GitHub repository.

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

Environment variable:

```env
VITE_API_URL=https://your-app.onrender.com/api
```

Redeploy after setting the variable.

## Suggested demo flow

1. Create account.
2. Log in.
3. Create a text post.
4. Create a post with an image.
5. Open the app from another account/browser.
6. Like a post.
7. Add a comment.
8. Refresh and verify data persisted.
9. Test the deployed URLs on mobile width.

## Important

Do not commit `.env` files. They are ignored by `.gitignore`.
