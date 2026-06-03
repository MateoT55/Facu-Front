let boton = document.getElementById("addTaskBtn");


boton.addEventListener("click", function()
{
    let textoTarea = document.getElementById("newTaskInput").value;

    let li = document.createElement("li");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "taskCheckbox";

    let span = document.createElement("span");
    span.textContent = textoTarea;
    span.className = "taskText";

    checkbox.addEventListener("change", function()
    {
        if(checkbox.checked)
        {
            li.classList.add("completed");
        }
        else
        {
            li.classList.remove("completed");
        }
    });

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

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(botonEliminar);

    document.getElementById("taskList").appendChild(li);


    document.getElementById("newTaskInput").value = "";

});
