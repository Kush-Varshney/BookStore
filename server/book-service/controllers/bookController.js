import Book from "../models/bookModel.js"

// Cache for frequently accessed books
const bookCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper function to validate book data
const validateBookData = (bookData) => {
  const requiredFields = ['title', 'author', 'price'];
  const missingFields = requiredFields.filter(field => !bookData[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  if (bookData.price < 0) {
    throw new Error('Price cannot be negative');
  }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Private/Admin
export const addBook = async (req, res) => {
  try {
    const book = new Book(req.body)
    await book.save()
    res.status(201).json(book)
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "ISBN already exists" })
    } else {
      res.status(400).json({ message: error.message })
    }
  }
}

// @desc    Get all books with pagination and filtering
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (req.query.author) filter.author = new RegExp(req.query.author, 'i');
    if (req.query.genre) filter.genre = new RegExp(req.query.genre, 'i');
    if (req.query.minPrice) filter.price = { $gte: parseFloat(req.query.minPrice) };
    if (req.query.maxPrice) filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };
    
    // Get total count for pagination
    const total = await Book.countDocuments(filter);
    
    // Get books with pagination
    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
}

// @desc    Get a single book by ID
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check cache first
    const cachedBook = bookCache.get(id);
    if (cachedBook && Date.now() - cachedBook.timestamp < CACHE_TTL) {
      return res.json(cachedBook.data);
    }
    
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Update cache
    bookCache.set(id, {
      data: book,
      timestamp: Date.now()
    });
    
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
}

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Validate updates
    validateBookData(updates);
    
    const book = await Book.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Update cache
    bookCache.set(id, {
      data: book,
      timestamp: Date.now()
    });
    
    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(400).json({ error: error.message || 'Failed to update book' });
  }
}

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Remove from cache
    bookCache.delete(id);
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
}

// @desc    Search books
// @route   GET /api/books/search?q=
// @access  Public
export const searchBooks = async (req, res) => {
  try {
    const { q } = req.query
    if (!q) {
      return res.status(400).json({ message: "Search query is required" })
    }

    const books = await Book.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(20)

    res.status(200).json(books)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Add a review to a book
// @route   POST /api/books/:id/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    const { rating, comment } = req.body
    const review = {
      userId: req.user._id,
      rating,
      comment
    }

    book.reviews.push(review)
    await book.calculateAverageRating()
    
    res.status(200).json(book)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Get book reviews
// @route   GET /api/books/:id/reviews
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    res.status(200).json(book.reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
