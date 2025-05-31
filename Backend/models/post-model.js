let listOfPosts = [
  {
    id: Date.now(), // Example ID
    title: "React",
    desc: "Mi primer app",
    image: "https://loremflickr.com/640/360",
    userId: 1 // Example userId, assuming a user with ID 1 exists for the initial post
  },
];

const createNewPost = ({ title, desc, image, userId }) => {
  if (!title || !userId) return null; // userId is now required

  const newPost = { id: Date.now(), title, desc, image, userId };

  listOfPosts.push(newPost);

  return newPost;
};

const getAllPosts = () => {
  return [...listOfPosts];
};

const getPostById = ({ id }) => {
  // Ensure 'id' is treated as a number for comparison, as Date.now() produces numbers
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return undefined; // Or handle error appropriately

  const post = listOfPosts.find((post) => post.id === numericId);

  return post;
};

const findPostByIdAndUpdate = (id, data) => {
  // Ensure 'id' is treated as a number
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const postIndex = listOfPosts.findIndex((post) => post.id === numericId);

  if (postIndex === -1) return null;

  const post = listOfPosts[postIndex];

  const updatedPost = { ...post, ...data };
  listOfPosts[postIndex] = updatedPost;

  return updatedPost;
};

const deletePostById = ({ id }) => {
  // Ensure 'id' is treated as a number
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return; // Or handle error

  listOfPosts = listOfPosts.filter((post) => post.id !== numericId);
};

export const postModel = {

  findAll: getAllPosts,
  create: createNewPost,
  findOne: getPostById,
  update: findPostByIdAndUpdate, // findPostByIdAndUpdate now correctly returns the updated post
  destroy: deletePostById,
};
