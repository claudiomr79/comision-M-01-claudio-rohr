/**
 * CONFIGURACIÓN DE VITE - FRONTEND DE LA PLATAFORMA DE VIAJES
 *
 * Este archivo contiene la configuración de Vite para el desarrollo y construcción
 * del frontend de la plataforma interactiva de viajes. Vite es el bundler utilizado
 * para el desarrollo rápido de aplicaciones React con Hot Module Replacement (HMR).
 *
 * @author Tu nombre
 * @version 1.0.0
 */

// Importación de la función defineConfig de Vite para configuración tipada
import { defineConfig } from "vite";
// Importación del plugin oficial de React para Vite
import react from "@vitejs/plugin-react";

/**
 * Configuración de Vite
 *
 * Configuraciones incluidas:
 * - Plugin de React: Habilita el soporte completo para React con JSX y HMR
 * - Puerto por defecto: 5173 (configurado automáticamente por Vite)
 * - Hot Module Replacement: Habilitado automáticamente en desarrollo
 *
 * Documentación oficial: https://vitejs.dev/config/
 */
export default defineConfig({
  // Array de plugins de Vite
  plugins: [
    // Plugin de React para soporte completo de JSX, Fast Refresh y optimizaciones
    react(),
  ],
  // Configuración del servidor de desarrollo (puerto 5173 por defecto)
  // Configuración de build automática para producción
});
