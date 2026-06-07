# Cracklix | Punjab Exam Authority Hub

Punjab's most advanced government exam preparation platform. Designed for aspirants, built with institutional integrity.

## 🚀 Key Features
- **High-Fidelity CBT Engine**: Real-time evaluation with bilingual support (EN/PA).
- **Atomic Question Bank**: 10,000+ verified MCQs for PSSSB, PPSC, and Punjab Police.
- **Institutional Analytics**: Deep performance audit and state-level ranking.
- **Elite Pass Registry**: Tiered access to premium mocks and AI rationalizations.

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **Backend**: Firebase (Auth, Firestore, Storage)
- **State**: Zustand (Exam Store)
- **AI**: Genkit (Logic Rationalization)

## 📦 GitHub Deployment (Correct Sequence)

If you see the message **"Your branch is ahead of origin/main by X commits"** or **"nothing to commit, working tree clean"**, follow these steps to push your work to GitHub:

### 1. Push Existing Commits
If you have already committed your work (like the 194 commits shown in your terminal), just run:
```bash
git push origin main
```

### 2. If you have NEW changes to save:
If you have modified files that haven't been saved yet:
```bash
# 1. Stage all changes
git add .

# 2. Commit with a message
git commit -m "Update Cracklix UI and performance improvements"

# 3. Push to GitHub
git push origin main
```

### 3. First Time Setup (If Push Fails)
If you haven't linked your GitHub yet:
```bash
# Add your remote repository
git remote add origin https://github.com/arshgrewal1122/cracklix.git

# Set branch to main
git branch -M main

# Push and link
git push -u origin main
```

## 🚀 Vercel Deployment
1. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Import your GitHub repository (`cracklix`).
3. **Crucial**: Add the following Environment Variables in the Vercel Settings:
   - `RAZORPAY_KEY_ID`: Your Razorpay Key.
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Secret.
   - `GOOGLE_GENAI_API_KEY`: Your Google AI API Key.
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: (And other Firebase config values from src/firebase/config.ts).
4. Click **Deploy**.

---
Developed by **Arsh Grewal**