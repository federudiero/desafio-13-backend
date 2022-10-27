const express = require('express')
const numCpu = require('os').cpus().length
const cluster  = require('cluster')
const {fork} = require('child_process');


if(cluster.isMaster){
    console.log(numCpu);
    console.log(`PID MASTER ${process.pid}`);

    for (let i = 0; i < numCpu; i++){
       cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
       console.log(`Work ${worker.process.pid} died`);
       cluster.fork()
   });
} else { //Parte subprocesos, logica de la aplicacion
    const app = express();
    const PORT = parseInt(process.argv[2]) || 8080;
    
    app.get('/', (req, res) => {
        res.send(`Servidor en puerto ${PORT} - PID ${process.pid} = ${new Date().toLocaleDateString()}`)
    })

    app.get('/info', (req, res) => {
        const arreglo = [{
            "Directorio Actual: ": process.cwd(),
            "Id del Proceso: ": process.pid,
            "Version de Node: ": process.version,
            "Titulo del Proceso: ": process.title,
            "Sistema Operativo: ": process.platform,
            "Memoria: ": process.memoryUsage().rss, 
            "Procesadores": numCpu
        }]
    
        res.send(arreglo)
    })

    app.get('/api/randoms', (req,res) => {
        const computo = fork('./NginxNode/computo.js');
        computo.send('start');
        computo.on('message', (suma) => {
            res.end(`La suma es: ${suma}`)
        })
    })
    
    app.listen(PORT, err => {
        if(!err) console.log(`Servidor Escuchando en puerto ${PORT} - PID ${process.pid}`);
    })

}



