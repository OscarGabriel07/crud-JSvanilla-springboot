//Definición de variables
const url = 'http://localhost:8080/usuario/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalUsuario = new bootstrap.Modal(document.getElementById('modalUsuario'))
const formUsuario = document.querySelector('form')
const nombre = document.getElementById('nombre')
const email = document.getElementById('email')
const prioridad = document.getElementById('prioridad')
var opcion = ''

/**
 * Se crea evento de click para cuando se busque un usuario por correo
 */
const botonBuscarPorCorreo = document.querySelector('#btn-buscar-por-correo');
botonBuscarPorCorreo.addEventListener("click", async () => {
    resultados = ''
    const inputEmail = document.querySelector('#input-buscar-por-correo');
    let res = await fetch(`http://localhost:8080/usuario/queries?email=${inputEmail.value}`);
    json = await res.json();

    if (!res.ok) throw {
        status: res.status,
        statusText: res.statusText
    };

    mostrar(json);
})

btnCrear.addEventListener('click', () => {
    nombre.value = ''
    email.value = ''
    prioridad.value = ''
    modalUsuario.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (usuarios) => {
    usuarios.forEach(usuario => {
        resultados += `<tr>
                            <td>${usuario.id}</td>
                            <td>${usuario.nombre}</td>
                            <td id="email">${usuario.email}</td>
                            <td>${usuario.prioridad}</td>
                            <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td>
                       </tr>
                    `
    })
    contenedor.innerHTML = resultados

}

//Procedimiento Mostrar
fetch(url)
    .then(response => response.json())
    .then(data => mostrar(data))
    .catch(error => console.log(error))


const on = (element, event, selector, handler) => {
    //console.log(element)
    //console.log(event)
    //console.log(selector)
    //console.log(handler)
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

//Procedimiento Borrar
/**
 * Se realiza modificación para hacer el borrado del usuario por email
 */
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    const email = fila.querySelector('#email').innerHTML;
    alertify.confirm("This is a confirm dialog.",
        function () {
            fetch(url + email, {
                    method: 'DELETE'
                })
                .then(res => res.json())
                .then(() => location.reload())
            //alertify.success('Ok')
        },
        function () {
            alertify.error('Cancel')
        })
})

//Procedimiento Editar
let idForm = 0
on(document, 'click', '.btnEditar', e => {
    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML
    const nombreForm = fila.children[1].innerHTML
    const emailForm = fila.children[2].innerHTML
    const prioridadForm = fila.children[3].innerHTML
    nombre.value = nombreForm
    email.value = emailForm
    prioridad.value = prioridadForm
    opcion = 'editar'
    modalUsuario.show()

})

//Procedimiento para Crear y Editar
formUsuario.addEventListener('submit', (e) => {
    e.preventDefault()
    if (opcion == 'crear') {
        //console.log('OPCION CREAR')
        fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nombre.value,
                    email: email.value,
                    prioridad: prioridad.value
                })
            })
            .then(response => response.json())
            .then(data => {
                const nuevoUsuario = []
                nuevoUsuario.push(data)
                mostrar(nuevoUsuario)
            })
    }
    if (opcion == 'editar') {
        //console.log('OPCION EDITAR')
        fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: idForm,
                    nombre: nombre.value,
                    email: email.value,
                    prioridad: prioridad.value
                })
            })
            .then(response => response.json())
            .then(() => location.reload())
    }
    modalUsuario.hide()
})