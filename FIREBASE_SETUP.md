# OSLGSC Voting Platform - Firebase Setup Guide

## Quick Start

### 1. Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Firestore Database
4. Get your Firebase configuration from Project Settings
5. Update `.env.local` with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Firestore Database Structure

Your Firestore should have these collections:

#### Categories Collection
```
categories/
  {categoryId}/
    - id: string
    - name: string
    - description: string
    - isActive: boolean
    - createdAt: timestamp
```

#### Nominees Collection
```
nominees/
  {nomineeId}/
    - id: string
    - categoryId: string (reference to category)
    - name: string
    - image: string (image URL)
    - description: string
    - voteCount: number
    - position: string (optional)
    - createdAt: timestamp
```

#### Votes Collection (for tracking individual votes)
```
votes/
  {voteId}/
    - id: string
    - categoryId: string
    - nomineeId: string
    - userId: string
    - quantity: number
    - amount: number (quantity * 100)
    - timestamp: timestamp
    - paymentReference: string
    - paymentStatus: 'pending' | 'completed' | 'failed'
```

### 3. Development Testing

1. Start the development server:
```bash
npm run dev
```

2. Visit the test page: http://localhost:3000/test

3. Click "Seed Sample Data" to populate your Firebase with test data

4. Test the Categories component functionality

### 4. Component Features

The Categories component includes:
- ✅ Category dropdown selection
- ✅ Real-time nominee loading from Firebase
- ✅ Nominee cards with vote counts
- ✅ +/- vote quantity controls
- ✅ Live vote cost calculation (₦100 per vote)
- ✅ Vote summary with total amount
- ✅ Responsive design
- ✅ Real-time updates when vote counts change

### 5. Next Steps

1. Set up Firebase Authentication for user management
2. Integrate payment gateway (Paystack/Flutterwave)
3. Add countdown timer functionality
4. Create leaderboard component
5. Add vote submission and payment processing
