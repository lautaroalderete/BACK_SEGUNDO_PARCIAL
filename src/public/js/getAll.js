const url = "http://localhost:3000/api";

async function obtenerDatosProductos() {
    try {
        let respuesta = await fetch(`${url}/vehiculos`)
        console.log(respuesta);
        
        let datos = await respuesta.json();
        console.log(datos);

        mostrarProductos(datos);
        
    } catch(error) {
        console.log("Error:", error);
        
    }
}

function mostrarProductos(array) {
    let listaProductos = array.payload;
    console.table(listaProductos);

    const contenedor = document.querySelector(".container-productos");
    contenedor.innerHTML = ""; // Limpiar contenido previo, por si acaso

    listaProductos.forEach(producto => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-producto");

        tarjeta.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}">
            <h3>${producto.nombre} - ${producto.modelo}</h3>
            <p><strong>Precio:</strong> $${producto.precio}</p>
            <p><strong>Kilometraje:</strong> ${producto.km} km</p>
            <p><strong>Color:</strong> ${producto.color}</p>
            <button class="boton-carrito" data-id="${producto.id}">Agregar al carrito</button>
        `;

        contenedor.appendChild(tarjeta);
    });
}

obtenerDatosProductos();