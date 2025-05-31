// In-memory store for comments
const comments = [];
let currentId = 1;

export class CommentModel {
  constructor(text, postId, userId) {
    this.id = currentId++;
    this.text = text;
    this.postId = postId;
    this.userId = userId; // This will link to the user who created the comment
    this.createdAt = new Date();
  }

  static create({ text, postId, userId }) {
    // In a real scenario, you would also check if postId and userId are valid existing IDs.
    if (!text || !postId || !userId) {
      // Basic validation, can be expanded
      return null;
    }
    const newComment = new CommentModel(text, postId, userId);
    comments.push(newComment);
    return newComment;
  }

  static findByPostId(postId) {
    // Ensure postId is treated as a number if IDs are numbers, or string if they are strings.
    // Assuming currentId generates numbers, postId in comments will be numbers.
    const numericPostId = parseInt(postId, 10);
    return comments.filter(comment => comment.postId === numericPostId);
  }

  static findById(id) {
    const numericId = parseInt(id, 10);
    return comments.find(comment => comment.id === numericId);
  }

  // Optional: A method to get all comments (mainly for debugging or specific use cases)
  static findAll() {
    return comments;
  }
}

// Export the class to be used as commentModel
export const commentModel = CommentModel;
