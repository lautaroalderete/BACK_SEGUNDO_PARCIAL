let altaProductos_form = document.getElementById("altaProductos-form");
const url = "http://localhost:3000/api";

altaProductos_form.addEventListener("submit", async(event) => {
    event.preventDefault();
    
    // Extraemos la información del formulario HTML en un objeto FormData
    let formData = new FormData(event.target);

    // Transformamos nuestro objeto FormData en un objeto normal JS
    let data = Object.fromEntries(formData.entries());
    console.log(data);
    console.table(data);

    if(!data.name || !data.image || !data.model || !data.price || !data.km) {
        alert("Todos los campos son obligatorios");
        return;
    }
    
    try {
       let response = await fetch(`${url}/vehiculos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
       });

       if(response.ok) {
        console.log(response);
        let result = await response.json();
        console.log(result.message);
        alert(result.message)
       } else {
        let error = await response.json();
        console.log("Error", error.message);
        
       }

    } catch(error) {
        console.log("Error al enviar los datos", error);
        alert("Error al procesar la solicitud");
        
    }

    event.target.reset();

});