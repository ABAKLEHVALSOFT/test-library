# Nexus Library System

![Nexus Library System](https://img.shields.io/badge/Nexus-Library%20System-cyan)

A futuristic, AI-powered digital library management system built with Next.js and Azure OpenAI. Nexus Library System combines sleek design with powerful AI features to create an immersive book management experience.

## ✨ Features

### Core Library Management
- **Book Collection Management**: Add, edit, delete, and browse your digital book collection
- **Check-out System**: Track borrowed books with automatic date stamping
- **Smart Search**: Find books by title, author, or genre
- **Advanced Sorting**: Sort your collection by title, author, or publication year
- **Status Filtering**: Filter books by availability status (all, available, checked out)

### AI-Powered Features
- **AI Library Generation**: Instantly populate your library with a diverse collection of 30 AI-generated books
- **AI Literary Assistant**: Chat with Nexus, an intelligent assistant that:
  - Recommends books based on your preferences
  - Suggests titles from your existing collection
  - Provides information about books and authors
  - Offers interactive book cards for recommendations
  - Tracks book availability status

### Modern UI/UX
- **Skeuomorphic Design**: Beautiful dark-themed interface with realistic lighting and shadows
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Interactive Cards**: Detailed book cards with genre badges and availability indicators
- **Animated Elements**: Subtle animations and transitions for a polished experience
- **Accessibility Features**: Keyboard navigation and screen reader support

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn
- An Azure OpenAI API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nexus-library-system.git
cd nexus-library-system
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Azure OpenAI API credentials:
```
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-deployment-name.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🧠 AI Integration

Nexus Library System leverages Azure OpenAI for several intelligent features:

1. **Library Generation**: Creates a diverse collection of books with realistic metadata
2. **Book Recommendations**: Analyzes your library and preferences to suggest new books
3. **Natural Language Chat**: Provides a conversational interface for library interactions

The AI integration is handled through secure API calls to Azure OpenAI, with context-aware prompts that understand your library's contents and status.

## 🛠️ Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **UI Components**: Tailwind CSS, shadcn/ui
- **AI Integration**: Azure OpenAI (GPT-4)
- **State Management**: React Hooks
- **Data Persistence**: Local Storage (with option to extend to backend databases)

## 📱 Usage Guide

### Managing Your Library
- **Add Books**: Click the "Add Book" button in the header
- **Edit/Delete Books**: Use the buttons on each book card or in the book detail view
- **Check Out/Return**: Toggle the availability status with the "Borrow" or "Return" buttons
- **View Details**: Click on any book card to see full details

### Using the AI Assistant
- **Open Chat**: Click the chat button in the bottom-right corner
- **Ask for Recommendations**: Try phrases like "Recommend a science fiction book" or "What should I read next?"
- **Get Information**: Ask about specific books, authors, or genres
- **Add Recommended Books**: Click on book cards in the chat to add them to your library

### Library Generation
- If starting with an empty library, use the "Initialize Archive" option to generate a diverse collection of books using AI

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Azure OpenAI](https://azure.microsoft.com/en-us/services/cognitive-services/openai-service/)
- [Lucide Icons](https://lucide.dev/)

---
