import fs from 'fs';
import yaml from 'js-yaml';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';


// Simulo un input para hacer todo piola.
const input = {
    container_name: "juan",
    id : `juan-${uuidv4()}`,
    passwd: "HolaHola123!",
    port: 1443
}
const input2 = {
    container_name: "mati",
    id : `mati-${uuidv4()}`,
    passwd: "ChauChau987!",
    port: 2443
}



const yamlsito = `
---
version: "2.1"
services:
  code-server:
    image: lscr.io/linuxserver/code-server:latest
    container_name: ${input.container_name} # var nombreContainer
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/Argentina/Buenos_Aires
      - PASSWORD=${input.passwd} # var passwd
      - HASHED_PASSWORD= # se puede hashear sin problema en node y guardar eso, de hecho es mejor.
      - SUDO_PASSWORD=${input.passwd} # var passwd
      - SUDO_PASSWORD_HASH= # lo mismo
      - PROXY_DOMAIN=roosevelt.rapo.com.ar # hay que pensar. Puede ser todo el mismo puerto y con un proxy redirigir a otro subdominio.
      - DEFAULT_WORKSPACE=/config/workspace # esto habria que ver si es lo mas comodo. Tambien hay que averiguar como instalar cosas ahi por default, calculo que forkeando el Dockerfile original...
    volumes:
      - "C:/Users/matir/AppData/Roaming/docker-volumes:/config" # esto hay que verlo..
    ports:
      - 8443:${input.port} # var port
    restart: unless-stopped`


try {
    // Aca intente usar directamente el YML de docker compose, pero fracase. Deberia seguir probando mejorando el binding de los puertos, pero la verdad....
    // Consultar si se puede correr un docker compose varias veces (?
    const yamlStr = yaml.dump(yamlsito)
    const name = uuidv4();
    const newFile = name + ".yml";
    fs.writeFileSync(newFile, yamlStr, 'utf8');

    // Emprolijo el nuevo .yml que por alguna razon que desconozco aparece con unos espacios raros en las primeras dos lineas..
    let content = fs.readFileSync('./' + newFile).toString().split('\n');
    content.splice(0,2);
    content = content.join('\n');
    fs.writeFileSync(newFile, content);
} catch (e) {
    console.log(e);
}


// Probando con docker run en lugar de docker compose..
const scriptcito = `docker volume create ${input.id} && docker run -d --name=${input.container_name} -e PUID=1000 -e PGID=1000 -e TZ=Europe/London -e PASSWORD=${input.passwd} -e HASHED_PASSWORD= -e SUDO_PASSWORD=${input.passwd} -e SUDO_PASSWORD_HASH= -e DEFAULT_WORKSPACE=/config/workspace -p ${input.port}:8443 -v ${input.id}:/config --restart unless-stopped lscr.io/linuxserver/code-server:latest`
const scriptcito2 = `docker volume create ${input2.id} && docker run -d --name=${input2.container_name} -e PUID=1000 -e PGID=1000 -e TZ=Europe/London -e PASSWORD=${input2.passwd} -e HASHED_PASSWORD= -e SUDO_PASSWORD=${input2.passwd} -e SUDO_PASSWORD_HASH= -e DEFAULT_WORKSPACE=/config/workspace -p ${input2.port}:8443 -v ${input2.id}:/config --restart unless-stopped lscr.io/linuxserver/code-server:latest`

exec(scriptcito, (error, stdout, stderr) => {
    if (error) {
        console.error(`error: ${error.message}`);
        return;
    }

    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout:\n${stdout}`);
});

exec(scriptcito2, (error, stdout, stderr) => {
    if (error) {
        console.error(`error: ${error.message}`);
        return;
    }

    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout:\n${stdout}`);
});