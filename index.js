require("dotenv").config();
const express = require("express");
const {getTareas,crearTarea,borrarTarea,actualizarEstado,actualizarTarea} = require("./db");
const {json} = require("body-parser");


const servidor = express();

servidor.use(json());

servidor.use("/pruebas",express.static("./pruebas_api"));

servidor.get("/api-todo", async (peticion,respuesta,) => {
    try{
        let tareas = await getTareas();

        respuesta.json(tareas);

    }catch(error){
        respuesta.status(500);

        respuesta.json(error);
    }
});

servidor.post("/api-todo/crear", async (peticion,respuesta,siguiente) => {
    
    let {tarea} = peticion.body;

    if(tarea && tarea.trim() != ""){
        try{
            let id = await crearTarea({tarea});
            return respuesta.json({id});
        }catch(error){
            respuesta.status(500);
            return respuesta.json(error);
        }       
    }

    siguiente({ error : "falta el argumento tarea en el objeto JSON" });
   
});

servidor.put("/api-todo/actualizar/:id([0-9]+)/:operacion(1|2)", async (peticion,respuesta,siguiente) => {
/*    
let operacion = Number(peticion.params.operacion);

let operaciones =[actualizarTarea,actualizarEstado];

let {tarea} = peticion.body;

//SIEMPRE QUE operacion sea 1
//si no existe tarea
//en el cason de existir, que no esté vacía.
if(operacion == 1 && (!tarea || tarea.trim() == "")){
    return siguiente({ error : "petición no valida, mal formato JSON" });
}
try{
    let cantidad = await operaciones[operacion - 1](peticion.params.id, operacion == 1 ? tarea : null);
    respuesta.json({ resultado: cantidad ? "ok" : "ko" });

}catch(error){
    respuesta.status(500);
    respuesta.json(error);
}
*/

if(peticion.params.operacion == 1){

    let {tarea} = peticion.body;

    if(tarea && tarea.trim() != ""){
        try{
            let cantidad = await actualizarTarea(peticion.params.id,tarea);
            return respuesta.json({ resultado : cantidad ? "ok" : "ko" });
        }catch(error){
            respuesta.status(500);
            return respuesta.json(error);
        }       
    }

    siguiente({ error : "falta el argumento tarea en el objeto JSON" });

}else{
    try{
        let cantidad = await actualizarEstado(peticion.params.id);
        return respuesta.json({ resultado : cantidad ? "ok" : "ko" });
    }catch(error){
        respuesta.status(500);
        return respuesta.json(error);
    } 
}
});

servidor.delete("/api-todo/borrar/:id([0-9]+)", async (peticion,respuesta) => {
    try{
        let cantidad = await borrarTarea(peticion.params.id);
        return respuesta.json({resultado : cantidad ? "ok" : "ko" });
    }catch(error){
        respuesta.status(500);
        return respuesta.json(error);
    }       
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "not found" });
});

servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({ error : "petición no valida, mal formato JSON" });
});



servidor.listen(process.env.PORT);