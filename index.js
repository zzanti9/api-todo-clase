require("dotenv").config();
const express = require("express");
const {getTareas,crearTarea} = require("./db");
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
        return respuesta.send("método POST");
    }


    siguiente("...no me enviaste tarea");
   
});

servidor.put("/api-todo", (peticion,respuesta) => {
    respuesta.send("método PUT");
});

servidor.delete("/api-todo", (peticion,respuesta) => {
    respuesta.send("método DELETE");
});

servidor.use((peticion,respuesta) => {
    respuesta.json({ error : "not found" });
});

servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.send("..error")
});



servidor.listen(process.env.PORT);