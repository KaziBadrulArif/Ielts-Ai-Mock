### IELTS Writing Mock Test Creator

A free, interactive web application that helps users practice for the IELTS Writing exam with uniquely generated questions and detailed feedback - no paid APIs required.

## 📝 Overview

IELTS Writing Mock Test Creator is a Next.js application designed to simulate the IELTS Academic Writing test experience. It dynamically generates unique test questions, provides a timed writing environment, and offers detailed feedback on submissions based on official IELTS assessment criteria.

## ✨ Key Features

- **Unique Question Generation**: Creates new, authentic IELTS-style questions for each practice session
- **Task 1 & Task 2 Support**: Practice both Academic Task 1 (data interpretation) and Task 2 (essay) formats
- **Realistic Timed Environment**: Simulates actual test conditions with appropriate time limits
- **Comprehensive Feedback**: Detailed analysis of writing based on IELTS criteria:

- Task Achievement
- Coherence and Cohesion
- Lexical Resource
- Grammatical Range and Accuracy



- **Improved Version**: Provides an enhanced version of your writing with highlighted changes
- **100% Free**: No paid APIs or subscriptions required


## 🛠️ Technologies

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui component library
- **Database**: Neon PostgreSQL (optional for storing questions and responses)
- **Deployment**: Vercel


## 🧠 How It Works

1. **Question Generation**: Uses template-based algorithms to create unique IELTS-style questions
2. **Writing Interface**: Provides a distraction-free environment with a timer
3. **Analysis Engine**: Processes submissions using rule-based algorithms to evaluate writing quality
4. **Feedback Generation**: Creates detailed feedback based on IELTS assessment criteria
5. **Improvement Suggestions**: Generates an enhanced version of the submission with academic language


## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser


## 📊 Database Setup (Optional)

The application can work without a database, but if you want to store questions and responses:

1. Create a Neon PostgreSQL database
2. Add your database connection string to the environment variables
3. Run the database setup script: `npm run setup-db`


## 🔮 Future Plans

- Speaking test practice with speech recognition
- Reading and listening test modules
- User accounts and progress tracking
- More sophisticated feedback algorithms
- Mobile application


## 🤝 Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue to discuss new features or improvements.
