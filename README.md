# Private Cloud Storage

Personal cloud storage you host yourself. Upload from your phone, keep files in folders, and download them from anywhere.

## What it does

- Upload any file type using direct to S3 upload
- Organize files in nested folders
- Switch between grid and list view
- Rename, move, and delete files and folders
- See upload progress and simple storage stats
- Mobile first dark UI with one password to log in

## What you need

1. AWS S3 bucket (general purpose)
2. AWS IAM user with S3 access (put, get, delete objects)
3. MongoDB Atlas cluster

## Local setup

1. Clone and install:

```bash
git clone https://github.com/Tiz20lion/private-cloud-storage
cd private-cloud-storage
npm install
```

2. Create `.env.local` with:

```env
MONGODB_URI=your_mongodb_connection_string
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name
ACCESS_PASSWORD=your_secure_password
JWT_SECRET=your_random_jwt_secret_at_least_32_chars
```

3. Set S3 CORS on your bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedOrigins": ["http://localhost:3000"],
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

## Deploying

1. Push this repo to GitHub
2. Import it into Vercel
3. Add the same environment variables in Vercel project settings
4. Update S3 CORS `AllowedOrigins` to also include your Vercel url
5. Deploy from Vercel

