function calculo() {
    let suma = 0;
    for(let i = 0; i < 1e8; i++){
            suma += i;
                }     
    
    return suma;
};

process.on('message',(message, cant) => {
    if(message === 'start'){
        console.log('child process start');
        const result = calculo();
        process.send(result);
    }
})