$( document ).ready(function() {

    //Creo mi clase objeto.
    class Producto {
        constructor(id, tipo, nombre, imagen, descripcion, clasificacion, precio, stock,cantidad) {
            this.id = id;
            this.tipo = tipo
            this.nombre = nombre;
            this.imagen = imagen;
            this.descripcion = descripcion;
            this.clasificacion = clasificacion;
            this.precio  = +precio;
            this.stock = stock;
            this.cantidad = cantidad;
            this.precioTotal = this.calcularTotal();
        }
    }

    //Adquiero el listado de productos que tengo almacenados en el JSON.
    const productosJSON = '[{"id":1,"tipo":"bebida","nombre":"Villavicencio","imagen":"media/agua.jpg","descripcion":"Agua mineral sin gas","clasificacion":"sin alcohol","precio":50,"stock":true},{"id":2,"tipo":"bebida","nombre":"Villavicencio","imagen":"media/soda.jpg","descripcion":"Agua mineral con gas","clasificacion":"sin alcohol","precio":50,"stock":true},{"id":3,"tipo":"bebida","nombre":"Aquarius","imagen":"media/aquarius.jpg","descripcion":"Agua saborizada","clasificacion":"sin alcohol","precio":70,"stock":true},{"id":4,"tipo":"bebida","nombre":"Pepsi","imagen":"media/pepsi.jpg","descripcion":"gaseosa cola","clasificacion":"sin alcohol","precio":80,"stock":true},{"id":5,"tipo":"bebida","nombre":"Seven Up","imagen":"media/seven.jpg","descripcion":"gaseosa lima-limon","clasificacion":"sin alcohol","precio":80,"stock":true},{"id":6,"tipo":"bebida","nombre":"Mirinda","imagen":"media/mirinda.jpg","descripcion":"gaseosa naranja","clasificacion":"sin alcohol","precio":80,"stock":true},{"id":7,"tipo":"bebida","nombre":"Paso de los toros","imagen":"media/toros.jpg","descripcion":"gaseosa pomelo","clasificacion":"sin alcohol","precio":80,"stock":true},{"id":8,"tipo":"bebida","nombre":"Paso de los toros","imagen":"media/tonica.jpg","descripcion":"gaseosa tonica","clasificacion":"sin alcohol","precio":80,"stock":true},{"id":9,"tipo":"bebida","nombre":"limonada","imagen":"media/limonada.jpg","descripcion":"limonada","clasificacion":"sin alcohol","precio":80,"stock":true},{"id":10,"tipo":"bebida","nombre":"Santa Fe","imagen":"media/santafe.jpg","descripcion":"cerveza Santa Fe","clasificacion":"con alcohol","precio":90,"stock":true},{"id":11,"tipo":"bebida","nombre":"Santa Fe frost","imagen":"media/frost.jpg","descripcion":"cerveza frost","clasificacion":"con alcohol","precio":90,"stock":true},{"id":12,"tipo":"bebida","nombre":"Corona","imagen":"media/corona.png","descripcion":"cerveza corona","clasificacion":"con alcohol","precio":90,"stock":true},{"id":13,"tipo":"comida","nombre":"Papas Fritas","imagen":"media/papas.jpg","descripcion":"Bastones de Papa Fritos","clasificacion":"salado","precio":50,"stock":true},{"id":14,"tipo":"comida","nombre":"Nachos","imagen":"media/nachos.png","descripcion":"trozos de tortilla de maiz con queso","clasificacion":"salado","precio":50,"stock":true},{"id":15,"tipo":"comida","nombre":"Pancho","imagen":"media/pancho.png","descripcion":"Salchichas con pan","clasificacion":"salado","precio":70,"stock":true},{"id":16,"tipo":"comida","nombre":"Pochoclo Salado","imagen":"media/pochoclo.jpg","descripcion":"Palomitas de maiz saladas","clasificacion":"Salado","precio":80,"stock":true},{"id":17,"tipo":"comida","nombre":"Pochoclo","imagen":"media/pochoclo.jpg","descripcion":"Palomitas de maiz dulces","clasificacion":"Dulce","precio":80,"stock":true},{"id":18,"tipo":"comida","nombre":"Helado","imagen":"media/helado.jpg","descripcion":"Helado gusto a eleccion","clasificacion":"Dulce","precio":80,"stock":true},{"id":19,"tipo":"comida","nombre":"Sugus Confitados","imagen":"media/sugus.jpg","descripcion":"Caramelos ","clasificacion":"Dulce","precio":60,"stock":true},{"id":20,"tipo":"comida","nombre":"Alfajor","imagen":"media/alnegro.png","descripcion":"Alfajor de Chocolate","clasificacion":"Dulce","precio":60,"stock":true}]';

    const arrayProductos = JSON.parse(productosJSON);


    // Defino las variables que voy a usar a lo largo del proyecto.
    let carrito = [];
    let total = 0;
    const listaProductos = document.querySelector('#productos');
    const CarritoCompras = document.querySelector('#carrito');
    const gastoTotal = document.querySelector('#gastoTotal');
    const botonVaciarCarrito = document.querySelector('#vaciarCarrito');
    const miLocalStorage = window.localStorage;



    //Insertar en el HTML las cards con cada uno de los productos.
    function crearProductosHTML() {
        arrayProductos.forEach(prod => {
            let cardItem = document.createElement('div');
            cardItem.classList.add('col');
            cardItem.innerHTML =
            `<div class="card" style="width: 18rem;">
                <img src="${prod.imagen}" class="card-img-top" alt="${prod.descripcion}">
                <div class="card-body">
                    <h5 class="card-title">${prod.nombre}</h5>
                    <p class="card-text">${prod.descripcion}</p>
                    <button id="prod-${prod.id}" class="btn btn-primary">Comprar</button>
                </div>
            </div>`

        listaProductos.appendChild(cardItem);

        let botonComprar = document.getElementById('prod-' + prod.id);
        botonComprar.setAttribute('pusheado', prod.id);
        botonComprar.addEventListener('click', agregarProductoAlCarrito);
        botonComprar.addEventListener('click', cambiarImagenLleno);
        })
    };

  
    //Evento para agregar al carrito los productos seleccionados.
    function agregarProductoAlCarrito(producto) {
        carrito.push(producto.target.getAttribute('pusheado'));
        //Genero alerta para saber que se cargó el producto al carrito.
        $("#productoAgregadoOk").slideToggle("slow").delay(1500).slideToggle("slow");

        calcularTotal();
        recorrerCarrito();
        LocalStorageCarrito();
    }

    //Ahora me encargo del carrito de compras.
    function recorrerCarrito() {
        CarritoCompras.textContent = '';
        // Quitamos los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((prod) => {
            // Obtenemos el item que necesitamos de la variable base de datos
            const productoEnCarrito = arrayProductos.filter((itemArrayProductos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemArrayProductos.id === parseInt(prod);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === prod ? total += 1 : total;
            }, 0);
            //Agrego el producto a la lista del carrito.
            const itemCarrito = document.createElement('li');
            itemCarrito.classList.add('list-group-item', 'text-right', 'mx-2');
            itemCarrito.textContent = `${numeroUnidadesItem} x ${productoEnCarrito[0].nombre} - $${productoEnCarrito[0].precio}`;
            // Boton de borrar producto.
            const botonBorrarItem = document.createElement('button');
            botonBorrarItem.classList.add('btn', 'btn-danger', 'mx-5');
            botonBorrarItem.textContent = 'x';
            botonBorrarItem.style.marginLeft = '1rem';
            botonBorrarItem.dataset.prod = prod;
            botonBorrarItem.addEventListener('click', borrarItemCarrito);

            // Agrego los hijos.
            itemCarrito.appendChild(botonBorrarItem);
            CarritoCompras.appendChild(itemCarrito);
        });
    }

    //Función para borrar Productos del carrito.
    function borrarItemCarrito(producto) {
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = producto.target.dataset.prod;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
        });
        // volvemos a renderizar
        recorrerCarrito();
        // Calculamos de nuevo el precio
        calcularTotal();
        // Actualizamos el LocalStorage
        LocalStorageCarrito();
      }

    //Función para calcular el monto total de la compra.
    function calcularTotal() {
        total = 0;
        // Recorro el array del Carrito para obtener el monto de cada producto.
        carrito.forEach((prod) => {
            const productoEnCarrito = arrayProductos.filter((itemArrayProductos) => {
                return itemArrayProductos.id === parseInt(prod);
            });
            total = total + productoEnCarrito[0].precio;
        });
        gastoTotal.textContent = total;
    }

    //Función de Vaciar Carrito.
    function vaciarCarrito() {
        carrito = []; //Reseteo el carrito, borro los productos guardados.
        recorrerCarrito();
        calcularTotal();
        cambiarImagenVacio();
        localStorage.clear(); //Borro la información del Local Storage.
    }
    
    //Funciones para cambiar la imagen del carrito.
    function cambiarImagenLleno(){
        $("#miImagen").attr("src","media/cestaLlena.png");
    }

    function cambiarImagenVacio(){
        $("#miImagen").attr("src","media/cesta.png");
    }

    //Función para guardar en el Local Storage los productos cargados en el carrito.
    function LocalStorageCarrito () {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoEnLocalStorage () {
        if (miLocalStorage.getItem('carrito') !== null) {
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }

    // Eventos
    botonVaciarCarrito.addEventListener('click', vaciarCarrito);

    // Llamadas de las funciones.

    cargarCarritoEnLocalStorage();
    crearProductosHTML();
    calcularTotal();
    recorrerCarrito();
  
    console.log('El DOM esta listo');
});

