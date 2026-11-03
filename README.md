# ERP Asepsis - Módulo de Logística (Ambiente de Desarrollo Local)

Repositorio oficial de trabajo: [https://github.com/asepsis-systems/ERP](https://github.com/asepsis-systems/ERP)

Este proyecto es una copia de desarrollo independiente creada para probar y diseñar flujos del **Módulo de Logística** (Inventario, Almacén, Proveedores, Órdenes de Compra y Kardex) de forma 100% aislada y segura en tu laptop.

---

## 🛡️ Seguridad y Aislamiento

- **Base de Datos Local:** Utiliza **SQLite** (`prisma/dev.db`), por lo que cualquier cambio, eliminación o prueba no toca bases de datos de producción ni a Google Cloud SQL.
- **Puerto dedicado:** Corre en el puerto `3005` (`http://localhost:3005`) para no generar conflictos con otros sistemas locales que usen el puerto 3000.

---

## 🚀 Cómo Iniciar el Proyecto en tu Laptop

Abre una terminal en esta carpeta:
```bash
cd "C:\Users\willi\Desktop\ERP-LOGISTICA-DEV"
```

1. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
2. Abre tu navegador en:
   👉 **[http://localhost:3005](http://localhost:3005)**

---

## 📦 Comandos Útiles

- **Ver o editar los datos de SQLite visualmente:**
  ```bash
  npm run db:studio
  ```
- **Sincronizar cambios en `schema.prisma` hacia tu base de datos local:**
  ```bash
  npm run db:push
  ```
- **Volver a poblar con datos de prueba iniciales:**
  ```bash
  npm run db:seed
  ```

---

## 🌿 Flujo de Versiones para Pasar Cambios a Producción

1. **Trabajar en tu rama propia:**
   ```bash
   git checkout -b feature/logistica-william
   ```
2. **Guardar y subir tus avances a GitHub:**
   ```bash
   git add .
   git commit -m "feat(logistica): mejoras en modulo de compras e inventario"
   git push -u origin feature/logistica-william
   ```
3. **Paso a Pruebas (DEV):**
   - Una vez que tus cambios estén probados en local, se hace un Pull Request en GitHub para fusionarlo con la rama de pruebas (DEV).
4. **Paso a Producción:**
   - Tras validar en DEV, se aprueba el merge hacia `main`/producción con cero riesgo de romper el sistema.
