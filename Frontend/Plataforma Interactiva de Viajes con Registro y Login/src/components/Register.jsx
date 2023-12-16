import React, { useEffect, useState } from "react";
import "./Register.css";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    console.log("useEffect");
    //enviar al backend para generar el token a https://localhost:4000/users/register/
    fetch("https://localhost:4000/user/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "data");
      })
      .catch((err) => console.log(err));
  }, [name, email, password, confirmPassword]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.name.value === "") {
      alert("El campo name es obligatorio");
      return;
    } else {
      setName(e.target.name.value);
    }
    if (e.target.email.value === "") {
      alert("El campo email es obligatorio");
      return;
    } else {
      setEmail(e.target.email.value);
    }
    if (e.target.password.value === "") {
      alert("El campo password es obligatorio");
      return;
    }
    if (e.target.confirmPassword.value === "") {
      alert("El campo confirmPassword es obligatorio");
      return;
    }
    if (e.target.password.value !== e.target.confirmPassword.value) {
      alert("Las contraseñas no coinciden");
      return;
    } else {
      setPassword(e.target.password.value);
    }
    console.log("Formulario enviado");
  };

  return (
    <>
      <h1>Register</h1>
      <form id="formRegister" onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" name="name" />
        <input type="email" placeholder="Email" name="email" />
        <input type="password" placeholder="Password" name="password" />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
        />
        <input type="submit" />
      </form>
      {name && <h2>Nombre: {name}</h2>}
      {email && <h2>Email: {email}</h2>}
      {password && <h2>Password: {password}</h2>}
    </>
  );
};
