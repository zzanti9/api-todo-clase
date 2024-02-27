const contenedorTareas = document.querySelector(".tareas");
const formulario = document.querySelector("form");
const inputTxt = document.querySelector('form input[type="text"]');

//peticion GET a la API(api-todo)
fetch("/api-todo")
.then(respuesta => respuesta.json())
.then(tareas => {
    tareas.forEach(({id,tarea,terminada}) => {
        new Tarea(id,tarea,terminada,contenedorTareas);
    });
});

//peticion POST a la API(api-todo)
formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    if(/^[a-záéíóúñü][a-záéíóúñü0-9 ]*$/i.test(inputTxt.value)){
        return fetch("/api-todo/crear", {
            method : "POST",
            body :JSON.stringify({ tarea : inputTxt.value }),
            headers : {
                "Content-type" : "application/json"
            }
        })
        .then(respuesta => respuesta.json())
        .then(({id}) => {
            if(id){
                new Tarea(id,inputTxt.value.trim(),false,contenedorTareas);
                return inputTxt.value = "";
            }
            console.log("..error creando la tarea")
        })
    }
    console.log("error en el formulario");
});

  