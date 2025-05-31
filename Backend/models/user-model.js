// For now, this will be an in-memory store
const users = [];
let currentId = 1;

export class UserModel {
  constructor(username, email, password) {
    this.id = currentId++;
    this.username = username;
    this.email = email;
    this.password = password; // In a real app, this would be hashed
  }

  static create({ username, email, password }) {
    const newUser = new UserModel(username, email, password);
    users.push(newUser);
    return newUser;
  }

  static findOne({ email, username }) {
    if (email) {
      return users.find(user => user.email === email);
    }
    if (username) {
      return users.find(user => user.username === username);
    }
    return null;
  }

  static findById(id) {
    return users.find(user => user.id === id);
  }
}

// Export an instance or the class depending on how you want to manage state
// For this basic example, static methods on the class are fine.
export const userModel = UserModel;
