# Private Cloud Storage

A personal cloud storage app for uploading, organizing, and accessing files from any device. Built with Next.js 16, AWS S3, and MongoDB Atlas. Hosted on Vercel.

## Features

- Upload any file type with no size limit (direct-to-S3 via presigned URLs)
- Folder-based file organization with nested directories
- Grid and list view toggle
- Breadcrumb navigation
- Rename, move, and delete files/folders
- Upload progress tracking
- Storage usage stats
- Mobile-first responsive dark UI
- Simple password authentication with JWT sessions

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Storage**: AWS S3 (presigned URLs for upload/download)
- **Database**: MongoDB Atlas via Mongoose
- **Auth**: Password + JWT (jose) in HTTP-only cookie
- **UI**: Tailwind CSS + Lucide icons
- **Hosting**: Vercel

## Architecture

```
Phone/Browser
  |-- password login --> Vercel (Next.js API)
  |-- upload via presigned URL --> AWS S3
  |-- download via presigned URL --> AWS S3

Vercel (Next.js API)
  |-- metadata CRUD --> MongoDB Atlas
  |-- generate presigned URLs --> AWS S3
```

Files are uploaded directly from the browser to S3 using presigned PUT URLs. This bypasses Vercel's 4.5MB body limit and means no file size restriction. Downloads also use presigned GET URLs.

File metadata (name, folder structure, size, mime type) is stored in MongoDB. The S3 bucket uses a flat key structure (`files/{uuid}.{ext}`) while folder hierarchy lives only in the database.

## Prerequisites

1. **AWS S3 Bucket** with CORS configured
2. **AWS IAM User** with permissions: `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`
3. **MongoDB Atlas** free cluster

## Setup

1. Clone the repo and install dependencies:

```bash
git clone <your-repo-url>
cd private-cloud-storage
npm install
```

2. Copy `.env.local` and fill in your credentials:

```
MONGODB_URI=your_mongodb_connection_string
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name
ACCESS_PASSWORD=your_secure_password
JWT_SECRET=your_random_jwt_secret_at_least_32_chars
```

3. Configure S3 CORS on your bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedOrigins": ["http://localhost:3000", "https://your-domain.vercel.app"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

4. Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000` and log in with your `ACCESS_PASSWORD`.

## Deploy to Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. Add all environment variables from `.env.local` to the Vercel project settings
4. Update the S3 CORS `AllowedOrigins` to include your Vercel production URL
5. Deploy

## API Routes

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/login` | POST | Validate password, set JWT cookie |
| `/api/auth/logout` | POST | Clear cookie |
| `/api/auth/check` | GET | Verify session |
| `/api/items` | GET | List items in folder (`?parentId=xxx`) |
| `/api/items/folder` | POST | Create folder |
| `/api/items/upload` | POST | Get presigned S3 upload URL |
| `/api/items/upload/confirm` | POST | Confirm upload complete |
| `/api/items/[id]` | DELETE | Delete file/folder (recursive) |
| `/api/items/[id]/download` | GET | Get presigned download URL |
| `/api/items/[id]/rename` | PATCH | Rename item |
| `/api/items/[id]/move` | PATCH | Move item to another folder |
| `/api/storage` | GET | Storage usage stats |
