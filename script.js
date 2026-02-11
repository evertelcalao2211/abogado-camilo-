
/* ============================================
   ARCHIVO: script.js
   FUNCIONALIDADES JAVASCRIPT PARA LA PÁGINA WEB
   ============================================ */

// ============================================
// 1. VARIABLES GLOBALES Y ESTADO
// ============================================
let carruselInterval;
let indiceCarruselActual = 0;
const tiempoCambioCarrusel = 3000; // 3 segundos

// ============================================
// 2. FUNCIÓN DE INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página cargada - Inicializando funcionalidades');
    
    // Inicializar todas las funcionalidades
    inicializarMenuHamburguesa();
    inicializarCarrusel();
    inicializarFormularioContacto();
    inicializarAnimacionesScroll();
    inicializarContadorCaracteres();
    inicializarSmoothScroll();
    
    console.log('Todas las funcionalidades inicializadas correctamente');
});



// ============================================
// 4. CARRUSEL DE IMÁGENES
// ============================================
function inicializarCarrusel() {
    const slides = document.querySelectorAll('.slide');
    const indicadores = document.querySelectorAll('.indicador');
    const prevBtn = document.querySelector('.carrusel-btn.prev');
    const nextBtn = document.querySelector('.carrusel-btn.next');
    
    if (slides.length === 0) {
        console.warn('No se encontraron imágenes para el carrusel');
        return;
    }
    
    // Función para mostrar un slide específico
    function mostrarSlide(indice) {
        // Validar índice
        if (indice < 0) indice = slides.length - 1;
        if (indice >= slides.length) indice = 0;
        
        // Ocultar todos los slides
        slides.forEach(slide => slide.classList.remove('activo'));
        indicadores.forEach(ind => ind.classList.remove('activo'));
        
        // Mostrar slide actual
        slides[indice].classList.add('activo');
        indicadores[indice].classList.add('activo');
        
        indiceCarruselActual = indice;
    }
    
    // Función para siguiente slide
    function siguienteSlide() {
        mostrarSlide(indiceCarruselActual + 1);
    }
    
    // Función para slide anterior
    function anteriorSlide() {
        mostrarSlide(indiceCarruselActual - 1);
    }
    
    // Configurar botones de navegación
    if (nextBtn) {
        nextBtn.addEventListener('click', siguienteSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', anteriorSlide);
    }
    
    // Configurar indicadores
    indicadores.forEach((indicador, index) => {
        indicador.addEventListener('click', () => {
            mostrarSlide(index);
            reiniciarIntervaloCarrusel();
        });
    });
    
    // Configurar intervalo automático
    function iniciarIntervaloCarrusel() {
        carruselInterval = setInterval(siguienteSlide, tiempoCambioCarrusel);
    }
    
    function reiniciarIntervaloCarrusel() {
        clearInterval(carruselInterval);
        iniciarIntervaloCarrusel();
    }
    
    // Pausar carrusel al hacer hover
    const carrusel = document.querySelector('.carrusel');
    if (carrusel) {
        carrusel.addEventListener('mouseenter', () => {
            clearInterval(carruselInterval);
        });
        
        carrusel.addEventListener('mouseleave', () => {
            iniciarIntervaloCarrusel();
        });
    }
    
    // Iniciar carrusel
    iniciarIntervaloCarrusel();
    console.log(`Carrusel inicializado con ${slides.length} imágenes`);
}

// ============================================
// 5. FORMULARIO DE CONTACTO
// ============================================
function inicializarFormularioContacto() {
    const formulario = document.getElementById('formContacto');
    const campoCaso = document.getElementById('caso');
    const contadorCaracteres = document.getElementById('caracteresRestantes');
    
    if (!formulario) {
        console.warn('Formulario de contacto no encontrado');
        return;
    }
    
    // Configurar contador de caracteres
    if (campoCaso && contadorCaracteres) {
        const maxCaracteres = parseInt(campoCaso.getAttribute('maxlength')) || 500;
        
        campoCaso.addEventListener('input', function() {
            const caracteresUsados = this.value.length;
            const caracteresRestantes = maxCaracteres - caracteresUsados;
            contadorCaracteres.textContent = caracteresRestantes;
            
            // Cambiar color si quedan pocos caracteres
            if (caracteresRestantes < 50) {
                contadorCaracteres.style.color = '#e74c3c';
            } else if (caracteresRestantes < 100) {
                contadorCaracteres.style.color = '#f39c12';
            } else {
                contadorCaracteres.style.color = '';
            }
        });
    }
    
    // Validación del formulario
    formulario.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validarFormulario()) {
            enviarFormulario();
        }
    });
    
    // Validación en tiempo real
    const camposValidacion = ['nombre', 'apellido', 'cedula', 'rama', 'caso'];
    
    camposValidacion.forEach(campoId => {
        const campo = document.getElementById(campoId);
        const errorMsg = document.getElementById(`error${campoId.charAt(0).toUpperCase() + campoId.slice(1)}`);
        
        if (campo && errorMsg) {
            campo.addEventListener('blur', () => validarCampo(campo, errorMsg));
            campo.addEventListener('input', () => {
                if (errorMsg.textContent) {
                    errorMsg.textContent = '';
                }
            });
        }
    });
    
    console.log('Formulario de contacto inicializado');
}

function validarCampo(campo, elementoError) {
    let valido = true;
    let mensaje = '';
    
    switch(campo.id) {
        case 'nombre':
        case 'apellido':
            if (!campo.value.trim()) {
                mensaje = 'Este campo es obligatorio';
                valido = false;
            } else if (campo.value.trim().length < 2) {
                mensaje = 'Debe tener al menos 2 caracteres';
                valido = false;
            }
            break;
            
        case 'cedula':
            if (!campo.value.trim()) {
                mensaje = 'La cédula es obligatoria';
                valido = false;
            } else if (!/^\d+$/.test(campo.value)) {
                mensaje = 'Solo se permiten números';
                valido = false;
            } else if (campo.value.length < 6) {
                mensaje = 'La cédula debe tener al menos 6 dígitos';
                valido = false;
            }
            break;
            
        case 'rama':
            if (!campo.value) {
                mensaje = 'Seleccione una rama del derecho';
                valido = false;
            }
            break;
            
        case 'caso':
            if (!campo.value.trim()) {
                mensaje = 'Describa su caso brevemente';
                valido = false;
            } else if (campo.value.trim().length < 10) {
                mensaje = 'La descripción debe tener al menos 10 caracteres';
                valido = false;
            }
            break;
    }
    
    elementoError.textContent = mensaje;
    return valido;
}

function validarFormulario() {
    const campos = [
        {campo: document.getElementById('nombre'), error: document.getElementById('errorNombre')},
        {campo: document.getElementById('apellido'), error: document.getElementById('errorApellido')},
        {campo: document.getElementById('cedula'), error: document.getElementById('errorCedula')},
        {campo: document.getElementById('rama'), error: document.getElementById('errorRama')},
        {campo: document.getElementById('caso'), error: document.getElementById('errorCaso')}
    ];
    
    let formularioValido = true;
    
    campos.forEach(({campo, error}) => {
        if (!validarCampo(campo, error)) {
            formularioValido = false;
        }
    });
    
    return formularioValido;
}

function enviarFormulario() {
    const formulario = document.getElementById('formContacto');
    const botonEnviar = formulario.querySelector('.btn-enviar');
    const mensajeExito = document.getElementById('mensajeExito');
    
    // Mostrar estado de carga
    const textoOriginal = botonEnviar.innerHTML;
    botonEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    botonEnviar.disabled = true;
    
    // Simular envío (en producción, reemplazar con petición real)
    setTimeout(() => {
        // Éxito
        mensajeExito.style.display = 'block';
        formulario.reset();
        
        // Restaurar contador de caracteres
        const contadorCaracteres = document.getElementById('caracteresRestantes');
        if (contadorCaracteres) {
            contadorCaracteres.textContent = '500';
            contadorCaracteres.style.color = '';
        }
        
        // Restaurar botón
        botonEnviar.innerHTML = textoOriginal;
        botonEnviar.disabled = false;
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            mensajeExito.style.display = 'none';
        }, 5000);
        
        console.log('Formulario enviado exitosamente');
        
        // Scroll suave al mensaje de éxito
        mensajeExito.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    }, 1500);
}

// ============================================
// 6. ANIMACIONES AL HACER SCROLL
// ============================================
function inicializarAnimacionesScroll() {
    // Crear observador para animaciones
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animado');
            }
        });
    }, observerOptions);
    
    // Observar elementos que deben animarse
    const elementosAnimables = document.querySelectorAll('.tarjeta-servicio, .tarjeta-abogado, .card-mv');
    elementosAnimables.forEach(elemento => {
        elemento.classList.add('oculto-animacion');
        observer.observe(elemento);
    });
    
    // Agregar estilos para animaciones
    const estiloAnimacion = document.createElement('style');
    estiloAnimacion.textContent = `
        .oculto-animacion {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animado {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Animación escalonada para tarjetas de servicios */
        .tarjeta-servicio:nth-child(1).animado { transition-delay: 0.1s; }
        .tarjeta-servicio:nth-child(2).animado { transition-delay: 0.2s; }
        .tarjeta-servicio:nth-child(3).animado { transition-delay: 0.3s; }
        .tarjeta-servicio:nth-child(4).animado { transition-delay: 0.4s; }
    `;
    document.head.appendChild(estiloAnimacion);
    
    console.log('Animaciones de scroll inicializadas');
}

// ============================================
// 7. SCROLL SUAVE PARA ENLACES INTERNOS
// ============================================
function inicializarSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(enlace => {
        enlace.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            // Solo procesar enlaces internos
            if (href === '#') return;
            
            const elementoDestino = document.querySelector(href);
            
            if (elementoDestino) {
                event.preventDefault();
                
                // Calcular posición considerando el header fijo
                const headerAltura = document.querySelector('.header').offsetHeight;
                const posicionDestino = elementoDestino.offsetTop - headerAltura - 20;
                
                window.scrollTo({
                    top: posicionDestino,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    console.log('Scroll suave inicializado');
}

// ============================================
// 8. CONTADOR DE CARACTERES (FUNCION AUXILIAR)
// ============================================
function inicializarContadorCaracteres() {
    // Ya se inicializó en el formulario, pero por separado por si hay más textareas
    const textareas = document.querySelectorAll('textarea[maxlength]');
    
    textareas.forEach(textarea => {
        const maxLength = parseInt(textarea.getAttribute('maxlength')) || 500;
        
        // Crear contador si no existe
        if (!textarea.nextElementSibling || !textarea.nextElementSibling.classList.contains('contador-caracteres')) {
            const contador = document.createElement('div');
            contador.className = 'contador-caracteres';
            contador.innerHTML = `<span>${maxLength}</span> caracteres restantes`;
            textarea.parentNode.insertBefore(contador, textarea.nextSibling);
        }
        
        textarea.addEventListener('input', function() {
            const contador = this.nextElementSibling;
            if (contador && contador.classList.contains('contador-caracteres')) {
                const caracteresUsados = this.value.length;
                const caracteresRestantes = maxLength - caracteresUsados;
                contador.querySelector('span').textContent = caracteresRestantes;
            }
        });
    });
}

// ============================================
// 9. DETECCIÓN DE ERRORES Y LOGGING
// ============================================
window.addEventListener('error', function(event) {
    console.error('Error en la página:', event.error);
});

// ============================================
// 10. MEJORAS DE ACCESIBILIDAD
// ============================================
function mejorarAccesibilidad() {
    // Agregar atributos ARIA dinámicamente
    const botonesCarrusel = document.querySelectorAll('.carrusel-btn');
    botonesCarrusel.forEach((boton, index) => {
        boton.setAttribute('aria-label', index === 0 ? 'Imagen anterior' : 'Siguiente imagen');
    });
    
    // Navegación por teclado en menú móvil
    const menuItems = document.querySelectorAll('.nav-mobile a');
    menuItems.forEach((item, index) => {
        item.setAttribute('tabindex', '0');
        
        item.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
            
            // Navegación con flechas
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                event.preventDefault();
                const nextItem = menuItems[Math.min(index + 1, menuItems.length - 1)];
                nextItem.focus();
            }
            
            if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                event.preventDefault();
                const prevItem = menuItems[Math.max(index - 1, 0)];
                prevItem.focus();
            }
        });
    });
    
    console.log('Mejoras de accesibilidad aplicadas');
}

// Ejecutar mejoras de accesibilidad después de la carga
setTimeout(mejorarAccesibilidad, 1000);

// ============================================
// 11. FUNCIONES DE UTILIDAD
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// 12. EVENTOS ADICIONALES
// ============================================
// Mejorar rendimiento en scroll
window.addEventListener('scroll', debounce(function() {
    // Aquí se pueden agregar efectos durante el scroll
}, 100));

// Ajustar altura del carrusel en resize
window.addEventListener('resize', debounce(function() {
    // Ajustar carrusel si es necesario
    const portada = document.querySelector('.portada');
    if (portada) {
        portada.style.height = `${window.innerHeight * 0.85}px`;
    }
}, 250));

// Mensaje de bienvenida en consola
console.log('%c👨‍⚖️ Bufete Cristian Cano', 'color: #1E3A5F; font-size: 18px; font-weight: bold;');
console.log('%cSitio web profesional de abogados especializados en Derecho Privado', 'color: #D4AF37;');




// ============================================
// CONTROL DEL MENÚ HAMBURGUESA
// ============================================

function inicializarMenuHamburguesa() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (!hamburgerBtn || !hamburgerMenu) {
        console.log('Elementos del menú hamburguesa no encontrados');
        return;
    }
    
    // FUNCIÓN PARA ABRIR MENÚ
    function abrirMenu() {
        hamburgerBtn.classList.add('active');
        hamburgerMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }
    
    // FUNCIÓN PARA CERRAR MENÚ
    function cerrarMenu() {
        hamburgerBtn.classList.remove('active');
        hamburgerMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
    
    // ABRIR MENÚ AL HACER CLIC EN EL BOTÓN
    hamburgerBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        if (hamburgerMenu.classList.contains('active')) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    });
    
    // CERRAR MENÚ AL HACER CLIC EN OVERLAY
    menuOverlay.addEventListener('click', cerrarMenu);
    
    // CERRAR MENÚ AL HACER CLIC EN ITEMS (con retraso para ver animación)
    menuItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Animación de clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Cerrar menú
            cerrarMenu();
            
            // Desplazarse a la sección después de cerrar el menú
            setTimeout(() => {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 300);
        });
    });
    
    // CERRAR MENÚ CON TECLA ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && hamburgerMenu.classList.contains('active')) {
            cerrarMenu();
        }
    });
    
    // CERRAR MENÚ AL HACER CLIC FUERA (solo desktop)
    document.addEventListener('click', function(event) {
        if (window.innerWidth > 768) {
            if (!hamburgerMenu.contains(event.target) && 
                !hamburgerBtn.contains(event.target) && 
                hamburgerMenu.classList.contains('active')) {
                cerrarMenu();
            }
        }
    });
    
    // PREVENIR QUE EL CLIC EN EL MENÚ LO CIERRE
    hamburgerMenu.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    
    console.log('Menú hamburguesa inicializado');
}

// AGREGAR AL EVENTO DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    inicializarMenuHamburguesa();
});

// ============================================
// CONTROL DEL MENÚ HAMBURGUESA - VERSIÓN CORREGIDA
// ============================================

function inicializarMenuHamburguesa() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (!hamburgerBtn || !hamburgerMenu) {
        console.log('Menú hamburguesa no encontrado');
        return;
    }
    
    // Función para abrir el menú
    function abrirMenu() {
        hamburgerBtn.classList.add('active');
        hamburgerMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Función para cerrar el menú
    function cerrarMenu() {
        hamburgerBtn.classList.remove('active');
        hamburgerMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Abrir/cerrar al hacer clic en el botón
    hamburgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (hamburgerMenu.classList.contains('active')) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    });
    
    // Cerrar al hacer clic en el overlay
    menuOverlay.addEventListener('click', cerrarMenu);
    
    // Cerrar al hacer clic en enlaces del menú
    const menuLinks = document.querySelectorAll('.menu-item');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            cerrarMenu();
        });
    });
    
    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cerrarMenu();
        }
    });
    
    console.log('Menú hamburguesa inicializado correctamente');
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', inicializarMenuHamburguesa);