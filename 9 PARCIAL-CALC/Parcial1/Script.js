const pantalla = document.querySelector(".Calc-Screen");
const secondaryDisplay = document.getElementById('secondary-display');
const botones = document.querySelectorAll(".Calc-but");
const historialModalContent = document.getElementById('historial-content');
const historialPanelList = document.getElementById('historial-display');

const historialModal = document.getElementById('historial-modal');
const closeHistorialBtn = document.getElementById('close-historial');
const downloadJsonBtn = document.getElementById('download-json');

let expresion = "";
const operadores = ["+", "-", "X", "÷"];
const esOperador = valor => operadores.includes(valor);
const memoriaKey = 'calcApp-memory';
const historialKey = 'calcApp-historial';

function leerMemoria() {
    return parseFloat(localStorage.getItem(memoriaKey) || '0');
}

function guardarMemoria(valor) {
    localStorage.setItem(memoriaKey, valor.toString());
}

function leerHistorial() {
    const historial = localStorage.getItem(historialKey);
    return historial ? JSON.parse(historial) : [];
}

function guardarHistorial(historial) {
    localStorage.setItem(historialKey, JSON.stringify(historial));
}

function agregarAlHistorial(expresionAntes, resultado) {
    const historial = leerHistorial();
    const ahora = new Date().toLocaleString('es-ES');
    historial.unshift({
        operacion: expresionAntes,
        resultado: resultado,
        fecha: ahora
    });
    guardarHistorial(historial);
    actualizarVistaHistorial();
}

function actualizarVistaHistorial() {
    const historial = leerHistorial();
    const html = historial.length === 0
        ? '<p style="color: #8f8fbe; text-align: center;">Sin operaciones aún</p>'
        : historial.map((item, index) => 
            `<div class="historial-item" data-index="${index}">
                <div class="historial-operacion">${item.operacion} = ${item.resultado}</div>
                <button class="delete-hist-btn" data-index="${index}" title="Borrar">🗑️</button>
            </div>`
        ).join('');

    if (historialModalContent) historialModalContent.innerHTML = html;
    if (historialPanelList) historialPanelList.innerHTML = html;
}

function borrarHistorialIndividual(index) {
    const historial = leerHistorial();
    if (index >= 0 && index < historial.length) {
        historial.splice(index, 1);
        guardarHistorial(historial);
        actualizarVistaHistorial();
    }
}

function borrarTodoHistorial() {
    guardarHistorial([]);
    actualizarVistaHistorial();
}

function descargarHistorialJSON() {
    const historial = leerHistorial();
    const dataStr = JSON.stringify(historial, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historial-calculadora-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

const recordPanel = document.getElementById('record-panel');

document.getElementById('historial-icon').addEventListener('click', () => {
    // Alterna la visibilidad del panel lateral de historial
    if (recordPanel) {
        recordPanel.classList.toggle('hidden');
        if (!recordPanel.classList.contains('hidden')) {
            actualizarVistaHistorial();
        }
    }
});

closeHistorialBtn.addEventListener('click', () => {
    historialModal.style.display = 'none';
});

downloadJsonBtn.addEventListener('click', descargarHistorialJSON);

// Botón de descarga en el panel lateral (fuera del modal)
const downloadJsonRecordBtn = document.getElementById('download-json-record');
if (downloadJsonRecordBtn) {
    downloadJsonRecordBtn.addEventListener('click', descargarHistorialJSON);
}

const clearHistorialRecordBtn = document.getElementById('clear-historial-record');
if (clearHistorialRecordBtn) {
    clearHistorialRecordBtn.addEventListener('click', () => {
        if (confirm('¿Borrar todo el historial?')) {
            borrarTodoHistorial();
        }
    });
}

// Delegación de eventos para restaurar o borrar entradas en modal y panel lateral
[historialModalContent, historialPanelList].forEach(container => {
    if (!container) return;
    container.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-hist-btn');
        if (deleteBtn) {
            const idx = Number(deleteBtn.dataset.index);
            borrarHistorialIndividual(idx);
            return;
        }

        const item = e.target.closest('.historial-item');
        if (item) {
            const idx = Number(item.dataset.index);
            const historial = leerHistorial();
            const entry = historial[idx];
            if (entry) {
                expresion = entry.operacion.toString();
                pantalla.value = expresion;
                secondaryDisplay.textContent = expresion;
                // mostrar panel si estaba oculto
                if (recordPanel && recordPanel.classList.contains('hidden')) recordPanel.classList.remove('hidden');
                // si el click vino desde el modal, cerrarlo
                if (container === historialModalContent) historialModal.style.display = 'none';
            }
        }
    });
});


if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}

// Cargar el historial al iniciar
actualizarVistaHistorial();


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
                agregarAlHistorial(expresionAntes, resultado);
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

