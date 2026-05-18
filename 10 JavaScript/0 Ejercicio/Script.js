function apretar()
{
    alert("¡Hola Mundo!");  
}


let parrafo = document.querySelector("p");
let parrafo1 = document.getElementById("parrafo1");
let parrafo2 = document.getElementsByClassName("parrafo2")[0];
let pp = document.querySelectorAll(".pp")[0];    


// EVENTOS 

pp.addEventListener("click", function()
{
    alert("¡Hola Mundo!");
});



var nuevoAtributo = document.createAttribute("class");
nuevoAtributo.value = "MiClase";
document.getElementById("id1").setAttribute("class", "MiClase");



let boton = document.querySelector(".Tocar");
boton.addEventListener("click", function()
{
    let nombre = document.querySelector(".name").value;
    alert("Bienvenido: " + nombre);
});



const color = ["red", "blue", "green"];
color.splice(1, 0, "yellow");

