# NoxPrompts 🔥

Trending AI Art Prompts website — built with Next.js, Vercel KV, Cloudinary.

## Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Vercel KV (Redis)
- **Images**: Cloudinary (free 25GB)
- **Hosting**: Vercel
- **Domain**: noxzone111.online (GoDaddy)

## Setup Steps

### 1. Push to GitHub
Upload all files to your `GodLuciferz/noxprompts` repo.

### 2. Deploy on Vercel
1. Go to vercel.com → New Project
2. Import `GodLuciferz/noxprompts`
3. Click Deploy

### 3. Add Vercel KV Database
1. In Vercel dashboard → Storage → Create Database → KV
2. Connect to your project
3. Environment variables auto-added ✅

### 4. Add Cloudinary
1. Sign up at cloudinary.com (free)
2. Get Cloud Name, API Key, API Secret
3. Add to Vercel: Settings → Environment Variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `ADMIN_PASSWORD` = @noxstudio123

### 5. Connect GoDaddy Domain
In Vercel → Settings → Domains → Add `noxzone111.online`

Then in GoDaddy DNS:
- Delete existing A record
- Add: Type=A, Name=@, Value=76.76.21.21
- Add: Type=CNAME, Name=www, Value=cname.vercel-dns.com

### 6. Access Admin Panel
Go to: `noxzone111.online/admin`
Password: `@noxstudio123`

## Features
- 🔥 Trending badge system
- 🎨 Category filters (Anime, Ghibli, Realistic, Dark, etc.)
- 🔍 Search bar
- 📋 One-click prompt copy
- 📊 Copy count tracker
- 📱 WhatsApp/Instagram share (image preview, no prompt leak)
- 🌙 Dark/Light theme toggle
- ⚡ Auto SEO pages per trend
- 🖼️ Cloudinary image optimization
