# Private Cloud Storage

Personal cloud storage you host yourself. Upload from your phone, keep files in folders, and download them from anywhere -- all under your control.

## Features

- **Direct S3 uploads** -- files go straight to your bucket, not through the server
- **Nested folders** -- organize files however you want
- **Grid and list views** -- switch layouts to suit your preference
- **File operations** -- rename, move, delete, and download
- **Upload progress** -- real-time progress tracking for every file
- **Storage stats** -- see total size, file count, and folder count at a glance
- **Context menu** -- right-click on any item for quick actions
- **Two-layer auth** -- optional gate secret plus password-based JWT sessions
- **Mobile-first dark UI** -- built for phones, works great on desktop

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** with dark theme
- **MongoDB** (Mongoose) for file/folder metadata
- **AWS S3** (SDK v3) for file storage with presigned URLs
- **JWT** (jose) for authentication with httpOnly cookies

## Prerequisites

1. **AWS S3 bucket** (general purpose)
2. **AWS IAM user** with S3 permissions (PutObject, GetObject, DeleteObject, ListBucket)
3. **MongoDB Atlas** cluster (or any MongoDB instance)

## Local Setup

1. Clone and install:

```bash
git clone https://github.com/Tiz20lion/private-cloud-storage
cd private-cloud-storage
npm install
```

2. Copy `example.env` to `.env.local` and fill in your values:

```env
MONGODB_URI=your_mongodb_connection_string
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name
ACCESS_PASSWORD=your_secure_password
JWT_SECRET=your_random_jwt_secret_at_least_32_chars
GATE_SECRET=optional_gate_secret_key
```

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `AWS_ACCESS_KEY_ID` | Yes | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | Yes | IAM user secret key |
| `AWS_REGION` | Yes | S3 bucket region |
| `AWS_S3_BUCKET` | Yes | S3 bucket name |
| `ACCESS_PASSWORD` | Yes | Password to log in |
| `JWT_SECRET` | Yes | Random string, at least 32 characters |
| `GATE_SECRET` | No | If set, users need `?key=<secret>` to access the app |

3. Set S3 CORS on your bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedOrigins": ["http://localhost:3000", "https://your-production-url.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

4. Run the app:

```bash
npm run dev
```

Open http://localhost:3000 and log in with the `ACCESS_PASSWORD` you set.

## Project Structure

```
src/
  app/
    api/
      auth/          Login, logout, session check
      items/         CRUD operations, upload, download, move, rename
      storage/       Storage usage stats
    gate/            Landing page
    login/           Login page
    page.tsx         Main file browser
  components/        FileBrowser, FileItemCard, Breadcrumbs, dialogs, etc.
  hooks/             useItems (data fetching), useUpload (upload logic)
  lib/               auth, s3, mongodb, utils
  models/            Mongoose schema for files and folders
  proxy.ts           Middleware for gate and auth protection
```

## How Uploads Work

1. Client requests a presigned upload URL from the server
2. Server creates a pending item record in MongoDB and returns the presigned S3 URL
3. Client uploads the file directly to S3 (no server relay)
4. Client confirms the upload, server marks the item as complete

This keeps the server lightweight since files never pass through it.

## Deploying to Vercel

1. Push this repo to GitHub
2. Import it into Vercel
3. Add all environment variables from `.env.local` in Vercel project settings
4. Update S3 CORS `AllowedOrigins` to include your Vercel URL
5. Deploy

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
