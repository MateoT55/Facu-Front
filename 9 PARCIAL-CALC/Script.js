const pantalla = document.querySelector(".Calc-Screen");
const secondaryDisplay = document.getElementById('secondary-display');
const botones = document.querySelectorAll(".Calc-but");

let expresion = "";
const operadores = ["+", "-", "X", "÷"];
const esOperador = valor => operadores.includes(valor);
const memoriaKey = 'calcApp-memory';

function leerMemoria() {
    return parseFloat(localStorage.getItem(memoriaKey) || '0');
}

function guardarMemoria(valor) {
    localStorage.setItem(memoriaKey, valor.toString());
}

function obtenerValorActual() {
    if (!expresion) return 0;
    try {
        return parseFloat(eval(expresion.replace(/X/g, '*').replace(/÷/g, '/')));
    } catch {
        return parseFloat(expresion) || 0;
    }
}

function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return null;
    let resultado = 1;
    for (let i = 2; i <= n; i++) {
        resultado *= i;
        if (!isFinite(resultado)) break;
    }
    return resultado;
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});


if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}


botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const valor = boton.textContent;

        let secondaryUpdated = false;

        if (valor === "AC") {
            expresion = "";
            secondaryDisplay.textContent = "";
            secondaryUpdated = true;
        } 
        else if (valor === "DEL") {
            expresion = expresion.slice(0, -1);
            secondaryUpdated = true;
            secondaryDisplay.textContent = expresion;
        } 
        else if (valor === "%") {
            // Reemplaza el último número por (n/100) para calcular porcentaje
            const match = expresion.match(/(\d+(?:\.\d+)?)$/);
            if (match) {
                const number = match[0];
                expresion = expresion.slice(0, -number.length) + "(" + number + "/100)";
            } else {
                expresion += "/100";
            }
        } 

        else if (valor === "±") {
            const numeroActual = expresion.match(/(-?\d+(?:\.\d+)?)$/);
            const ultimo = expresion.slice(-1);
            if (numeroActual) {
                const numero = numeroActual[0];
                const invertido = numero.startsWith("-") ? numero.slice(1) : "-" + numero;
                expresion = expresion.slice(0, -numero.length) + invertido;
            } else if (expresion === "") {
                expresion = "-";
            } else if (esOperador(ultimo) && ultimo !== "-") {
                expresion += "-";
            }
        }

        else if (valor === "√") {
            const match = expresion.match(/(-?\d+(?:\.\d+)?)$/);
            if (match) {
                const numero = parseFloat(match[0]);
                if (numero < 0) {
                    expresion = "Error";
                    secondaryDisplay.textContent = `√(${match[0]})`;
                } else {
                    const resultado = Math.sqrt(numero);
                    expresion = expresion.slice(0, -match[0].length) + resultado.toString();
                    secondaryDisplay.textContent = `√(${match[0]})`;
                }
                secondaryUpdated = true;
            }
        }
        else if (valor === "x²") {
            const match = expresion.match(/(-?\d+(?:\.\d+)?)$/);
            if (match) {
                const numero = parseFloat(match[0]);
                const resultado = numero ** 2;
                expresion = expresion.slice(0, -match[0].length) + resultado.toString();
                secondaryDisplay.textContent = `(${match[0]})²`;
                secondaryUpdated = true;
            }
        }
        else if (valor === "x!") {
            const match = expresion.match(/(-?\d+(?:\.\d+)?)$/);
            if (match) {
                const numero = parseFloat(match[0]);
                const resultado = factorial(numero);
                expresion = resultado === null ? "Error" : expresion.slice(0, -match[0].length) + resultado.toString();
                secondaryDisplay.textContent = `${match[0]}!`;
                secondaryUpdated = true;
            }
        }

        else if (valor === "MC") {
            localStorage.removeItem(memoriaKey);
        }
        else if (valor === "MR") {
            expresion = leerMemoria().toString();
        }
        else if (valor === "M+") {
            const nuevoValor = leerMemoria() + obtenerValorActual();
            guardarMemoria(nuevoValor);
        }
        else if (valor === "M-") {
            const nuevoValor = leerMemoria() - obtenerValorActual();
            guardarMemoria(nuevoValor);
        }






        else if (esOperador(valor)) {
            const ultimo = expresion.slice(-1);
            if (expresion === "") {
                return;
            }
            if (esOperador(ultimo)) {
                return;
            }
            expresion += valor;
            secondaryUpdated = true;
            secondaryDisplay.textContent = expresion;
        }




        else if (valor === "=") {
            const expresionAntes = expresion;
            try {
                let resultado = eval(
                    expresion
                        .replace("X", "*")
                        .replace("÷", "/")
                );
                expresion = resultado.toString();
                secondaryDisplay.textContent = expresionAntes;
            } catch {
                expresion = "Error";
                secondaryDisplay.textContent = expresionAntes;
            }
        } 
        else {
            expresion += valor;
            secondaryDisplay.textContent = expresion;
        }

        if (!secondaryUpdated && valor !== "=") {
            secondaryDisplay.textContent = expresion;
        }

        pantalla.value = expresion;
    });
});

