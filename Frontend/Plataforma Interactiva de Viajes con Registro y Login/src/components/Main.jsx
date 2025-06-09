/**
 * COMPONENTE MAIN - CONTENEDOR PRINCIPAL DE LA APLICACIÓN
 *
 * Este componente actúa como un contenedor principal que agrupa los componentes
 * de Post y Comment. Es una implementación simple que puede ser expandida
 * para incluir más funcionalidades o layout más complejo.
 *
 * Nota: Este componente parece ser una implementación temprana o de prueba,
 * ya que la aplicación principal usa un sistema de navegación diferente.
 *
 * @author Tu nombre
 * @version 1.0.0
 */

import React from "react";
import Comment from "./Comment.jsx";
import Post from "./Post.jsx";

/**
 * Componente Main
 *
 * Renderiza los componentes principales de la aplicación en una estructura simple
 *
 * @returns {JSX.Element} Fragment que contiene los componentes Post y Comment
 */
function Main() {
  return (
    <>
      {/* Componente de Post */}
      <Post />

      {/* Componente de Comment */}
      <Comment />
    </>
  );
}

export default Main;
