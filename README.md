# Private Cloud Storage

Self-hosted cloud storage: upload from your phone, organize in folders, download anywhere. Files go to your S3 bucket; metadata lives in MongoDB.

## Quick links

- **Landing:** `/` or `/gate`
- **Login:** `/login` — use the password you set in `ACCESS_PASSWORD`

## Install locally

1. Clone, install, and copy env:

```bash
git clone https://github.com/Tiz20lion/private-cloud-storage
cd private-cloud-storage
npm install
cp example.env .env.local
```

2. Edit `.env.local` with your MongoDB URI, AWS keys, bucket name, region, `ACCESS_PASSWORD`, and a long random `JWT_SECRET`. Optional: `GATE_SECRET` to protect the app behind `?key=your_secret`.

3. In your S3 bucket, set CORS to:

```json
[{"AllowedHeaders":["*"],"AllowedMethods":["GET","PUT","HEAD"],"AllowedOrigins":["http://localhost:3000","https://your-vercel-url.vercel.app"],"ExposeHeaders":["ETag"],"MaxAgeSeconds":3000}]
```

4. Run:

```bash
npm run dev
```

Open http://localhost:3000 (or http://localhost:3000/login) and sign in with `ACCESS_PASSWORD`.

## Deploy on Vercel

1. Push the repo to GitHub and import it in Vercel.
2. In the Vercel project, add the same env vars as in `.env.local`.
3. In S3 CORS, add your Vercel URL (e.g. `https://your-app.vercel.app`) to `AllowedOrigins`.
4. Deploy.

Your app URL will be something like `https://your-app.vercel.app`. Open `/login` to sign in.

## What you need

- AWS S3 bucket + IAM user with S3 access (PutObject, GetObject, DeleteObject, ListBucket)
- MongoDB Atlas (or any MongoDB)
- Node 18+
