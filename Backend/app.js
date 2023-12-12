import express from "express";

const app = express();
app.get("/posts", (req, res) => {
  res.send("Todos los recursos");
});

app.post("/posts", (req, res) => {
  res.send("Recurso creado");
});

app.patch("/posts/:id", (req, res) => {
  res.send("Recurso actualizado");
});

app.delete("/posts/:id", (req, res) => {
  res.send("Recurso eliminado");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
