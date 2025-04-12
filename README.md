# Interview Ninja 🥷

A sleek, ninja-themed mock interview platform with AI-powered features to help you master your interviews.

![Interview Ninja](src/public/assets/screenshot.png)

## Features

- 🤖 AI Interview Simulation - Experience realistic interview scenarios 
- 🎭 Emotion AI Feedback - Get feedback on your facial expressions (when camera enabled)
- 🔊 Buzzword Alert System - Real-time detection of filler words
- 📊 Performance Analytics - Track your interview progress
- 🎮 Role Reversal Mode - Become the evaluator post-interview
- 📱 Responsive Design - Works on desktop and mobile

## Core Technologies

- Next.js 14 - React framework
- TypeScript - Type-safe code
- Tailwind CSS - Styling
- Framer Motion - Animations
- TensorFlow.js - For emotion detection (mock implementation)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/interview-ninja.git
cd interview-ninja
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
interview-ninja/
├── src/
│   ├── app/          # Next.js app folder
│   ├── components/   # Reusable components
│   ├── styles/       # Global styles
│   ├── utils/        # Helper functions
│   └── public/       # Static files
├── tailwind.config.js
├── next.config.js
└── package.json
```

## Key Features Explained

### AI Interview Simulation
The platform simulates realistic interview scenarios with an AI interviewer that adapts to your responses and industry.

### Emotion-AI Feedback
When camera is enabled, the system can detect facial emotions to provide feedback on how you appear to interviewers.

### Buzzword Alert System
Detects filler words and industry buzzwords in your speech to help you improve communication clarity.

### Performance Analytics
Track your progress over time with detailed metrics on confidence, clarity, and technical accuracy.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [TensorFlow.js](https://www.tensorflow.org/js) 