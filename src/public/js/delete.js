let getId_lista = document.getElementById("getId-list");
let getProduct_form = document.getElementById("getProduct-form");
let updateForm_container =  document.getElementById("updateForm-container")
const url = "http://localhost:3000/api";

getProduct_form.addEventListener("submit", async(event) => {
    event.preventDefault(); //Evitamos el envío por defecto del formulario
    
    try {
        //1° Optimización: Mostramos un estado de carga
        getId_lista.innerHTML = "<p>Cargando vehiculo...</p>";

        // Obtenemos y almacenamos la información del formulario
        let formData = new FormData(event.target);

        // Transformamos el objeto FormData en un objeto JS normal
        let data = Object.fromEntries(formData.entries());
        
        // Almacenamos el valor numérico del formulario para pasárselo a la petición fetch
        let idProd = data.idProd.trim();//2° Optimización: Sacamos posibles espacios
        console.log(idProd);

        //3° Optimización: Validación basica
        if(!idProd){
            throw new Error("Porfavor ingresa un id de producto valido")
        }
        
        let response = await fetch(`${url}/vehiculos/${idProd}`);

        //4° Optimización: Manejamos el error en una posible respuesta no exitosa
        if(!response.ok){
            throw new Error("Porfavor ingresa un id de producto valido")
        }

        let datos = await response.json();
        console.log(datos);

        //5° Optimización: Verificamos si hay productos en la respuesta
        if(!datos.payload || datos.payload.length === 0){
            throw new Error("No se encontró el producto solicitado")
        }

                // let htmlProductos = `
        //     <img src="${producto.img}" alt="${producto.nombre}">
        //     <h3>${producto.nombre} - ${producto.modelo}</h3>
        //     <p><strong>Precio:</strong> $${producto.precio}</p>
        //     <p><strong>Kilometraje:</strong> ${producto.km} km</p>
        //         <button class="boton-carrito" data-id="${producto.id}">Modificar producto</button>
        // `

        let producto = datos.payload[0]; // El primer resultado es el que contiene el producto que nos devolvió la consulta

        mostrarProducto(producto);
        
    } catch(error) {
        console.error("Error al obtener el producto: ", error);
        getId_lista.innerHTML = `<p>${error.message}</p>`
    } 
});

function mostrarProducto(producto){
    console.log(producto);

    let  htmlProductos = `
    <li class="li-listados productos-listados">
        <div class="li-listados_datos">
            <img src="${producto.img}" alt="${producto.nombre}" class="img-listados">
            <p>Id: ${producto.id} </p> 
            <p>Nombre: ${producto.nombre} / Modelo: ${producto.modelo}</p> 
            <p><strong>Precio: $${producto.precio}</strong> / Kilometraje: ${producto.km}</p>
        </div>
        <div class="li-listados_boton">
            <input class="listados_boton" id="deleteProduct_button" type="button" value="Eliminar producto">
        </div>
    </li>`;

    getId_lista.innerHTML = htmlProductos;

    let deleteProduct_button = document.getElementById("deleteProduct_button");

    let idProd = producto.id;

    deleteProduct_button.addEventListener("click", function(event){
        event.stopPropagation();

        let confirmacion = confirm("¿Desea eliminar este producto?");
        if(!confirmacion) {
            alert("Eliminacion cancelada");
        } else {
            eliminarProducto(idProd);
        }
    })
};

async function eliminarProducto(id) {
    try {
        let response = await fetch(`${url}/vehiculos/${id}`, {
            method: "DELETE"
        });

        let result = await response.json();
        if(response.ok) {
            alert(result.message);
            getId_lista.innerHTML = "";
        } else {
            console.error("Error", result.message);
            alert("No se pudo eliminar el vehiculo");
        }

    } catch(error) {
        console.error("Error en la solicitud DELETE", error);
        alert("Ocurrio un error al eliminar el producto");
    }
}