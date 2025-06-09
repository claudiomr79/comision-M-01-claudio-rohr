# 🧪 **Estructura de Testing - Plataforma Interactiva de Viajes**

Esta carpeta contiene todos los archivos relacionados con testing y debugging del proyecto, organizados de manera profesional para facilitar el mantenimiento y escalabilidad.

## 📁 **Estructura de Carpetas**

### `/backend` - Tests Unitarios del Servidor

Contiene tests unitarios que verifican la funcionalidad del backend (API, controladores, modelos):

- `general.test.js` - Tests generales del servidor (healthcheck, 404s)
- `user.test.js` - Tests de autenticación y gestión de usuarios
- `post-comment-like.test.js` - Tests integrados de posts, comentarios y likes

### `/frontend` - Tests del Cliente (Futuro)

Reservada para tests unitarios y de componentes del frontend React:

- Tests de componentes (.test.jsx)
- Tests de hooks personalizados
- Tests de contextos (AuthContext)

### `/integration` - Tests de Integración (Futuro)

Para tests que verifican la comunicación entre frontend y backend:

- Tests de flujos completos
- Tests de API end-to-end
- Tests de autenticación completa

### `/e2e` - Tests End-to-End

Tests que verifican la funcionalidad completa desde la perspectiva del usuario:

- `test-app.html` - Test de la aplicación completa
- `test-auth.html` - Test del sistema de autenticación

### `/debug` - Scripts de Debugging

Scripts utilitarios para debugging y diagnóstico:

- `debug-auth-posts.js` - Debug de autenticación y posts
- `debug-auth-simple.js` - Debug simple de autenticación
- `debug-ids.js` - Debug de IDs y referencias
- `debug-permissions.js` - Debug de permisos y roles
- `debug-super.js` - Debug avanzado del sistema

## 🚀 **Comandos de Testing**

### Backend Tests

```bash
cd Backend
npm test
```

### Ejecutar todos los tests

```bash
# Desde la raíz del proyecto
npm run test:all
```

## 🔧 **Configuración**

Los tests del backend utilizan:

- **Jest** como framework de testing
- **Supertest** para tests de API
- **MongoDB Memory Server** para tests de base de datos

## 📝 **Convenciones**

1. **Archivos de test**: Terminan en `.test.js` o `.test.jsx`
2. **Mocks**: Se colocan en carpetas `__mocks__`
3. **Setup**: Archivos de configuración en `setup/`
4. **Fixtures**: Datos de prueba en `fixtures/`

## 🎯 **Próximos Pasos**

- [ ] Implementar tests del frontend
- [ ] Añadir tests de integración
- [ ] Configurar CI/CD con tests automáticos
- [ ] Implementar coverage reports
