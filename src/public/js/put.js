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
            throw new Error("Porfavor ingrese un id de producto válido.")
        }
        
        let response = await fetch(`${url}/vehiculos/${idProd}`);

        //4° Optimización: Manejamos el error en una posible respuesta no exitosa
        if(!response.ok){
            throw new Error("Porfavor ingrese un id de producto válido.")
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
    console.log(producto)

    let  htmlProductos = `
    <li class="li-listados productos-listados">
        <div class="li-listados_datos">
            <img src="${producto.img}" alt="${producto.nombre}" class="img-listados">
            <p>Id: ${producto.id} </p> 
            <p>Nombre: ${producto.nombre} / Modelo: ${producto.modelo}</p> 
            <p><strong>Precio: $${producto.precio}</strong> / Kilometraje: ${producto.km}</p>
        </div>
        <div class="li-listados_boton">
            <input class="listados_boton" id="updateProduct_button" type="button" value="Actualizar producto">
        </div>
    </li>`;

    getId_lista.innerHTML = htmlProductos;

    let updateProduct_button = document.getElementById("updateProduct_button");

    updateProduct_button.addEventListener("click", function(event){
        formularioPutProducto(event, producto);
    })
};

function formularioPutProducto(event, producto){
    event.stopPropagation();

    console.table(producto)

    let updateProduct = `
    <div id="updateProducts-container" class="crudForm-container">
        <h2>Actualizar producto</h2>
        <form id="updateProducts-form" autocomplete="off">

            <label form="idProd">Id</label>
            <input type="number" name="id" id="idProd" value=${producto.id} readonly>
        
            <label for="categoryProd">Categoria</label>
            <select name="category" id="categoryProd" required>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
            </select>
            
            <label for="imagenProd">Imagen</label>
            <input type="text" name="image" id="imagenProd" value="${producto.img}" required>
            
            <label for="nombreProd">Nombre</label>
            <input type="text" name="name" id="nombreProd" value="${producto.nombre}" required>

            <label for="modeloProd">Modelo</label>
            <input type="text" name="model" id="modeloProd" value="${producto.modelo}" required>
            
            <label for="precioProd">Precio</label>
            <input type="number" name="price" id="precioProd" value="${producto.precio}" required>

            <label for="modeloProd">Kilometraje</label>
            <input type="number" name="km" id="kmProd" value="${producto.km}" required>

            <input type="submit" value="Actualizar producto">
        </form>
    </div>`;
    
    updateForm_container.innerHTML = updateProduct;

    let updateProducts_form = document.getElementById("updateProducts-form");

    updateProducts_form.addEventListener("submit", function(event){
        actualizarProducto(event)
    })
}

async function actualizarProducto(event) {
    
    event.preventDefault();//Evitamos el envio por defecto del formulario

    let formData = new FormData(event.target);

    let data = Object.fromEntries(formData.entries());

    if(!data.category || !data.image || !data.name || !data.model || !data.price || !data.km){
        alert("Todos los campos son obligatorios")
        return;
    }

    console.log("Datos enviados al backend:", data);

    
    try{
        let response = await fetch(`${url}/vehiculos`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if(response.ok){
            console.log(response);
            let result = await response.json();
            alert(result.message);

        // Vaciamos si existiera la lista y el formulario de actualizacion de producto
            getId_lista.innerHTML = "";
            updateForm_container.innerHTML = "";
        }else{
            let error = await response.json();
            console.log("Error: ", error.message)
        }
    }catch(error){
        console.log("Error al enviar los datos", error);
        alert("Error al procesar la solicitud")
    }
}