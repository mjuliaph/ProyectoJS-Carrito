// $( document ).ready(function() {
//   console.log('El DOM esta listo');
// });

window.onload = function () {
    // Variables
    const arrayProductos = [
        {
            id: 1,
            nombre: 'Patata',
            precio: 1,
            imagen: 'media/agua.jpg'
        },
        {
            id: 2,
            nombre: 'Cebolla',
            precio: 1.2,
            imagen: 'media/agua.jpg'
        },
        {
            id: 3,
            nombre: 'Calabacin',
            precio: 2.1,
            imagen: 'media/agua.jpg'
        },
        {
            id: 4,
            nombre: 'Fresas',
            precio: 0.6,
            imagen: 'media/agua.jpg'
        }
  
    ];
  
    let carrito = [];
    let total = 0;
    const listaProductos = document.querySelector('#productos');
    const DOMcarrito = document.querySelector('#carrito');
    const gastoTotal = document.querySelector('#gastoTotal');
    const botonVaciarCarrito = document.querySelector('#vaciarCarrito');
    const miLocalStorage = window.localStorage;
  
    // Funciones
  
    /**
    * Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
    */
    function renderizarProductos() {
        arrayProductos.forEach((prod) => {
            // Estructura
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');
            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            // Titulo
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = prod.nombre;
            // Imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', prod.imagen);
            // Precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = prod.precio + '€';
            // Boton 
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = '+';
            miNodoBoton.setAttribute('marcador', prod.id);
            miNodoBoton.addEventListener('click', agregarProductoAlCarrito);
            // Insertamos
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            listaProductos.appendChild(miNodo);
        });
    }
  
    /**
    * Evento para añadir un producto al carrito de la compra
    */
    function agregarProductoAlCarrito(evento) {
        // Anyadimos el Nodo a nuestro carrito
        carrito.push(evento.target.getAttribute('marcador'))
        // Calculo el total
        calcularTotal();
        // Actualizamos el carrito 
        renderizarCarrito();
        // Actualizamos el LocalStorage
        LocalStorageCarrito();
    }
  
    /**
    * Dibuja todos los productos guardados en el carrito
    */
    function renderizarCarrito() {
        // Vaciamos todo el html
        DOMcarrito.textContent = '';
        // Quitamos los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((prod) => {
            // Obtenemos el item que necesitamos de la variable base de datos
            const miItem = arrayProductos.filter((itemArrayProductos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemArrayProductos.id === parseInt(prod);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === prod ? total += 1 : total;
            }, 0);
            // Creamos el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}€`;
            // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.prod = prod;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclamos nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
    }
  
    /**
    * Evento para borrar un elemento del carrito
    */
    function borrarItemCarrito(evento) {
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = evento.target.dataset.prod;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volvemos a renderizar
        renderizarCarrito();
        // Calculamos de nuevo el precio
        calcularTotal();
        // Actualizamos el LocalStorage
        LocalStorageCarrito();
  
    }
  
    /**
    * Calcula el precio total teniendo en cuenta los productos repetidos
    */
    function calcularTotal() {
        // Reseteo el valor anterior
        total = 0;
        // Recorro el array de Carrito para obtener el precio de cada producto.
        carrito.forEach((prod) => {
  
            const miItem = arrayProductos.filter((itemArrayProductos) => {
                return itemArrayProductos.id === parseInt(prod);
            });
            total = total + miItem[0].precio;
        });
        // Renderizamos el precio en el HTML
        gastoTotal.textContent = total.toFixed(2);
    }
  
    /**
    * Varia el carrito y vuelve a dibujarlo
    */
    function vaciarCarrito() {
        //Reseteo el carrito, borro los productos guardados.
        carrito = [];
  
        renderizarCarrito();
        
        calcularTotal();
        //Borro la información del Local Storage.
        localStorage.clear();
  
    }
  
    function LocalStorageCarrito () {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }
  
    function cargarCarritoDeLocalStorage () {
        // ¿Existe un carrito previo guardado en LocalStorage?
        if (miLocalStorage.getItem('carrito') !== null) {
            // Carga la información
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }
  
    // Eventos
    botonVaciarCarrito.addEventListener('click', vaciarCarrito);
  
    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    calcularTotal();
    renderizarCarrito();
  }