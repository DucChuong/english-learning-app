# English Learning App

This is a [Next.js](https://nextjs.org) English vocabulary learning application with AI-powered word recommendations using OpenRouter API.

## Features

- 📚 Vocabulary learning with interactive exercises
- 🔥 Daily streak tracking
- 📊 Progress tracking with spaced repetition
- ✨ AI-powered word recommendations (OpenRouter)
- 🎯 Topic-based learning
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenRouter API key (optional, for AI recommendations)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your environment variables. Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/english_learning"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OpenRouter API (optional, for AI recommendations)
OPENROUTER_API_KEY="your-openrouter-api-key"
```

3. Set up the database:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database (optional)
npm run prisma:seed
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### OpenRouter API Setup

To enable AI-powered word recommendations:

1. Get your API key from [OpenRouter](https://openrouter.ai/)
2. Add it to your `.env.local` file:
   ```env
   OPENROUTER_API_KEY="your-api-key-here"
   ```
3. The recommendations will appear on the home page automatically

**Note:** The app will work without the OpenRouter API key, but AI recommendations will be disabled.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
