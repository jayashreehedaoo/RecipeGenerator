# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Steps

### 1. **Fix Environment Variables**
Your `.env` file currently uses local SQLite. For production, you need to:

```bash
# Update .env to use Turso (uncomment these lines):
DATABASE_URL="libsql://recipe-generator-jayashreehedaoo.aws-ap-south-1.turso.io"
DATABASE_AUTH_TOKEN="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9..."
```

**Or create a `.env.local` for local dev and `.env.production` for Vercel:**

`.env.local` (for local development - KEEP THIS):
```bash
DATABASE_URL="file:./dev.db"
```

`.env.production` (for Vercel - CREATE THIS):
```bash
DATABASE_URL="libsql://recipe-generator-jayashreehedaoo.aws-ap-south-1.turso.io"
DATABASE_AUTH_TOKEN="your-turso-auth-token-here"
```

### 2. **Test Production Build Locally**
```bash
# Run a production build to catch errors
npm run build

# If build succeeds, test it locally
npm run start
```

### 3. **Verify Database Schema in Turso**
Make sure your Turso database has the latest schema:

```bash
# Push schema to Turso (with environment variables set)
npx drizzle-kit push
```

### 4. **Check Critical Files**

✅ `.gitignore` - Properly excludes:
   - `.env*` (environment files)
   - `*.db` (local database files)
   - `.npmrc` (npm config with credentials)
   - `node_modules`

✅ `.vercelignore` - Should exist (MISSING - CREATE IT):
```
.npmrc
dev.db
*.db
test-db.ts
node_modules
.env.local
```

✅ `package.json` - Has correct build script:
   - `"build": "next build"` ✓

### 5. **Seed Production Database (Optional)**
If you want sample data in production:

```bash
# Temporarily set production DATABASE_URL in .env
# Then run seed script if you have one
npm run seed
```

---

## 🔧 Files to Create/Update Before Deploy

### Create `.vercelignore` file:
```
# Exclude these from Vercel deployment
.npmrc
dev.db
*.db
*.db-*
test-db.ts
.env.local
node_modules
.git
```

### Update `.gitignore` (already good ✓):
Your `.gitignore` already properly excludes sensitive files.

---

## 📦 Vercel Deployment Steps

### Option 1: Deploy via Vercel CLI
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (will prompt for project setup)
vercel

# Or deploy to production directly
vercel --prod
```

### Option 2: Deploy via GitHub (Recommended)
1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Complete Recipe CRUD implementation"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure build settings (should auto-detect Next.js)

3. **Set Environment Variables in Vercel:**
   - In Vercel Dashboard → Project Settings → Environment Variables
   - Add these variables:
     ```
     DATABASE_URL=libsql://recipe-generator-jayashreehedaoo.aws-ap-south-1.turso.io
     DATABASE_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
     ```
   - Set for: Production, Preview, Development

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

---

## 🧪 Post-Deployment Verification

After deployment, test these features:

### Inventory System:
- [ ] View inventory items
- [ ] Add new item
- [ ] Edit existing item
- [ ] Delete item
- [ ] Bulk delete
- [ ] Search/filter/sort works

### Recipe System:
- [ ] View recipes
- [ ] Add new recipe
- [ ] Edit recipe
- [ ] Delete recipe
- [ ] Toggle save/favorite
- [ ] Search by name/ingredients
- [ ] Filter by category (All, Saved, AI, Breakfast, etc.)
- [ ] Sort (newest, oldest, name, quickest, calories)

### General:
- [ ] No console errors
- [ ] Loading states work
- [ ] Error boundaries catch errors
- [ ] All images load
- [ ] Navigation works

---

## ⚠️ Common Issues & Solutions

### Issue: Build fails with "Cannot find module '@/db'"
**Solution:** Ensure `tsconfig.json` has correct path alias:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Database connection errors
**Solution:** 
- Verify `DATABASE_URL` and `DATABASE_AUTH_TOKEN` are set in Vercel
- Ensure Turso database is accessible (not paused/deleted)
- Check Turso dashboard for connection issues

### Issue: "Module not found" errors
**Solution:** 
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Type errors in production
**Solution:**
```bash
# Run type check
npm run build

# Fix any TypeScript errors shown
```

---

## 📝 Quick Deploy Commands

```bash
# 1. Fix TypeScript errors
npm run build

# 2. Create .vercelignore file (see content above)

# 3. Update environment for production
# Edit .env to use Turso DATABASE_URL and DATABASE_AUTH_TOKEN

# 4. Test build again
npm run build && npm run start

# 5. Deploy to Vercel
vercel --prod
# OR push to GitHub and deploy via Vercel dashboard
```

---

## 🎉 You're Ready When:

✅ `npm run build` completes without errors  
✅ `.vercelignore` file created  
✅ Environment variables updated for Turso  
✅ Database schema pushed to Turso  
✅ All TypeScript errors fixed  
✅ Local production build tested  

**Then proceed with Vercel deployment!**
