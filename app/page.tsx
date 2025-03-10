/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, BookOpen, Edit, Trash2, BookMarked, BookCopy, Sparkles, Zap, BookText, BarChart3, BookUp, Users, Calendar, Send, Bot, X, Minimize2, Maximize2 } from "lucide-react"

// Book type definition
type Book = {
  id: string
  title: string
  author: string
  year: string
  genre: string
  isCheckedOut: boolean
  checkedOutDate?: string
}

// Add these types
type ChatMessage = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  recommendedBook?: Book | null;
}

export default function Home() {
  // Add dark theme background to the body
  useEffect(() => {
    document.body.classList.add('bg-slate-950');
    document.body.style.background = 'radial-gradient(circle at 50% 50%, #0f172a, #020617)';
    document.body.style.backgroundImage = "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"4\" height=\"4\" viewBox=\"0 0 4 4\"%3E%3Cpath fill=\"%239C92AC\" fill-opacity=\"0.05\" d=\"M1 3h1v1H1V3zm2-2h1v1H3V1z\"%3E%3C/path%3E%3C/svg%3E')";
    
    return () => {
      document.body.classList.remove('bg-slate-950');
      document.body.style.background = '';
      document.body.style.backgroundImage = '';
    };
  }, []);

  // State for books
  const [books, setBooks] = useState<Book[]>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('library-books')
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return []
  })
  
  // State for search
  const [searchTerm, setSearchTerm] = useState("")
  
  // State for new/edit book
  const [newBook, setNewBook] = useState<Omit<Book, 'id' | 'isCheckedOut'>>({
    title: "",
    author: "",
    year: "",
    genre: ""
  })
  
  // State for edit mode
  const [editingBookId, setEditingBookId] = useState<string | null>(null)
  
  // Add these states after the other state declarations
  const [sortField, setSortField] = useState<'title' | 'author' | 'year'>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Add this state after the other state declarations
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  // Add this state after the other state declarations
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'checked-out'>('all');
  
  // Add these states after your other state declarations
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Add this state to control the add book dialog
  const [addBookDialogOpen, setAddBookDialogOpen] = useState(false);
  
  // Add this state to control the edit book dialog
  const [editBookDialogOpen, setEditBookDialogOpen] = useState(false);
  
  // Add these states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm Nexus, your AI literary assistant. Tell me what kind of books you enjoy, and I'll recommend something from your collection or suggest new titles.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  
  // Save to localStorage whenever books change
  useEffect(() => {
    localStorage.setItem('library-books', JSON.stringify(books))
  }, [books])
  
  // Filtered books based on search
  const filteredBooks = books
    .filter(book => 
      (statusFilter === 'all' || 
       (statusFilter === 'available' && !book.isCheckedOut) ||
       (statusFilter === 'checked-out' && book.isCheckedOut)) &&
      (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
       book.genre.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortField === 'year') {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return sortDirection === 'asc' ? yearA - yearB : yearB - yearA;
      }
      
      const valueA = a[sortField].toLowerCase();
      const valueB = b[sortField].toLowerCase();
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  
  // Update the addBook function to close the dialog directly
  const addBook = () => {
    if (newBook.title && newBook.author) {
      if (editingBookId) {
        // Update existing book
        setBooks(books.map(book => 
          book.id === editingBookId 
            ? { ...book, ...newBook } 
            : book
        ))
        setEditingBookId(null)
      } else {
        // Add new book
        setBooks([
          ...books, 
          { 
            id: Date.now().toString(), 
            ...newBook, 
            isCheckedOut: false 
          }
        ])
      }
      
      // Reset form
      setNewBook({
        title: "",
        author: "",
        year: "",
        genre: ""
      })
      
      // Close the dialog directly
      setAddBookDialogOpen(false)
    }
  }
  
  // Delete a book
  const deleteBook = (id: string) => {
    setBooks(books.filter(book => book.id !== id))
  }
  
  // Toggle checkout status
  const toggleCheckout = (id: string) => {
    setBooks(books.map(book => 
      book.id === id 
        ? { 
            ...book, 
            isCheckedOut: !book.isCheckedOut,
            checkedOutDate: !book.isCheckedOut ? new Date().toLocaleDateString() : undefined
          } 
        : book
    ))
  }
  
  // Update the startEditing function to open the edit dialog
  const startEditing = (book: Book) => {
    setNewBook({
      title: book.title,
      author: book.author,
      year: book.year,
      genre: book.genre
    });
    setEditingBookId(book.id);
    setEditBookDialogOpen(true);
  };
  
  // Add a function to handle saving edits
  const saveEdits = () => {
    if (newBook.title && newBook.author && editingBookId) {
      // Update existing book
      setBooks(books.map(book => 
        book.id === editingBookId 
          ? { ...book, ...newBook } 
          : book
      ));
      
      // Reset form
      setNewBook({
        title: "",
        author: "",
        year: "",
        genre: ""
      });
      
      // Clear editing state
      setEditingBookId(null);
      
      // Close the dialog
      setEditBookDialogOpen(false);
    }
  };
  
  // Get genre badge variant
  const getGenreBadgeVariant = (genre: string) => {
    const genreLower = genre.toLowerCase();
    if (genreLower.includes('sci') || genreLower.includes('science')) return 'scifi';
    if (genreLower.includes('fantasy')) return 'fantasy';
    if (genreLower.includes('fiction')) return 'fiction';
    if (genreLower.includes('non') || genreLower.includes('biography') || genreLower.includes('history')) return 'nonfiction';
    if (genreLower.includes('classic')) return 'classic';
    return 'default';
  }
  
  const getStatistics = () => {
    const totalBooks = books.length;
    const checkedOutBooks = books.filter(book => book.isCheckedOut).length;
    const availableBooks = totalBooks - checkedOutBooks;
    const uniqueAuthors = new Set(books.map(book => book.author)).size;
    
    return {
      totalBooks,
      checkedOutBooks,
      availableBooks,
      uniqueAuthors
    };
  };
  
  const stats = getStatistics();
  
  // Add this function to handle book selection
  const viewBookDetails = (book: Book) => {
    setSelectedBook(book);
  };
  
  // Update the initializeArchive function to use AI generation
  const initializeArchive = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      // Create the system prompt for generating a diverse library
      const systemPrompt = `You are a literary database AI that generates diverse book collections. 
      Generate a collection of 30 books with the following details for each:
      - Title: Creative and authentic-sounding book titles
      - Author: Realistic author names (mix of classic and contemporary)
      - Year: Publication years (ranging from 1800s to present)
      - Genre: Varied genres (science fiction, fantasy, mystery, biography, history, philosophy, etc.)
      
      Format your response as a JSON array of book objects with these exact fields:
      [
        {
          "title": "Book Title",
          "author": "Author Name",
          "year": "YYYY",
          "genre": "Genre"
        },
        ...
      ]
      
      Ensure a diverse mix of genres, time periods, and writing styles. Include both well-known classics and creative fictional works.`;
      
      // Call Azure OpenAI API
      const response = await fetch(`${process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.NEXT_PUBLIC_AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.NEXT_PUBLIC_AZURE_OPENAI_API_VERSION}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY || ''
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: "Generate a diverse library of 30 books." }
          ],
          max_tokens: 2000,
          temperature: 0.8,
          top_p: 0.95
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // Update progress to show API call completed
      setGenerationProgress(30);
      
      const data = await response.json();
      const booksText = data.choices[0].message.content;
      
      // Extract the JSON array from the response
      // This handles cases where the AI might include markdown code blocks or explanatory text
      const jsonMatch = booksText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Could not parse book data from API response");
      }
      
      // Parse the JSON array
      const booksData = JSON.parse(jsonMatch[0]);
      setGenerationProgress(60);
      
      // Convert to our Book type and add IDs and checkout status
      const newBooks: Book[] = booksData.map((book: {
        title: string;
        author: string;
        year: string | number;
        genre: string;
      }, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        title: book.title,
        author: book.author,
        year: book.year.toString(),
        genre: book.genre,
        isCheckedOut: Math.random() > 0.7 // Randomly mark some books as checked out
      }));
      
      // Add checkout dates to checked out books
      newBooks.forEach(book => {
        if (book.isCheckedOut) {
          // Generate a random recent date for checkout
          const today = new Date();
          const daysAgo = Math.floor(Math.random() * 30) + 1; // 1-30 days ago
          const checkoutDate = new Date(today);
          checkoutDate.setDate(today.getDate() - daysAgo);
          book.checkedOutDate = checkoutDate.toLocaleDateString();
        }
      });
      
      setGenerationProgress(90);
      
      // Simulate a slight delay for UI feedback
      setTimeout(() => {
        setBooks(newBooks);
        setGenerationProgress(100);
        
        // Complete the generation process
        setTimeout(() => {
          setIsGenerating(false);
        }, 500);
      }, 500);
      
    } catch (error) {
      console.error('Error generating library:', error);
      // Show error in UI by setting progress to negative value
      setGenerationProgress(-1);
      
      // Reset after a delay
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 2000);
    }
  };
  
  // Update the extractBookRecommendation function to prioritize existing books
  const extractBookRecommendation = (message: string): Book | null => {
    // Look for patterns like "Title by Author" or "I recommend Title by Author"
    const titleAuthorRegex = /"([^"]+)"\s+by\s+([^,.]+)/i;
    const match = message.match(titleAuthorRegex);
    
    if (match) {
      const title = match[1];
      const author = match[2].trim();
      
      // First, check if this book already exists in the library
      const existingBook = books.find(book => 
        book.title.toLowerCase().includes(title.toLowerCase()) || 
        title.toLowerCase().includes(book.title.toLowerCase()) &&
        (book.author.toLowerCase().includes(author.toLowerCase()) || 
         author.toLowerCase().includes(book.author.toLowerCase()))
      );
      
      // If the book exists in the library, return that book
      if (existingBook) {
        return existingBook;
      }
      
      // If not found in library, extract other details for a new book
      let genre = "Fiction"; // Default genre
      const genreRegex = /genre(?:\s+is|\:)?\s+([^,.]+)/i;
      const genreMatch = message.match(genreRegex);
      if (genreMatch) {
        genre = genreMatch[1].trim();
      }
      
      let year = "";
      const yearRegex = /(?:published|from|in)\s+(\d{4})/i;
      const yearMatch = message.match(yearRegex);
      if (yearMatch) {
        year = yearMatch[1];
      }
      
      // Create a new book recommendation
      return {
        id: `rec-${Date.now()}`,
        title,
        author,
        genre,
        year,
        isCheckedOut: false
      };
    }
    
    return null;
  };
  
  // Update the sendMessage function to provide more detailed library context
  const sendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    
    // Add a temporary "thinking" message
    const thinkingId = (Date.now() + 1).toString();
    setChatMessages(prev => [...prev, {
      id: thinkingId,
      content: "Thinking...",
      sender: 'bot',
      timestamp: new Date()
    }]);
    
    try {
      // Prepare detailed context about the user's library including availability
      const availableBooks = books.filter(book => !book.isCheckedOut);
      const checkedOutBooks = books.filter(book => book.isCheckedOut);
      
      const libraryContext = books.length > 0 
        ? `The user has ${books.length} books in their library:
          - Available books (${availableBooks.length}): ${availableBooks.slice(0, 5).map(b => `"${b.title}" by ${b.author} (${b.genre})`).join(', ')}${availableBooks.length > 5 ? '...' : '.'}
          - Checked out books (${checkedOutBooks.length}): ${checkedOutBooks.slice(0, 5).map(b => `"${b.title}" by ${b.author} (${b.genre}), checked out on ${b.checkedOutDate}`).join(', ')}${checkedOutBooks.length > 5 ? '...' : '.'}`
        : "The user's library is currently empty.";
      
      // Create messages array for the API
      const messages = [
        {
          role: "system",
          content: `You are Nexus, an AI literary assistant for a futuristic library system. 
          Your purpose is to help users discover books they might enjoy and manage their digital library.
          ${libraryContext}
          
          IMPORTANT INSTRUCTIONS:
          1. When users ask for recommendations, PRIORITIZE suggesting books from their EXISTING library.
          2. Only suggest new books if the user specifically asks for new recommendations or if their library doesn't contain suitable books.
          3. Keep your responses concise (under 100 words).
          4. When recommending books, format them as: "Title" by Author (Year) - Genre
          5. When recommending books from the user's library, always mention whether they are available or checked out.
          
          If asked to recommend books, suggest titles based on the user's preferences and library.
          You can suggest both books from their existing collection and new books they might enjoy.`
        },
        // Include recent conversation history (last 6 messages)
        ...chatMessages.slice(-6).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: "user", content: currentMessage }
      ];
      
      // Call Azure OpenAI API
      const response = await fetch(`${process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.NEXT_PUBLIC_AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.NEXT_PUBLIC_AZURE_OPENAI_API_VERSION}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY || ''
        },
        body: JSON.stringify({
          messages,
          max_tokens: 800,
          temperature: 0.7,
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const botResponse = data.choices[0].message.content;
      
      // Check if the response contains a book recommendation
      const recommendedBook = extractBookRecommendation(botResponse);
      
      // Remove the thinking message and add the real response
      setChatMessages(prev => 
        prev.filter(msg => msg.id !== thinkingId).concat({
          id: (Date.now() + 2).toString(),
          content: botResponse,
          sender: 'bot',
          timestamp: new Date(),
          recommendedBook: recommendedBook // Add the book if found
        })
      );
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      
      // Remove the thinking message and add an error message
      setChatMessages(prev => 
        prev.filter(msg => msg.id !== thinkingId).concat({
          id: (Date.now() + 2).toString(),
          content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
          sender: 'bot',
          timestamp: new Date()
        })
      );
    }
  };
  
  // Add this effect to scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-slate-900/90 border-b border-slate-700/30 shadow-md shadow-black/20">
        <div className="container mx-auto py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-b from-cyan-500 to-cyan-600 flex items-center justify-center shadow-md shadow-cyan-900/30">
                <BookText className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-cyan-400 drop-shadow-sm">
                Nexus Library
              </h1>
            </div>
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/80 border-slate-700/50"
              />
            </div>
            
            <Dialog open={addBookDialogOpen} onOpenChange={setAddBookDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="rounded-full" onClick={() => setAddBookDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Book
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingBookId ? "Edit Book" : "Add New Book"}</DialogTitle>
                  <DialogDescription>
                    {editingBookId 
                      ? "Update the details of your book." 
                      : "Enter the details of the book you want to add to your collection."}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="title" className="text-sm font-medium text-slate-300">
                      Title
                    </label>
                    <Input
                      id="title"
                      placeholder="Enter book title"
                      value={newBook.title}
                      onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="author" className="text-sm font-medium text-slate-300">
                      Author
                    </label>
                    <Input
                      id="author"
                      placeholder="Enter author name"
                      value={newBook.author}
                      onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="year" className="text-sm font-medium text-slate-300">
                        Year
                      </label>
                      <Input
                        id="year"
                        placeholder="Publication year"
                        value={newBook.year}
                        onChange={(e) => setNewBook({...newBook, year: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="genre" className="text-sm font-medium text-slate-300">
                        Genre
                      </label>
                      <Input
                        id="genre"
                        placeholder="Book genre"
                        value={newBook.genre}
                        onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={addBook}
                    disabled={!newBook.title || !newBook.author}
                  >
                    {editingBookId ? "Save Changes" : "Add Book"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700/30 overflow-hidden">
            <div className="absolute inset-0 bg-cyan-500/5"></div>
            <CardContent className="flex items-center justify-between pt-6 relative">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Books</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-100">{stats.totalBooks}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-b from-cyan-500 to-cyan-600 flex items-center justify-center shadow-md shadow-cyan-900/30">
                <BookUp className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700/30 overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5"></div>
            <CardContent className="flex items-center justify-between pt-6 relative">
              <div>
                <p className="text-sm font-medium text-slate-400">Available</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-100">{stats.availableBooks}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-900/30">
                <BookText className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700/30 overflow-hidden">
            <div className="absolute inset-0 bg-amber-500/5"></div>
            <CardContent className="flex items-center justify-between pt-6 relative">
              <div>
                <p className="text-sm font-medium text-slate-400">Checked Out</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-100">{stats.checkedOutBooks}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-b from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-900/30">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700/30 overflow-hidden">
            <div className="absolute inset-0 bg-purple-500/5"></div>
            <CardContent className="flex items-center justify-between pt-6 relative">
              <div>
                <p className="text-sm font-medium text-slate-400">Authors</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-100">{stats.uniqueAuthors}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-b from-purple-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-900/30">
                <Users className="h-6 w-6 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-slate-100">Book Collection</h2>
            <div className="flex rounded-md overflow-hidden border border-slate-800 backdrop-blur-sm">
              <button 
                onClick={() => setStatusFilter('all')} 
                className={`px-3 py-1 text-sm ${statusFilter === 'all' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-slate-800/50 text-slate-300'}`}
              >
                All
              </button>
              <button 
                onClick={() => setStatusFilter('available')} 
                className={`px-3 py-1 text-sm ${statusFilter === 'available' ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white' : 'bg-slate-800/50 text-slate-300'}`}
              >
                Available
              </button>
              <button 
                onClick={() => setStatusFilter('checked-out')} 
                className={`px-3 py-1 text-sm ${statusFilter === 'checked-out' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' : 'bg-slate-800/50 text-slate-300'}`}
              >
                Checked Out
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Sort by:</span>
            <div className="flex rounded-md overflow-hidden border border-slate-800 backdrop-blur-sm">
              <button 
                onClick={() => setSortField('title')} 
                className={`px-3 py-1 text-sm ${sortField === 'title' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-slate-800/50 text-slate-300'}`}
              >
                Title
              </button>
              <button 
                onClick={() => setSortField('author')} 
                className={`px-3 py-1 text-sm ${sortField === 'author' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-slate-800/50 text-slate-300'}`}
              >
                Author
              </button>
              <button 
                onClick={() => setSortField('year')} 
                className={`px-3 py-1 text-sm ${sortField === 'year' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'bg-slate-800/50 text-slate-300'}`}
              >
                Year
              </button>
            </div>
            <button 
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 rounded-md bg-slate-800/50 border border-slate-800 backdrop-blur-sm"
            >
              {sortDirection === 'asc' ? 
                <BarChart3 className="h-4 w-4 text-slate-400" /> : 
                <BarChart3 className="h-4 w-4 text-slate-400 transform rotate-180" />
              }
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <Card 
                key={book.id} 
                className="group overflow-hidden hover:bg-gradient-to-b hover:from-slate-800/80 hover:to-slate-900/80 cursor-pointer relative"
                onClick={() => viewBookDetails(book)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader>
                  <CardTitle>{book.title}</CardTitle>
                  <CardDescription>{book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300 font-medium">Year:</span>
                      <span className="font-medium text-slate-200">{book.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300 font-medium">Genre:</span>
                      <Badge variant={getGenreBadgeVariant(book.genre)}>
                        {book.genre}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300 font-medium">Status:</span>
                      <Badge variant={book.isCheckedOut ? "borrowed" : "available"}>
                        {book.isCheckedOut ? "Checked Out" : "Available"}
                      </Badge>
                    </div>
                    {book.isCheckedOut && book.checkedOutDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-300 font-medium">Checked out on:</span>
                        <span className="font-medium text-slate-200">{book.checkedOutDate}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-4 border-t border-slate-700/30">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs bg-slate-800/50 border-slate-700 hover:bg-slate-700/70"
                    onClick={(e) => {
                      e.stopPropagation();
                      viewBookDetails(book);
                    }}
                  >
                    <BookOpen className="h-3.5 w-3.5 mr-1" />
                    Details
                  </Button>
                  
                  <Button
                    variant={book.isCheckedOut ? "future" : "secondary"}
                    size="sm"
                    className="h-8 px-2 text-xs rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCheckout(book.id);
                    }}
                  >
                    {book.isCheckedOut ? (
                      <>
                        <BookMarked className="h-3.5 w-3.5 mr-1" />
                        Return
                      </>
                    ) : (
                      <>
                        <BookCopy className="h-3.5 w-3.5 mr-1" />
                        Borrow
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-600/10 flex items-center justify-center mb-6 backdrop-blur-sm">
                <BookOpen className="h-16 w-16 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-medium mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Archive Empty</h3>
              <p className="text-slate-400 mb-8 max-w-md">
                {books.length === 0 
                  ? "Your digital archive is empty. Add your first book to begin your collection."
                  : "No books match your search parameters. Try adjusting your query."}
              </p>
              {books.length === 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="future" className="animate-pulse rounded-full">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Initialize Archive
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Initialize Digital Archive</DialogTitle>
                      <DialogDescription>
                        The Nexus AI will analyze literary patterns and generate a starter collection for your library.
                      </DialogDescription>
                    </DialogHeader>
                    
                    {isGenerating ? (
                      <div className="py-8 flex flex-col items-center">
                        <div className="relative w-40 h-40 mb-6">
                          <div className="absolute inset-0 rounded-full bg-slate-800 shadow-inner shadow-black/40 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full absolute">
                              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500 to-cyan-600 opacity-20"></div>
                              <div 
                                className="absolute bottom-0 bg-gradient-to-b from-cyan-500 to-cyan-600 transition-all duration-200 w-full"
                                style={{ height: `${generationProgress}%` }}
                              ></div>
                            </div>
                            <div className="z-10 text-2xl font-bold text-white drop-shadow-md">{generationProgress}%</div>
                          </div>
                          <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                        </div>
                        
                        <div className="space-y-2 text-center">
                          <h3 className="text-lg font-medium text-slate-100">Generating Archive</h3>
                          <p className="text-sm text-slate-400">
                            {generationProgress < 30 ? 
                              "Analyzing literary patterns..." : 
                              generationProgress < 60 ? 
                              "Synthesizing book metadata..." : 
                              "Finalizing digital collection..."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6">
                        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 mb-6">
                          <p className="text-sm text-slate-400 mb-2">
                            The Nexus AI will generate a curated collection of 30 books across various genres and time periods to jumpstart your library.
                          </p>
                          <p className="text-sm text-slate-400">
                            This process will replace any existing books in your collection.
                          </p>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-cyan-500/20 mr-2 flex items-center justify-center">
                              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                            </div>
                            <span className="text-sm text-slate-300">Generate classic science fiction</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-blue-500/20 mr-2 flex items-center justify-center">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            </div>
                            <span className="text-sm text-slate-300">Include modern bestsellers</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-purple-500/20 mr-2 flex items-center justify-center">
                              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            </div>
                            <span className="text-sm text-slate-300">Add diverse genres and authors</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <DialogFooter>
                      {!isGenerating && (
                        <Button 
                          variant="outline" 
                          onClick={() => initializeArchive()} 
                          className="w-full text-white bg-gradient-to-b from-slate-700 to-slate-800 hover:from-cyan-600 hover:to-cyan-700"
                        >
                          <Zap className="mr-2 h-4 w-4" />
                          Begin Generation
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Book Detail Dialog */}
      <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-cyan-400 drop-shadow-sm">{selectedBook?.title}</DialogTitle>
            <DialogDescription className="text-base mt-2 text-slate-300">by {selectedBook?.author}</DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-medium">Status:</span>
              <Badge variant={selectedBook?.isCheckedOut ? "borrowed" : "available"}>
                {selectedBook?.isCheckedOut ? "Checked Out" : "Available"}
              </Badge>
            </div>
            
            {selectedBook?.year && (
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Publication Year:</span>
                <span className="font-medium text-slate-200">{selectedBook?.year}</span>
              </div>
            )}
            
            {selectedBook?.genre && (
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Genre:</span>
                <Badge variant={getGenreBadgeVariant(selectedBook?.genre)}>
                  {selectedBook?.genre}
                </Badge>
              </div>
            )}
            
            {selectedBook?.isCheckedOut && selectedBook?.checkedOutDate && (
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Checked out on:</span>
                <span className="font-medium text-slate-200">{selectedBook?.checkedOutDate}</span>
              </div>
            )}
            
            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-slate-300 text-sm">
                This book is part of your digital archive. You can manage it using the options below.
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between mt-6">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => { 
                  startEditing(selectedBook!); 
                  setSelectedBook(null); 
                }}
                className="bg-slate-800/50 border-slate-700 hover:bg-cyan-900/20 hover:text-cyan-300 hover:border-cyan-800 text-slate-300"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => { deleteBook(selectedBook!.id); setSelectedBook(null); }}
                className="bg-slate-800/50 border-slate-700 hover:bg-red-900/20 hover:text-red-300 hover:border-red-800 text-slate-300"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
            <Button 
              variant={selectedBook?.isCheckedOut ? "future" : "secondary"} 
              size="sm"
              onClick={() => { toggleCheckout(selectedBook!.id); setSelectedBook(null); }}
              className="rounded-full"
            >
              {selectedBook?.isCheckedOut ? (
                <>
                  <BookMarked className="h-4 w-4 mr-1" />
                  Return
                </>
              ) : (
                <>
                  <BookCopy className="h-4 w-4 mr-1" />
                  Check Out
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Book Dialog */}
      <Dialog open={editBookDialogOpen} onOpenChange={setEditBookDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update the details of your book.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-title" className="text-sm font-medium text-slate-300">
                Title
              </label>
              <Input
                id="edit-title"
                placeholder="Enter book title"
                value={newBook.title}
                onChange={(e) => setNewBook({...newBook, title: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-author" className="text-sm font-medium text-slate-300">
                Author
              </label>
              <Input
                id="edit-author"
                placeholder="Enter author name"
                value={newBook.author}
                onChange={(e) => setNewBook({...newBook, author: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="edit-year" className="text-sm font-medium text-slate-300">
                  Year
                </label>
                <Input
                  id="edit-year"
                  placeholder="Publication year"
                  value={newBook.year}
                  onChange={(e) => setNewBook({...newBook, year: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-genre" className="text-sm font-medium text-slate-300">
                  Genre
                </label>
                <Input
                  id="edit-genre"
                  placeholder="Book genre"
                  value={newBook.genre}
                  onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={saveEdits}
              disabled={!newBook.title || !newBook.author}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Chat button */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-700/30 flex items-center justify-center hover:shadow-xl hover:shadow-cyan-700/40 transition-all duration-300 z-50"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}
      
      {/* Chat interface */}
      {isChatOpen && (
        <div 
          className={`fixed ${isMinimized ? 'bottom-6 right-6 h-14 w-64' : 'bottom-6 right-6 h-[600px] w-[400px]'} bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 shadow-xl shadow-black/30 flex flex-col overflow-hidden transition-all duration-300 z-50`}
        >
          {/* Chat header */}
          <div className="p-3 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center mr-2">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-slate-200 font-medium">Nexus Assistant</h3>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300 hover:bg-slate-700 mr-1"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </button>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="h-6 w-6 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300 hover:bg-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
          
          {/* Chat messages */}
          {!isMinimized && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[90%] rounded-lg p-3 ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                        : 'bg-slate-800 border border-slate-700/50 text-slate-200'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    
                    {/* Render book card if recommendation exists */}
                    {message.recommendedBook && (
                      <div className="mt-3 border border-slate-700/50 rounded-lg overflow-hidden hover:shadow-md hover:shadow-cyan-900/20 transition-all cursor-pointer"
                           onClick={() => {
                             // Check if book exists in library
                             const existingBook = books.find(b => 
                               b.title === message.recommendedBook?.title && 
                               b.author === message.recommendedBook?.author
                             );
                             
                             if (existingBook) {
                               // Open book details if it exists
                               viewBookDetails(existingBook);
                             } else if (message.recommendedBook) {
                               // Add to library and open details if it doesn't
                               const newBook = {
                                 ...message.recommendedBook,
                                 id: Date.now().toString()
                               };
                               setBooks([...books, newBook]);
                               viewBookDetails(newBook);
                             }
                           }}
                      >
                        <div className="p-3 bg-gradient-to-b from-slate-700 to-slate-800">
                          <h4 className="font-medium text-cyan-400">{message.recommendedBook.title}</h4>
                          <p className="text-xs text-slate-300">by {message.recommendedBook.author}</p>
                        </div>
                        <div className="p-2 bg-slate-800/50 flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">Genre:</span>
                            <Badge variant={getGenreBadgeVariant(message.recommendedBook.genre)} className="text-[10px] py-0 px-1.5">
                              {message.recommendedBook.genre}
                            </Badge>
                          </div>
                          {message.recommendedBook.year && (
                            <div className="text-slate-400">
                              <span>{message.recommendedBook.year}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-gradient-to-b from-slate-800 to-slate-900 text-[10px] text-slate-400 flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <span>Status:</span>
                            <Badge variant={message.recommendedBook.isCheckedOut ? "borrowed" : "available"} className="text-[10px] py-0 px-1.5">
                              {message.recommendedBook.isCheckedOut ? "Checked Out" : "Available"}
                            </Badge>
                          </div>
                          {!books.some(b => 
                            b.title === message.recommendedBook?.title && 
                            b.author === message.recommendedBook?.author
                          ) && (
                            <Button variant="outline" size="sm" className="h-6 py-0 px-2 text-[10px]">
                              <Plus className="h-3 w-3 mr-1" />
                              Add to Library
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-[10px] opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          )}
          
          {/* Chat input */}
          {!isMinimized && (
            <div className="p-3 border-t border-slate-700/50 bg-slate-800/50">
              <div className="flex items-center">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about books..."
                  className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-l-md py-2 px-3 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-r-md py-2 px-3 hover:from-cyan-600 hover:to-blue-700"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <footer className="mt-auto py-6 border-t border-slate-700/30 backdrop-blur-md bg-slate-900/50 shadow-md shadow-black/20">
        <div className="container mx-auto text-center text-sm text-slate-500">
          <p className="flex items-center justify-center gap-2">
            <span className="inline-block h-1 w-1 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50"></span>
            Nexus Library System
            <span className="inline-block h-1 w-1 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
            v2.0
          </p>
        </div>
      </footer>
      
      {/* Add glowing orbs for futuristic effect */}
      <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
