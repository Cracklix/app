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

## 📦 Deployment & Repository Setup

### GitHub Setup
To push this project to your GitHub repository, run these commands in your local terminal:
```bash
git remote add origin https://github.com/arshgrewal1122/cracklix.git
git branch -M main
git push -u origin main
```

### Vercel Deployment
1. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Import your GitHub repository (`cracklix`).
3. **Crucial**: Add the following Environment Variables in the Vercel Settings:
   - `RAZORPAY_KEY_ID`: Your Razorpay Live/Test Key ID.
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret.
   - `GOOGLE_GENAI_API_KEY`: Your Google AI API Key (for Genkit rationalizations).
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: (And other Firebase config values if needed, though they are usually in `src/firebase/config.ts`).
4. Click **Deploy**.

## 🛡️ Security & Integrity
The platform employs strict Role-Based Access Control (RBAC).
- **Students**: Limited to identity and own attempt nodes.
- **Admin**: Exclusive access to the Master Content Registry.

---
Developed by **Arsh Grewal**