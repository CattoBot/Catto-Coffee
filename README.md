<h1 align="center">
  <b>Catto Coffee</b>
</h1>
<br>

<p align="center">
  <img src="assets/img/client/catto light.png" alt="Catto Coffee">
</p>
<br>

Catto es un proyecto actualmente en desarrollo de un Bot de Discord, se desarrolla usando las librerías de [Sapphire](https://www.sapphirejs.dev/) y [discord.js](https://discord.js.org/#/) como herramientas principales y para el manejo de base de datos, [MySQL](https://www.mysql.com/products/workbench/) con [Prisma ORM](https://www.prisma.io/).

### Setup

Una vez clonado el proyecto, es necesario tener instalado [Docker](https://www.docker.com/products/docker-desktop/). Teniendo esto presente, simplemente vamos a renombrar el archivo `.env.example` a `.env` y simplemente colocar el token del bot en la propiedad `BOT_TOKEN`. Lo demas recomendable dejarlo como está.

> Recomendable no cambiarlo ya que facilita su despliegue, sin embargo para ello habria que modificar el archivo `docker-compose.yml`.

Una vez modificadas las variables de entorno simplemente correr el comando
```cmd
docker-compose up
```
