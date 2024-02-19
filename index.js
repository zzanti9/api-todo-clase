require("dotenv").config();
const express = require("express");
const {getTareas,crearTarea,borrarTarea} = require("./db");
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

servidor.put("/api-todo", (peticion,respuesta) => {
    respuesta.send("método PUT");
});

servidor.delete("/api-todo/borrar/:id", async (peticion,respuesta) => {
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