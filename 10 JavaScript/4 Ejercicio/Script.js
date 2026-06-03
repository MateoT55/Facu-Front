// let animal = new Object();

// let persona = {
//     nombre:"Mateo",
//     edad: 19
// };


// console.log(persona.nombre);


// let user = {name: "Mateo"};
// let admin = user;
// admin.name = "Lauti"
// alert(user.name);


// admin.sayHi = function() {
//     alert("Hola");
// }
// alert(admin.sayHi());



// class Persona
// {

//     Persona(nombre)
//     {
//         this._nombre = nombre;
//     }


//     get nombre()
//     {
//         return this._nombre;
//     }

//     set nombre(value)
//     {
//         this._nombre = value;
//     }

//     Nombre()
//     {
//         alert(this.nombre);
//     }
// }   


// const usuario = new Persona("Mateo");
// console.log(usuario.nombre); 

// usuario.nombre = "Fabricio";      
// console.log(usuario.nombre); 


// usuario.Nombre();


// HERENCIA DE CLASES
// class Animal
// {

//     Animal(nombre)
//     {
//         this._nombre = nombre;
//     }


//     get nombre()
//     {
//         return this._nombre;
//     }

//     set nombre(value)
//     {
//         this._nombre = value;
//     }

//     corre()
//     {
//         alert("Animal camina");
//     }

// }   


// class Tortuga extends Animal
// {
//     Tortuga(nombre)
//     {
//         this._nombre = nombre;
//     }


//     get nombre()
//     {
//         return this._nombre;
//     }

//     set nombre(value)
//     {
//         this._nombre = value;
//     }

//     // corre()
//     // {
//     //     super.corre(alert("Tortuga No corre pero si camina"));
//     // }

//     hide()
//     {
//         alert("Conejo se Esconde");
//     }
// }


// const Tor = new Tortuga("Tor");


// Tor.corre();



// FECHAS
// let now = new Date();


// let d = `${now.getHours()} : ${now.getMinutes()} : ${now.getSeconds()}`;
// alert(d);




// RECURSOS 

// let script = document.createElement('script');

// script.src = "";
// document.head.append(script);

// script.onload = function()
// {
//     alert(_.VERSION);
// }


// DEBUGGIN

// console.log("Mensaje");
// console.warn("Advertencia");
// console.error("Error");

console.time("Operación");
console.timeEnd("Operación");





 