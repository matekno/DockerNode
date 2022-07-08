import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';


// Estos inputs son en realidad lo que vendria desde alguna api o servicio externo..
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

// TODO: Hashear la passwd
// Aca creo un volumen y lo conecto con el container...
const scriptcito = `docker volume create ${input.id} && docker run -d --name=${input.container_name} -e PUID=1000 -e PGID=1000 -e TZ=Europe/London -e PASSWORD=${input.passwd} -e HASHED_PASSWORD= -e SUDO_PASSWORD=${input.passwd} -e SUDO_PASSWORD_HASH= -e DEFAULT_WORKSPACE=/config/workspace -p ${input.port}:8443 -v ${input.id}:/config --restart unless-stopped lscr.io/linuxserver/code-server:latest`
const scriptcito2 = `docker volume create ${input2.id} && docker run -d --name=${input2.container_name} -e PUID=1000 -e PGID=1000 -e TZ=Europe/London -e PASSWORD=${input2.passwd} -e HASHED_PASSWORD= -e SUDO_PASSWORD=${input2.passwd} -e SUDO_PASSWORD_HASH= -e DEFAULT_WORKSPACE=/config/workspace -p ${input2.port}:8443 -v ${input2.id}:/config --restart unless-stopped lscr.io/linuxserver/code-server:latest`


// Aca ejecuto directo desde node ambos scripts.
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