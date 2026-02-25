# Private Cloud Storage

A personal cloud storage app you host yourself. Upload files from your phone or computer, organize them in folders, and download them from anywhere. Your files are stored in your own AWS bucket; only you have the password. No subscription, no third-party storage.

## What you get

- Upload any file type (photos, documents, videos, etc.)
- Create folders and nest them like on your computer
- Switch between grid view and list view
- Rename, move, and delete files and folders
- See upload progress and how much storage you have used
- One password to log in; optional extra "gate" key for sharing a link only with people who have the key
- Mobile-friendly dark interface

## Where to open the app

After you run the app (locally or on Vercel):

| Page | URL | What it is |
|------|-----|------------|
| **Landing** | `https://your-site.com/` or `https://your-site.com/gate` | Intro and setup info |
| **Login** | `https://your-site.com/login` | Enter your password to access your files |

Use the password you set in `ACCESS_PASSWORD` in your environment variables.

---

## What you need before starting

You will need accounts and a few values. All of these have free tiers or free trials.

1. **Node.js** (version 18 or newer)  
   Used to run the app. Install from [nodejs.org](https://nodejs.org).

2. **MongoDB**  
   Stores folder structure and file metadata (names, sizes, types). The app does not store the actual file contents here. Easiest option: create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas), then copy the connection string.

3. **AWS (Amazon Web Services)**  
   Your actual files are stored in an S3 bucket. You need:
   - An S3 bucket (create one in the AWS S3 console).
   - An IAM user with permission to read/write/delete objects in that bucket. Create the user, enable "Programmatic access," then create an Access Key. You will get an **Access Key ID** and a **Secret Access Key**; put these in `.env.local` (see below).

4. **Git**  
   To clone the repo. Install from [git-scm.com](https://git-scm.com) if you do not have it.

---

## Install and run locally

### Step 1: Clone the repo and install dependencies

Open a terminal (Command Prompt, PowerShell, or Terminal on Mac/Linux) and run:

```bash
git clone https://github.com/Tiz20lion/private-cloud-storage
cd private-cloud-storage
npm install
```

Then copy the example environment file:

```bash
cp example.env .env.local
```

On Windows (Command Prompt) use instead:

```cmd
copy example.env .env.local
```

### Step 2: Fill in your environment variables

Open the file `.env.local` in a text editor. Replace every placeholder with your real values:

| Variable | What to put |
|----------|-------------|
| `MONGODB_URI` | Your MongoDB connection string (from Atlas: Connect → Connect your application → copy the URI and replace the password placeholder). |
| `AWS_ACCESS_KEY_ID` | The Access Key ID from the IAM user you created. |
| `AWS_SECRET_ACCESS_KEY` | The Secret Access Key from that same IAM user. |
| `AWS_REGION` | The region where your bucket lives (e.g. `us-east-1`). You see it in the S3 bucket URL or in the bucket’s properties. |
| `AWS_S3_BUCKET` | The exact name of your S3 bucket. |
| `ACCESS_PASSWORD` | A strong password that you will use to log in to the app. You will type this on the login page. |
| `JWT_SECRET` | Any long random string (at least 32 characters). Used to sign your session. You can generate one at [randomkeygen.com](https://randomkeygen.com) or use a long passphrase. |
| `GATE_SECRET` | Optional. If you set this, visitors must add `?key=your_gate_secret` to the URL to see the app. Leave it empty or remove the line if you do not need this. |

Save the file.

### Step 3: Set CORS on your S3 bucket

The browser needs permission to talk to your bucket for uploads and downloads. In the AWS S3 console:

1. Open your bucket.
2. Go to the **Permissions** tab.
3. Scroll to **Cross-origin resource sharing (CORS)** and click **Edit**.
4. Paste this (replace `https://your-vercel-url.vercel.app` with your real Vercel URL when you deploy; for local only you can keep just `http://localhost:3000`):

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://your-vercel-url.vercel.app"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

5. Save.

### Step 4: Run the app

In the project folder, run:

```bash
npm run dev
```

When it says the app is ready, open a browser and go to:

- **http://localhost:3000** (landing) or  
- **http://localhost:3000/login** (login page)

Log in with the password you set in `ACCESS_PASSWORD`.

---

## Deploy on Vercel (free tier)

Vercel hosts your app on the internet so you can use it from any device.

1. **Push the code to GitHub**  
   Create a new repository on GitHub, then in your project folder run (replace with your repo URL):

   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

2. **Import the project in Vercel**  
   Go to [vercel.com](https://vercel.com), sign in (e.g. with GitHub), click **Add New** → **Project**, and import your GitHub repo. Leave build settings as default (Vercel detects Next.js).

3. **Add environment variables**  
   In the Vercel project, open **Settings** → **Environment Variables**. Add the same variables you have in `.env.local`:  
   `MONGODB_URI`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`, `ACCESS_PASSWORD`, `JWT_SECRET`, and optionally `GATE_SECRET`. Paste the same values you use locally.

4. **Update S3 CORS**  
   After the first deploy, Vercel will give you a URL like `https://your-app.vercel.app`. In your S3 bucket CORS (Step 3 above), add this URL to `AllowedOrigins` next to `http://localhost:3000`, then save.

5. **Deploy**  
   Vercel deploys automatically when you push. Your app will be at `https://your-app.vercel.app`. Open **https://your-app.vercel.app/login** and log in with `ACCESS_PASSWORD`.

---

## Useful commands

| Command | Use it when |
|---------|--------------|
| `npm run dev` | You want to run the app on your machine (development). |
| `npm run build` | You want to check that the app builds (e.g. before pushing). |
| `npm run start` | You want to run the built app locally (after `npm run build`). |
| `npm run lint` | You want to check code style. |

---

## Summary

- **Local:** Clone → `npm install` → copy `example.env` to `.env.local` → fill env vars → set S3 CORS → `npm run dev` → open http://localhost:3000/login and log in.
- **Online:** Push to GitHub → import repo in Vercel → add env vars → add Vercel URL to S3 CORS → deploy. Then open `https://your-app.vercel.app/login` and log in.

If something does not work, double-check that every value in `.env.local` is correct (no extra spaces, the MongoDB password in the URI is URL-encoded if it has special characters) and that S3 CORS includes the exact URL you are using (e.g. `http://localhost:3000` for local, your Vercel URL for production).
