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
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      {
        name: "Carlos López",
        email: "carlos@example.com",
        password: "123456",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      },
      {
        name: "Ana Torres",
        email: "ana@example.com",
        password: "123456",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      },
      {
        name: "Luis Fernández",
        email: "luis@example.com",
        password: "123456",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      },
      {
        name: "Sofía Martínez",
        email: "sofia@example.com",
        password: "123456",
        avatar: "https://randomuser.me/api/portraits/women/6.jpg",
      },
      {
        name: "Diego Gómez",
        email: "diego@example.com",
        password: "123456",
        avatar: "https://randomuser.me/api/portraits/men/7.jpg",
      },
      {
        name: "Laura Ruiz",
        email: "laura@example.com",
        password: "123456",
        avatar: "https://randomuser.me/api/portraits/women/8.jpg",
      },
      {
        name: "Miguel Sánchez",
        email: "miguel@example.com",
        password: "123456",
        avatar: "https://randomuser.me/api/portraits/men/9.jpg",
      },
      {
        name: "Elena Díaz",
        email: "elena@example.com",
        password: "123456",
        avatar: "https://randomuser.me/api/portraits/women/10.jpg",
      },
    ]);
    console.log("Created users:", users.length);

    // Create posts
    const posts = await Post.create([
      {
        title: "Aventura en la selva amazónica",
        desc: "Explorando la biodiversidad y paisajes únicos de la Amazonía.",
        image:
          "https://images.unsplash.com/photo-1502920917128-1aa500764b54?w=800",
        location: "Amazonas, Brasil",
        author: users[0]._id,
        likes: [users[1]._id, users[2]._id],
      },
      {
        title: "Luces del norte en Islandia",
        desc: "Ver la aurora boreal bajo cielos estrellados es mágico.",
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
        location: "Reikiavik, Islandia",
        author: users[1]._id,
        likes: [users[0]._id, users[3]._id],
      },
      {
        title: "Rutas del vino en Mendoza",
        desc: "Cata de vinos y paisajes cordilleranos inolvidables.",
        image:
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
        location: "Mendoza, Argentina",
        author: users[2]._id,
        likes: [users[4]._id],
      },
      {
        title: "Safari en Kenia",
        desc: "Encuentro cercano con la fauna africana en Masai Mara.",
        image:
          "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800",
        location: "Masai Mara, Kenia",
        author: users[3]._id,
        likes: [users[5]._id, users[6]._id],
      },
      {
        title: "Templos de Angkor Wat",
        desc: "Amanecer sobre los templos milenarios de Camboya.",
        image:
          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
        location: "Siem Reap, Camboya",
        author: users[4]._id,
        likes: [users[0]._id],
      },
      {
        title: "Playas de Maldivas",
        desc: "Relajación total en playas de arena blanca y aguas turquesa.",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        location: "Maldivas",
        author: users[5]._id,
        likes: [users[7]._id],
      },
      {
        title: "Escalada en los Alpes",
        desc: "Panorámicas alpinas y aire puro en montaña.",
        image:
          "https://images.unsplash.com/photo-1517821099601-8cc03b96b003?w=800",
        location: "Alpes, Suiza",
        author: users[6]._id,
        likes: [users[2]._id],
      },
      {
        title: "Cultura en Kioto",
        desc: "Templos, jardines zen y tradición japonesa viva.",
        image:
          "https://images.unsplash.com/photo-1555169062-0133dcb16aef?w=800",
        location: "Kioto, Japón",
        author: users[7]._id,
        likes: [users[3]._id],
      },
      {
        title: "Carretera Austral en bicicleta",
        desc: "Ruta extrema y paisajes patagónicos impresionantes.",
        image:
          "https://images.unsplash.com/photo-1541647858039-dc01f028f93b?w=800",
        location: "Patagonia, Chile",
        author: users[8]._id,
        likes: [users[1]._id],
      },
      {
        title: "Road trip por la Ruta 66",
        desc: "Recorrer la histórica Ruta 66 de costa a costa en EE.UU.",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
        location: "Ruta 66, EE.UU.",
        author: users[9]._id,
        likes: [users[0]._id, users[5]._id],
      },
    ]);
    console.log("Created posts:", posts.length);

    // Create comments
    const comments = await Comment.create([
      {
        content: "¡Qué aventura tan increíble!",
        author: users[1]._id,
        post: posts[0]._id,
      },
      {
        content: "¿Cuánto tiempo estuviste allí?",
        author: users[2]._id,
        post: posts[0]._id,
      },
      {
        content: "Las auroras se ven preciosas.",
        author: users[0]._id,
        post: posts[1]._id,
      },
      {
        content: "Me encanta el vino argentino!",
        author: users[3]._id,
        post: posts[2]._id,
      },
      {
        content: "Sueño con un safari así.",
        author: users[4]._id,
        post: posts[3]._id,
      },
      {
        content: "Los templos son majestuosos.",
        author: users[5]._id,
        post: posts[4]._id,
      },
      {
        content: "Playas de ensueño.",
        author: users[6]._id,
        post: posts[5]._id,
      },
      {
        content: "Alpes en bicicleta es un reto.",
        author: users[7]._id,
        post: posts[6]._id,
      },
      {
        content: "Me fascina la cultura japonesa.",
        author: users[8]._id,
        post: posts[7]._id,
      },
      {
        content: "Ruta 66 en moto es lo mejor!",
        author: users[9]._id,
        post: posts[9]._id,
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
