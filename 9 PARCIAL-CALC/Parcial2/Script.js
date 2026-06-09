// Agarro los elementos del HTML con los que voy a interactuar mas adelante
const pantalla = document.getElementById("display");
const pantallaSecundaria = document.getElementById("secondary-display");
const botones = document.querySelectorAll(".Calc-but");
const panelHistorial = document.getElementById("record-panel");
const listaHistorial = document.getElementById("historial-display");

// Creo variables para mas adelante, por ejemplo para guardar lo que el usuario escribe, para saber si apreto el igual
// Y que no desborde la pantalla
let expresion = "";
let resultadoMostrado = false; 
const LIMITE_DIGITOS = 20; 


// Defino constantes para guardar las cosas en el navegador
const memoria_key = 'calcApp-memory';
const historial_key = 'calcApp-historial';


// Lee lo que esta en el localStorage en caso de no haber nada devuelve un cero.
// Cualquier cosa que traiga la parsea para que quede en numero y no en String
function leerMemoria() 
{ 
    return parseFloat(localStorage.getItem(memoria_key) || '0'); 
}


// Aca setteo usando el local Storage con Clave Valor, ingreso la clave y el valor lo paso a String
// Ya que el localStorage solo guarda string.
function guardarMemoria(valor) 
{ 
    localStorage.setItem(memoria_key, valor.toString()); 
}

// Traigo el historial completo, en caso de estar vacio devuelvo un array vacio
function leerHistorial() 
{
    const historial = localStorage.getItem(historial_key); // La constante His.. guarda historial
    // en string
    return historial ? JSON.parse(historial) : [];
}

// Aca lo que quedo como arreglo lo paso a string devuelta y lo mando a memoria de localStorage
function guardarHistorial(historial) 
{ 
    localStorage.setItem(historial_key, JSON.stringify(historial)); 
}




function actualizarVistaHistorial() {
    const historial = leerHistorial();
    if (historial.length === 0) {
        listaHistorial.innerHTML = '<p style="color: #8f8fbe; text-align: center;">Sin operaciones aún</p>';
        return;
    }

    // Se utiliza el innerHTML ya que se va a insertar codigo HTML y el .map es para recorrer el
    // array ya que el historial era un array, después nos lo da en item y index
    listaHistorial.innerHTML = historial.map((item, index) => 
        `<div class="historial-item" data-index="${index}">
            <span class="hist-op">${item.operacion} = ${item.resultado}</span>
            <button class="delete-hist-btn" data-index="${index}" title="Borrar">X</button>
        </div>`
    ).join(''); // El .join sirve para convertir un array a un string 
}


// La logica que hay es que todo va primero al LocalStorage y desde se traen las cosas para 
// interactuar.
function agregarAlHistorial(operacion, resultado) 
{
    const historial = leerHistorial();
    historial.unshift({ operacion, resultado }); // el unshift inserta al principio para que 
    // la ultima operacion sea la mas reciente
    guardarHistorial(historial);
    actualizarVistaHistorial();
}



// Acá usamos el .toggle para alternar entre el modo light o dark.

document.getElementById('theme-toggle').addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark'); // Acá al principio tuve la 
    // intencion de settear el tema en localStorage para que cuando carguen la pagina este eso
    // después de mandarlo, revise y me di cuenta que no lo habia cargado en la pagina
});



// Muestra o Oculta el Panel de Historial de operaciones
document.getElementById('historial-icon').addEventListener('click', () => {
    panelHistorial.classList.toggle('hidden');
});




listaHistorial.addEventListener('click', (e) => {
    const btnBorrar = e.target.closest('.delete-hist-btn');  // E.target.closet se utiliza para buscar hacia arriba en el DOM el selector mas cercano de CSS
    const itemClick = e.target.closest('.historial-item');

    if (btnBorrar) {
        const index = btnBorrar.dataset.index; // Busco la posición
        const historial = leerHistorial(); // Traigo la lista completa del LocalStorage
        historial.splice(index, 1); // Lo Elimino a esa operación
        guardarHistorial(historial); // Guardo la lista sin la operación que elimine
        actualizarVistaHistorial(); // Actualizo la lista para que la vea el usuario
    } 
    
    else if (itemClick && !btnBorrar) {
        const index = itemClick.dataset.index; // Busco la posición
        const historial = leerHistorial(); // Traigo la lista completa del LocalStorage
        expresion = historial[index].operacion; // Agarro la cueta guardada
        pantalla.value = expresion; // La muestro en pantalla
    }
});



// Sintaxis de descargar el Historial de Operaciones en formato .JSON
/*
function descargarJSON(objeto, nombreArchivo) {
    // 1. Convertir el objeto a string JSON
    const datosJSON = JSON.stringify(objeto, null, 2);
    
    // 2. Crear un blob con los datos y el tipo MIME
    const blob = new Blob([datosJSON], { type: 'application/json' });
    
    // 3. Crear un enlace temporal
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo;
    
    // 4. Simular el click
    enlace.click();
} 
*/
document.getElementById('download-json-record').addEventListener('click', () => {
    const dataStr = JSON.stringify(leerHistorial(), null, 2); // Traigo el historial
    const blob = new Blob([dataStr], { type: 'application/json' }); // Convierto el historial a JSON
    const url = URL.createObjectURL(blob); // Lo meto en un URL
    const link = document.createElement('a'); // Creo un enlace temporal
    link.href = url; // Le doy la direccion de la URL
    link.download = `HistorialCalcApp.json`; // Le doy el nombre
    link.click(); // Fuerzo el click a para la descarga
});




document.getElementById('clear-historial-record').addEventListener('click', () => {
    if (confirm('¿Estás seguro de borrar todo el historial?')) {
        guardarHistorial([]); // Guardo un array vacio para borrar todo
        actualizarVistaHistorial();
    }
});



// El factorial es una función que multiplica todos los enteros desde 1 hasta n. Si el número es negativo o decimal, no tiene sentido matemático en este contexto, entonces devuelvo error.
function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return "Error";
    if (n === 0) return 1;
    let res = 1;
    for (let i = 1; i <= n; i++) res *= i;
    return res;
}


// Acá nos acordamos que expresión era lo que el usuario tipeaba, la variable.
function evaluarExpresion() {
    if (!expresion) return;


    // Validamos que no se haga una división por 0 y en ese caso tiramos un error
    if (expresion.includes('/0') && !expresion.includes('/0.')) {
        pantallaSecundaria.textContent = expresion + " =";
        expresion = "No se puede dividir por cero";
        pantalla.value = expresion;
        resultadoMostrado = true;
        return;
    }


    // Se hace dentro de un Try para capturar errores
    try {


        let operacionJS = expresion.replace(/X/g, '*').replace(/÷/g, '/'); 
        // Aca antes de hacer la operación, remplazamos los simbolos que pusimos por los que se utilizan realmente para hacer una operación.
        

        let resultado = eval(operacionJS); 
        
        if (!isFinite(resultado) || isNaN(resultado)) throw new Error("Inválido");


        resultado = Math.round(resultado * 100000000) / 100000000;
        // Esto viene a solucionar el problema de usar decimelaes, simplifica los decimales para que no muestre muchos despues de la coma.

        agregarAlHistorial(expresion, resultado);
        pantallaSecundaria.textContent = expresion + " =";
        expresion = resultado.toString();
        pantalla.value = expresion;
        resultadoMostrado = true;

    } catch (e) {
        pantallaSecundaria.textContent = "Error de sintaxis";
        expresion = "Error";
        pantalla.value = expresion;
        resultadoMostrado = true;
    }
}



function procesarBoton(valor) {
    // Si la expresión actual quedó en un estado de error, la limpio para que el usuario pueda empezar de nuevo.
    if (expresion === "Error" || expresion === "No se puede dividir por cero") {
        expresion = "";
    }
    // Lista de botones que no deben borrar automáticamente el resultado anterior cuando el usuario ya había mostrado un resultado.
    const excepcionesLimpieza = ['+', '-', 'X', '÷', '%', 'M+', 'M-', 'MR', 'MC', '±'];

    // Si el usuario despues de mostrar un resultado toca algun numero que no sea un simbolo de excepcion se reinicia
    if (resultadoMostrado && !excepcionesLimpieza.includes(valor)) {
        expresion = "";
        resultadoMostrado = false;
    }


    // Reseteo la bandera para el flujo actual. Sirve para que la calculadora sepa que ya no está “pegada” al resultado anterior.
    resultadoMostrado = false;



    // Control de longitud: si la expresión supera el límite, no dejo seguir escribiendo, salvo que sea AC, DEL o =
    if (expresion.length >= LIMITE_DIGITOS && valor !== "AC" && valor !== "DEL" && valor !== "=") {
        pantallaSecundaria.textContent = "Límite de dígitos alcanzado";
        return; 
    }

    if (valor === "AC") {
        expresion = "";
        pantallaSecundaria.textContent = "";
    }
    else if (valor === "DEL") {
        expresion = expresion.slice(0, -1);
    }
    else if (valor === "=") {
        evaluarExpresion();
        return; 

    }
    else if (valor === "√") {
        if (expresion !== "") {
            let calc = eval(expresion.replace(/X/g, '*').replace(/÷/g, '/'));
            if (calc < 0) { 
                expresion = "Error"; 
                pantallaSecundaria.textContent = "Raíz negativa"; 
            } else { 
                let resultado = Math.sqrt(calc);
                resultado = Math.round(resultado * 100000000) / 100000000;
                pantallaSecundaria.textContent = `√(${calc})`;
                agregarAlHistorial(`√(${calc})`, resultado);
                expresion = resultado.toString(); 
            }
            resultadoMostrado = true;
        }
    }
    else if (valor === "x²") {
        if (expresion !== "") {
            let calc = eval(expresion.replace(/X/g, '*').replace(/÷/g, '/'));
            let resultado = Math.pow(calc, 2);
            resultado = Math.round(resultado * 100000000) / 100000000;
            pantallaSecundaria.textContent = `(${calc})²`;
            agregarAlHistorial(`(${calc})²`, resultado);
            expresion = resultado.toString();
            resultadoMostrado = true;
        }
    }
    else if (valor === "x!") {
        if (expresion !== "") {
            let calc = eval(expresion.replace(/X/g, '*').replace(/÷/g, '/'));
            let resultado = factorial(calc);
            pantallaSecundaria.textContent = `${calc}!`;
            agregarAlHistorial(`${calc}!`, resultado);
            expresion = resultado.toString();
            resultadoMostrado = true;
        }
    }


    else if (valor === "±") {
        if (expresion !== "") {
            let calc = eval(expresion.replace(/X/g, '*').replace(/÷/g, '/'));
            expresion = (calc * -1).toString();
        }
    }
    else if (valor === "M+") {
        if (expresion !== "") guardarMemoria(leerMemoria() + eval(expresion.replace(/X/g, '*').replace(/÷/g, '/')));
        resultadoMostrado = true;
    }
    else if (valor === "M-") {
        if (expresion !== "") guardarMemoria(leerMemoria() - eval(expresion.replace(/X/g, '*').replace(/÷/g, '/')));
        resultadoMostrado = true;
    }
    else if (valor === "MR") {
        expresion = leerMemoria().toString();
    }
    else if (valor === "MC") {
        localStorage.removeItem(memoria_key);
    }
    
    // Si no fue ningún botón especial, entra acá: o sea, se trata de un número, un operador, un paréntesis o un punto.
    else {
        const operadores = ['+', '-', 'X', '÷', '%'];
        const ultimoCaracter = expresion.slice(-1);


        // Si el usuario presiona un operador
        if (operadores.includes(valor)) {
            // No permito que empiece con un operador
            if (expresion === "" || ultimoCaracter === "(") return;
            
            // Si el ultimo digito era un operador entonces lo borro e inserto el nuevo.
            if (operadores.includes(ultimoCaracter)) {
                expresion = expresion.slice(0, -1) + valor;
                pantalla.value = expresion;
                return;
            }
        }


        if (valor === '.') {
            if (expresion === "" || operadores.includes(ultimoCaracter) || ultimoCaracter === "(") {
                expresion += "0.";
                pantalla.value = expresion;
                return;
            }
            

            // El .Split sirve para divir una cadena de string en una lista de caracteres y poder buscar un caracter
            const partes = expresion.split(/[\+\-\X\÷\%]/);
            const ultimaParte = partes[partes.length - 1];
            // Si ya hay un punto en ese número, no dejo agregar otro
            if (ultimaParte.includes('.')) return; 
        }

        expresion += valor;
    }

    pantalla.value = expresion;
}

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        
        procesarBoton(boton.textContent);
    });
});


// Aca lo que hago es darle soporte de teclado, busque la sintaxis por internet porque no sabia hacerlo
document.addEventListener('keydown', (e) => {
    const key = e.key;

    const esTeclaMatematica = /^[0-9\(\)\.\%\+\-\*\/]$/.test(key);
    const esTeclaEspecial = ['Enter', '=', 'Backspace', 'Escape'].includes(key);

    if (esTeclaMatematica || esTeclaEspecial) {
        e.preventDefault(); 

        if (/[0-9\(\)\.\%\+\-]/.test(key)) procesarBoton(key);
        
        if (key === '*') procesarBoton('X');
        if (key === '/') procesarBoton('÷');
        
        if (key === 'Enter' || key === '=') evaluarExpresion();
        
        if (key === 'Backspace') procesarBoton('DEL');
        if (key === 'Escape') procesarBoton('AC');
    }
});