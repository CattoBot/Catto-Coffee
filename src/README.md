# ¡Hola desarrolladores!

Este es el código completo de Catto Coffee, nuestro bot de Discord.

Dada nuestra experiencia en el desarrollo de bots hemos adoptado una estructura un tanto peculiar apoyándonos en la Programación Orientada a Objetos (POO) gracias a Sapphire Framework.

## Sigamos el proceso de encendido
El bot se inicia al iniciar con Node el archivo [`app.ts`](./app.ts), o su equivalencia transpilada, `app.js`.

Éste se encargará de monitorizar el inicio del cliente y efectuar el login de Discord que mantendrá el código activo. El cliente se carga desde [`./app/client.ts`](./app/client.ts), dónde se iniciará el cliente Sapphire personalizado para Catto Coffee. Éste será también el encargado de contener, ejecutar y gestionar los handlers de comandos, los builders, tasks, etc...

A partir de aquí, los archivos son llamados por el framework, es decir, el framework escanea el repositorio en búsqueda de los archivos correspondientes a las configuracions dadas y carga en memoria de forma permanente el contenido de los módulos oportunos, por ejemplo el código de ejecución de comandos o constructores de interacciones. Otros fragmentos, como los constructores de comandos o eventos de ejecución única (Como el Ready) son cargados y eliminados tan pronto son utilizados.

Acceda a cualquier directorio y lea su README para conocer la utilidad que tiene.