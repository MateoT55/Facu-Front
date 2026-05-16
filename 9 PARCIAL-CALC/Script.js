const pantalla = document.querySelector(".Calc-Screen");
const botones = document.querySelectorAll(".Calc-but");

let expresion = "";

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const valor = boton.textContent;

        if (valor === "AC") {
            expresion = "";
        } 
        else if (valor === "DEL") {
            expresion = expresion.slice(0, -1);
        } 
        else if (valor === "=") {
            try {
                let resultado = eval(
                    expresion
                        .replace("X", "*")
                        .replace("÷", "/")
                );
                expresion = resultado.toString();
            } catch {
                expresion = "Error";
            }
        } 
        else {
            expresion += valor;
        }

        pantalla.value = expresion;
    });
});

