import mongoose from "mongoose";
import User from "../models/user-model.js";
import Post from "../models/post-model.js";
import Comment from "../models/comment-model.js";
import connectDB from "../config/database.js";

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const users = await User.create([
      {
        name: "Juan Pérez",
        email: "juan@example.com",
        password: "123456",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        name: "María García",
        email: "maria@example.com",
        password: "123456",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      {
        name: "Carlos López",
        email: "carlos@example.com",
        password: "123456",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      },
    ]);
    console.log("Created users:", users.length); // Create posts
    const posts = await Post.create([
      {
        title: "Mi aventura en Machu Picchu",
        desc: "Un viaje increíble por las ruinas más famosas de Perú. La experiencia fue única y las vistas espectaculares.",
        image:
          "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800",
        location: "Machu Picchu, Perú",
        author: users[0]._id,
        likes: [users[1]._id, users[2]._id],
      },
      {
        title: "Explorar las calles de París",
        desc: "Caminar por las calles empedradas de París es como viajar en el tiempo. Cada rincón tiene su historia.",
        image:
          "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800",
        location: "París, Francia",
        author: users[1]._id,
        likes: [users[0]._id],
      },
      {
        title: "Safari en Kenia",
        desc: "Una experiencia única observando la vida salvaje en su hábitat natural. Los paisajes son impresionantes.",
        image:
          "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800",
        location: "Masai Mara, Kenia",
        author: users[2]._id,
        likes: [users[0]._id, users[1]._id],
      },
      {
        title: "Playas paradisíacas de Maldivas",
        desc: "Aguas cristalinas y arena blanca. El destino perfecto para relajarse y desconectar del mundo.",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        location: "Maldivas",
        author: users[0]._id,
        likes: [users[2]._id],
      },
    ]);
    console.log("Created posts:", posts.length);

    // Create comments
    const comments = await Comment.create([
      {
        content: "¡Qué lugar tan increíble! Espero poder visitarlo algún día.",
        author: users[1]._id,
        post: posts[0]._id,
      },
      {
        content:
          "Las fotos están espectaculares. ¿Cuál fue tu parte favorita del viaje?",
        author: users[2]._id,
        post: posts[0]._id,
      },
      {
        content: "París siempre será mágico. Me encanta esta ciudad.",
        author: users[0]._id,
        post: posts[1]._id,
      },
      {
        content:
          "Debe haber sido una experiencia increíble ver los animales de cerca.",
        author: users[1]._id,
        post: posts[2]._id,
      },
    ]);
    console.log("Created comments:", comments.length);

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
