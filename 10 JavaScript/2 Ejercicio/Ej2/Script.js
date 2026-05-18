let boton = document.getElementById("addTaskBtn");

boton.addEventListener("click", function()
{
    let textoTarea = document.getElementById("newTaskInput").value;

    // Crear el elemento <li>
    let li = document.createElement("li");
    li.textContent = textoTarea;

    // Crear el botón X
    let botonEliminar = document.createElement("button");
    botonEliminar.textContent = "X";
    botonEliminar.className = "deleteBtn";

    // Evento para eliminar la tarea
    botonEliminar.addEventListener("click", function()
    {
        li.remove();
    });




    // Agregar el botón al li
    li.appendChild(botonEliminar);

    // Agregar el li a la lista
    document.getElementById("taskList").appendChild(li);






    // Limpiar el input
    document.getElementById("newTaskInput").value = "";

});