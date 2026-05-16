

function showAlert(Nombreombr)
{
    let Nombre = document.querySelector(".Nombre").value;
    alert("Bienvenido: " + Nombre);

}


function Alert()
{
    let Apellido = prompt("Diga su apellido");
    alert("Bienvenido: " + Apellido);
}


let limite = prompt("Ingrese un NUMERO de extraccion");
let limiteNumerico = parseInt(limite);

if (!isNaN(limiteNumerico)) {
    console.log("El limite actualizado es: " + limiteNumerico);
}
else
{
    alert("por favor ingrese un numero valido");
}


