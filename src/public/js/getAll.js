let carrito = [];
let lista_original = [];

const carritoGuardado = localStorage.getItem("carrito");
if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
}

let lista_productos = []
let itemsCarrito = document.querySelector("#lista-carrito");
console.log(itemsCarrito)
let contenedorItemsCarrito = document.getElementById("items-carrito")
let parrafoNoHayItems = document.querySelector("#parrafo-no-hay-items");
let contadorCarrito = document.getElementById("contador-carrito");
let totalCarrito = document.getElementById("total-carrito");


const url = "http://localhost:3000/api";

async function obtenerDatosProductos() {
    try {
        let respuesta = await fetch(`${url}/vehiculos`)
        console.log(respuesta);
        
        let datos = await respuesta.json();
        console.log(datos);

        mostrarProductos(datos);
        mostrarCarrito();
        actualizarTotal();
        actualizarContador();
        
    } catch(error) {
        console.log("Error:", error);
        
    }
}

function mostrarProductos(array) {
    lista_productos = array.payload;
    lista_original = [...lista_productos]; // ← guardamos una copia "intocable"

    const contenedor = document.querySelector(".container-productos");
    contenedor.innerHTML = "";

    lista_productos.forEach(producto => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-producto");

        tarjeta.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}">
            <h3>${producto.nombre} - ${producto.modelo}</h3>
            <p><strong>Precio:</strong> $${producto.precio}</p>
            <p><strong>Kilometraje:</strong> ${producto.km} km</p>
            <button class="boton-carrito" data-id="${producto.id}">Agregar al carrito</button>
        `;

        const boton = tarjeta.querySelector(".boton-carrito");
        boton.addEventListener("click", () => {
            const id = parseInt(boton.getAttribute("data-id"));
            agregarCarrito(id);
        });

        contenedor.appendChild(tarjeta);
    });
}

const inputBusqueda = document.getElementById("input-busqueda");

inputBusqueda.addEventListener("input", () => {
    const termino = inputBusqueda.value.trim().toLowerCase();

    if (termino === "") {
        lista_productos = [...lista_original]; // restauramos todos
    } else {
        lista_productos = lista_original.filter(producto =>
            producto.nombre.toLowerCase().includes(termino) ||
            producto.modelo.toLowerCase().includes(termino)
        );
    }

    const contenedor = document.querySelector(".container-productos");
    contenedor.innerHTML = "";

    lista_productos.forEach(producto => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-producto");

        tarjeta.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}">
            <h3>${producto.nombre} - ${producto.modelo}</h3>
            <p><strong>Precio:</strong> $${producto.precio}</p>
            <p><strong>Kilometraje:</strong> ${producto.km} km</p>
            <button class="boton-carrito" data-id="${producto.id}">Agregar al carrito</button>
        `;

        const boton = tarjeta.querySelector(".boton-carrito");
        boton.addEventListener("click", () => {
            const id = parseInt(boton.getAttribute("data-id"));
            agregarCarrito(id);
        });

        contenedor.appendChild(tarjeta);
    });
});

function agregarCarrito(id){
    let producto_agregado = lista_productos.find(producto => producto.id === id);
    console.log(`Se añadio el producto ${producto_agregado}`);
    carrito.push(producto_agregado);
    actualizarContador();
    mostrarCarrito();
    actualizarTotal();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function eliminarProducto(id){
    let indice_producto = carrito.findIndex(producto => producto.id === id);

    if (indice_producto >= 0){
        carrito.splice(indice_producto, 1);
        actualizarContador();
        mostrarCarrito();
        actualizarTotal();
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }
    if (carrito.length === 0){
        parrafoNoHayItems.textContent = "No hay elementos en el carrito.";
    }
}

function vaciarCarrito(){
    carrito = []
    parrafoNoHayItems.textContent = "No hay elementos en el carrito.";
    mostrarCarrito()
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
    actualizarTotal();
}

function actualizarContador() {
    contadorCarrito.textContent = carrito.length;
}

function actualizarTotal() {
    let total = carrito.reduce((acum, prod) => acum + parseFloat(prod.precio), 0);
    totalCarrito.textContent = `Total: $${total}`;
}

function mostrarCarrito(){
    if (carrito.length > 0){
        parrafoNoHayItems.textContent = "";
    }
    let listaCarrito = "";
    carrito.forEach(item => {
        // listaCarrito += `<li class="bloque-item">
        //             <img class="item-img" src="${item.img}" alt="${item.nombre}">
        //             <p class="nombre-item">${item.nombre} - $${item.modelo}</p>
        //             <p class="nombre-item">Kilometraje: ${item.precio} - $${item.km}</p>
        //             <button onclick="eliminarProducto(${item.id})" class="boton-eliminar">Eliminar</button>
        //         </li>`
        listaCarrito += `
            <li class="item-carrito">
                <img class="item-img" src="${item.img}" alt="${item.nombre}">
                <div class="item-detalles">
                    <h4>${item.nombre} - ${item.modelo}</h4>
                    <p>Kilometraje: ${item.km} km</p>
                    <p>Precio: $${item.precio}</p>
                </div>
                <button onclick="eliminarProducto(${item.id})" class="boton-eliminar">Eliminar</button>
            </li>`
    })
    itemsCarrito.innerHTML = listaCarrito;
    console.log(carrito)
}

function realizarCompra() {
    if (carrito.length === 0) {
        alert("No hay productos en el carrito.");
        return;
    }

    const confirmacion = window.confirm("¿Estás seguro que deseas realizar la compra?");
    if (!confirmacion) {
        return; // Si el usuario cancela, no hace nada
    }

    fetch("/api/compras", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ productos: carrito })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Error en la solicitud");
        }
        return res.json();
    })
    .then(data => {
        alert("¡Compra realizada con éxito!");
        console.log("Respuesta del servidor:", data);
        vaciarCarrito(); // Limpiamos carrito después de la compra
    })
    .catch(error => {
        console.error("Error al realizar la compra:", error);
        alert("Hubo un problema al procesar la compra.");
    });
}

obtenerDatosProductos();