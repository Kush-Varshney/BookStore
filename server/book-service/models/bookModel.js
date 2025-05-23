import mongoose from "mongoose"

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"]
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot be more than 2000 characters"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      sparse: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^(?:\d{10}|\d{13})$/.test(v);
        },
        message: "ISBN must be 10 or 13 digits"
      }
    },
    publisher: {
      type: String,
      required: [true, "Publisher is required"],
      trim: true,
    },
    publishedDate: {
      type: Date,
      required: [true, "Published date is required"],
    },
    inStock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0
    },
    imageUrl: {
      type: String,
      default: "default-book.jpg",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    reviews: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comment: String,
      date: {
        type: Date,
        default: Date.now
      }
    }],
    genre: {
      type: String,
      trim: true,
      enum: {
        values: ['Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Romance', 'Biography', 'History', 'Science', 'Technology', 'Other'],
        message: "{VALUE} is not a valid genre"
      }
    },
    publicationYear: {
      type: Number,
      min: [1800, "Publication year must be after 1800"],
      max: [new Date().getFullYear(), "Publication year cannot be in the future"]
    },
    language: {
      type: String,
      trim: true,
      default: "English"
    },
    pageCount: {
      type: Number,
      min: [1, "Page count must be at least 1"]
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0
    },
    coverImage: {
      type: String,
      trim: true
    },
    ratings: {
      average: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Create text index for search functionality
bookSchema.index({ title: "text", author: "text", category: "text", description: "text" })

// Add method to calculate average rating
bookSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
  } else {
    this.rating = this.reviews.reduce((acc, item) => acc + item.rating, 0) / this.reviews.length;
  }
  return this.save();
};

// Virtual for reviews
bookSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'book'
});

// Index for faster queries
bookSchema.index({ genre: 1, price: 1 });
bookSchema.index({ isbn: 1 }, { unique: true, sparse: true });

// Pre-save middleware to update average rating
bookSchema.pre('save', async function(next) {
  if (this.isModified('ratings')) {
    const Review = mongoose.model('Review');
    const stats = await Review.aggregate([
      { $match: { book: this._id } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    
    if (stats.length > 0) {
      this.ratings.average = Math.round(stats[0].avgRating * 10) / 10;
      this.ratings.count = stats[0].count;
    }
  }
  next();
});

// Method to check if book is in stock
bookSchema.methods.isInStock = function() {
  return this.stock > 0;
};

// Static method to find books by genre
bookSchema.statics.findByGenre = function(genre) {
  return this.find({ genre, isActive: true });
};

const Book = mongoose.model("Book", bookSchema)

export default Book
