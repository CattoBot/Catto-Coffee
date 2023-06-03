<h1 align="center">
  <b>Catto Coffee</b>
</h1>
<br>

Catto es un proyecto actualmente en desarrollo de un Bot de Discord, se desarrolla usando las librerias de [Sapphire](https://www.sapphirejs.dev/) y [discord.js](https://discord.js.org/#/) como herramientas principales y para el manejo de base de datos, [MySQL](https://www.mysql.com/products/workbench/) con [Prisma ORM](https://www.prisma.io/).

Tras clonar el proyecto se debe ejecutar el siguiente comando
```
npm install
```

Luego se debe editar los archivos `.env.example` y renombrarlo a `.env` luego llenar los campos dentro de ese archivo y el archivo `config.ts` para cambios adicionales.
<br>
Luego se ejecuta el siguiente comando (OJO: Debes haber realizado ya tu conexión a tu base de datos MySQL)

```
npx prisma migrate dev --name init
```
Para configurar las tablas y todo lo necesario a la base de datos.
<br>
Y finalmente una vez terminados todos estos pasos, ejecutar el proyecto con
```
npm run dev
```
