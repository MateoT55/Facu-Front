let boton = document.getElementById("addTaskBtn");


boton.addEventListener("click", function()
{
    let textoTarea = document.getElementById("newTaskInput").value;

    let li = document.createElement("li");
    li.textContent = textoTarea;

    let botonEliminar = document.createElement("button");
    botonEliminar.textContent = "X";
    botonEliminar.className = "deleteBtn";

    botonEliminar.addEventListener("click", function()
    {
        let val = confirm("Seguro de que quieres eliminar esta tarea?");
        if(val == true)
        {
            li.remove();
        }
    });


    li.appendChild(botonEliminar);

    document.getElementById("taskList").appendChild(li);


    document.getElementById("newTaskInput").value = "";

});
