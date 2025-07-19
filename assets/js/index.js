class TableroBaloncesto {
    constructor() {
        // Estado del juego
        this.estadoJuego = {
            marcadorLocal: 0,
            marcadorVisitante: 0,
            minutosTiempo: 20,
            segundosTiempo: 0,
            cuarto: 1,
            estaFuncionando: false,
            posesion: 'local',
            nombreLocal: 'LOCAL',
            nombreVisitante: 'VISITANTE'
        };
        
        // Sistema de sonidos
        this.sonidos = {
            habilitados: true,
            contextoAudio: null,
            beep: null,
            buzzFinal: null,
            puntos: null,
            silbato: null
        };
        
        // Referencias a elementos del DOM
        this.elementos = {
            // Temporizador
            mostrarTiempo: document.getElementById("lcd-minutes"),
            fondoTiempo: document.querySelector(".lcd-back"),
            
            // Botones de tiempo
            botonIzquierdo: document.getElementById("button-left"),
            botonDerecho: document.getElementById("button-right"),
            
            // Marcadores
            mostrarMarcadorLocal: document.querySelector(".lcd-left_display-front"),
            mostrarMarcadorVisitante: document.querySelector(".lcd-right_display-front"),
            
            // Títulos de equipos
            tituloLocal: document.querySelector(".lcd-left_title h1"),
            tituloVisitante: document.querySelector(".lcd-right_title h1"),
            
            // Botones de marcador
            botonesLocal: document.querySelectorAll(".lcd-left-buttons button"),
            botonesVisitante: document.querySelectorAll(".lcd-right-buttons button"),
            
            // Botón reset
            botonReinicio: document.querySelector(".reset"),
            
            // Display central (cuarto)
            mostrarCentro: document.querySelector(".lcd-center-front")
        };
        
        this.temporizador = null;
        this.editorActual = null;
        this.inicializar();
        this.configurarSonidos();
    }
    
    /**
 * ┌───────────────────────────────────────────┐
 * │             SISTEMA DE SONIDOS           │
 * └───────────────────────────────────────────┘
 */

    configurarSonidos() {
        try {
            // Crear contexto de audio
            this.sonidos.contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
            
            // Crear sonidos sintéticos
            this.crearSonidos();
            
            console.log("Sistema de sonidos configurado correctamente");
        } catch (error) {
            console.warn("No se pudo configurar el sistema de sonidos:", error);
            this.sonidos.habilitados = false;
        }
    }
    
    crearSonidos() {
        // Sonido de beep para cada segundo
        this.sonidos.beep = this.crearBeep(800, 0.1, 0.05);
        
        // Sonido de buzzer final
        this.sonidos.buzzFinal = this.crearBuzzer(200, 1.0, 0.1);
        
        // Sonido de puntos
        this.sonidos.puntos = this.crearPuntos(440, 0.3, 0.1);
        
        // Sonido de silbato
        this.sonidos.silbato = this.crearSilbato(1000, 0.5, 0.1);
    }
    
    crearBeep(frecuencia, duracion, volumen) {
        return () => {
            if (!this.sonidos.habilitados || !this.sonidos.contextoAudio) return;
            
            const oscilador = this.sonidos.contextoAudio.createOscillator();
            const ganancia = this.sonidos.contextoAudio.createGain();
            
            oscilador.connect(ganancia);
            ganancia.connect(this.sonidos.contextoAudio.destination);
            
            oscilador.frequency.value = frecuencia;
            oscilador.type = 'square';
            
            ganancia.gain.setValueAtTime(volumen, this.sonidos.contextoAudio.currentTime);
            ganancia.gain.exponentialRampToValueAtTime(0.001, this.sonidos.contextoAudio.currentTime + duracion);
            
            oscilador.start(this.sonidos.contextoAudio.currentTime);
            oscilador.stop(this.sonidos.contextoAudio.currentTime + duracion);
        };
    }
    
    crearBuzzer(frecuencia, duracion, volumen) {
        return () => {
            if (!this.sonidos.habilitados || !this.sonidos.contextoAudio) return;
            
            const oscilador = this.sonidos.contextoAudio.createOscillator();
            const ganancia = this.sonidos.contextoAudio.createGain();
            
            oscilador.connect(ganancia);
            ganancia.connect(this.sonidos.contextoAudio.destination);
            
            oscilador.frequency.value = frecuencia;
            oscilador.type = 'sawtooth';
            
            ganancia.gain.setValueAtTime(volumen, this.sonidos.contextoAudio.currentTime);
            ganancia.gain.exponentialRampToValueAtTime(0.001, this.sonidos.contextoAudio.currentTime + duracion);
            
            oscilador.start(this.sonidos.contextoAudio.currentTime);
            oscilador.stop(this.sonidos.contextoAudio.currentTime + duracion);
        };
    }
    
    crearPuntos(frecuencia, duracion, volumen) {
        return () => {
            if (!this.sonidos.habilitados || !this.sonidos.contextoAudio) return;
            
            const oscilador = this.sonidos.contextoAudio.createOscillator();
            const ganancia = this.sonidos.contextoAudio.createGain();
            
            oscilador.connect(ganancia);
            ganancia.connect(this.sonidos.contextoAudio.destination);
            
            oscilador.frequency.setValueAtTime(frecuencia, this.sonidos.contextoAudio.currentTime);
            oscilador.frequency.exponentialRampToValueAtTime(frecuencia * 2, this.sonidos.contextoAudio.currentTime + duracion);
            oscilador.type = 'sine';
            
            ganancia.gain.setValueAtTime(volumen, this.sonidos.contextoAudio.currentTime);
            ganancia.gain.exponentialRampToValueAtTime(0.001, this.sonidos.contextoAudio.currentTime + duracion);
            
            oscilador.start(this.sonidos.contextoAudio.currentTime);
            oscilador.stop(this.sonidos.contextoAudio.currentTime + duracion);
        };
    }
    
    crearSilbato(frecuencia, duracion, volumen) {
        return () => {
            if (!this.sonidos.habilitados || !this.sonidos.contextoAudio) return;
            
            const oscilador = this.sonidos.contextoAudio.createOscillator();
            const ganancia = this.sonidos.contextoAudio.createGain();
            const filtro = this.sonidos.contextoAudio.createBiquadFilter();
            
            oscilador.connect(filtro);
            filtro.connect(ganancia);
            ganancia.connect(this.sonidos.contextoAudio.destination);
            
            oscilador.frequency.value = frecuencia;
            oscilador.type = 'square';
            
            filtro.type = 'bandpass';
            filtro.frequency.value = frecuencia;
            filtro.Q.value = 10;
            
            ganancia.gain.setValueAtTime(volumen, this.sonidos.contextoAudio.currentTime);
            ganancia.gain.exponentialRampToValueAtTime(0.001, this.sonidos.contextoAudio.currentTime + duracion);
            
            oscilador.start(this.sonidos.contextoAudio.currentTime);
            oscilador.stop(this.sonidos.contextoAudio.currentTime + duracion);
        };
    }
    
    alternarSonidos() {
        this.sonidos.habilitados = !this.sonidos.habilitados;
        console.log(`Sonidos ${this.sonidos.habilitados ? 'activados' : 'desactivados'}`);
        return this.sonidos.habilitados;
    }
    
    inicializar() {
        this.configurarEventos();
        this.hacerElementosEditables();
        this.actualizarPantalla();
        this.actualizarPantallaCuarto();
    }

/**
 * ┌───────────────────────────────────────────┐
 * │        HACER ELEMENTOS EDITABLES          │
 * └───────────────────────────────────────────┘
 */

    hacerElementosEditables() {
        // Hacer nombres de equipos editables
        this.hacerTextoEditable(this.elementos.tituloLocal, 'nombreLocal');
        this.hacerTextoEditable(this.elementos.tituloVisitante, 'nombreVisitante');
        
        // Hacer marcadores editables
        this.hacerNumeroEditable(this.elementos.mostrarMarcadorLocal, 'marcadorLocal');
        this.hacerNumeroEditable(this.elementos.mostrarMarcadorVisitante, 'marcadorVisitante');
        
        // Hacer temporizador editable
        this.hacerTiempoEditable(this.elementos.mostrarTiempo);
        
        // Hacer cuarto editable
        this.hacerCuartoEditable(this.elementos.mostrarCentro);
    }
    
    hacerTextoEditable(elemento, clave) {
        elemento.style.cursor = 'pointer';
        elemento.title = 'Click para editar';
        
        elemento.addEventListener('click', () => {
            if (this.editorActual) return; // Ya hay algo editándose
            
            const textoActual = elemento.textContent;
            const entrada = document.createElement('input');
            
            // Configurar entrada
            entrada.type = 'text';
            entrada.value = textoActual;
            entrada.style.background = 'transparent';
            entrada.style.border = '1px solid yellow';
            entrada.style.color = 'white';
            entrada.style.fontSize = elemento.style.fontSize || '1em';
            entrada.style.textAlign = 'center';
            entrada.style.fontFamily = elemento.style.fontFamily || 'inherit';
            entrada.style.width = '100%';
            entrada.maxLength = 12;
            
            // Reemplazar elemento
            elemento.style.display = 'none';
            elemento.parentNode.insertBefore(entrada, elemento);
            entrada.focus();
            entrada.select();
            
            this.editorActual = { elemento, entrada, clave };
            
            // Manejar finalización de edición
            const terminarEdicion = () => {
                const nuevoValor = entrada.value.trim() || textoActual;
                this.estadoJuego[clave] = nuevoValor;
                elemento.textContent = nuevoValor;
                elemento.style.display = '';
                entrada.remove();
                this.editorActual = null;
                this.actualizarPantallaPosesion();
            };
            
            entrada.addEventListener('blur', terminarEdicion);
            entrada.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    terminarEdicion();
                } else if (e.key === 'Escape') {
                    elemento.style.display = '';
                    entrada.remove();
                    this.editorActual = null;
                }
            });
        });
    }
    
    hacerNumeroEditable(elemento, clave) {
        elemento.style.cursor = 'pointer';
        elemento.title = 'Click para editar';
        
        elemento.addEventListener('click', () => {
            if (this.editorActual) return;
            
            const valorActual = elemento.textContent;
            const entrada = document.createElement('input');
            
            // Configurar entrada
            entrada.type = 'number';
            entrada.value = valorActual;
            entrada.min = '0';
            entrada.max = '999';
            entrada.style.background = 'transparent';
            entrada.style.border = '1px solid yellow';
            entrada.style.color = 'yellow';
            entrada.style.fontSize = '95px';
            entrada.style.textAlign = 'center';
            entrada.style.fontFamily = 'Digital';
            entrada.style.width = '100%';
            
            // Reemplazar elemento
            elemento.style.display = 'none';
            elemento.parentNode.insertBefore(entrada, elemento);
            entrada.focus();
            entrada.select();
            
            this.editorActual = { elemento, entrada, clave };
            
            // Manejar finalización de edición
            const terminarEdicion = () => {
                const nuevoValor = Math.max(0, Math.min(999, parseInt(entrada.value) || 0));
                this.estadoJuego[clave] = nuevoValor;
                elemento.textContent = nuevoValor;
                elemento.style.display = '';
                entrada.remove();
                this.editorActual = null;
            };
            
            entrada.addEventListener('blur', terminarEdicion);
            entrada.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    terminarEdicion();
                } else if (e.key === 'Escape') {
                    elemento.style.display = '';
                    entrada.remove();
                    this.editorActual = null;
                }
            });
        });
    }
    
    hacerTiempoEditable(elemento) {
        elemento.style.cursor = 'pointer';
        elemento.title = 'Click para editar tiempo (MM:SS)';
        
        elemento.addEventListener('click', () => {
            if (this.editorActual) return;
            
            const tiempoActual = elemento.textContent;
            const entrada = document.createElement('input');
            
            // Configurar entrada
            entrada.type = 'text';
            entrada.value = tiempoActual;
            entrada.placeholder = 'MM:SS';
            entrada.style.background = 'transparent';
            entrada.style.border = '1px solid red';
            entrada.style.color = 'red';
            entrada.style.fontSize = '100px';
            entrada.style.textAlign = 'center';
            entrada.style.fontFamily = 'Digital';
            entrada.style.width = '100%';
            entrada.maxLength = 5;
            
            // Reemplazar elemento
            elemento.style.display = 'none';
            elemento.parentNode.insertBefore(entrada, elemento);
            entrada.focus();
            entrada.select();
            
            this.editorActual = { elemento, entrada };
            
            // Formatear tiempo mientras escribe
            entrada.addEventListener('input', (e) => {
                let valor = e.target.value.replace(/[^\d]/g, '');
                if (valor.length >= 2) {
                    valor = valor.slice(0, 2) + ':' + valor.slice(2, 4);
                }
                e.target.value = valor;
            });
            
            // Manejar finalización de edición
            const terminarEdicion = () => {
                const valorTiempo = entrada.value;
                const [minutos, segundos] = valorTiempo.split(':').map(n => parseInt(n) || 0);
                
                // Validar tiempo
                const minutosValidos = Math.max(0, Math.min(99, minutos));
                const segundosValidos = Math.max(0, Math.min(59, segundos));
                
                this.estadoJuego.minutosTiempo = minutosValidos;
                this.estadoJuego.segundosTiempo = segundosValidos;
                
                this.actualizarPantallaTiempo();
                elemento.style.display = '';
                entrada.remove();
                this.editorActual = null;
            };
            
            entrada.addEventListener('blur', terminarEdicion);
            entrada.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    terminarEdicion();
                } else if (e.key === 'Escape') {
                    elemento.style.display = '';
                    entrada.remove();
                    this.editorActual = null;
                }
            });
        });
    }
    
    hacerCuartoEditable(elemento) {
        elemento.style.cursor = 'pointer';
        elemento.title = 'Click para editar cuarto';
        
        elemento.addEventListener('click', () => {
            if (this.editorActual) return;
            
            const cuartoActual = elemento.textContent;
            const entrada = document.createElement('input');
            
            // Configurar entrada
            entrada.type = 'number';
            entrada.value = cuartoActual;
            entrada.min = '1';
            entrada.max = '4';
            entrada.style.background = 'transparent';
            entrada.style.border = '1px solid green';
            entrada.style.color = 'green';
            entrada.style.fontSize = '80px';
            entrada.style.textAlign = 'center';
            entrada.style.fontFamily = 'Digital';
            entrada.style.width = '100%';
            
            // Reemplazar elemento
            elemento.style.display = 'none';
            elemento.parentNode.insertBefore(entrada, elemento);
            entrada.focus();
            entrada.select();
            
            this.editorActual = { elemento, entrada };
            
            // Manejar finalización de edición
            const terminarEdicion = () => {
                const nuevoCuarto = Math.max(1, Math.min(4, parseInt(entrada.value) || 1));
                this.estadoJuego.cuarto = nuevoCuarto;
                elemento.textContent = nuevoCuarto;
                elemento.style.display = '';
                entrada.remove();
                this.editorActual = null;
            };
            
            entrada.addEventListener('blur', terminarEdicion);
            entrada.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    terminarEdicion();
                } else if (e.key === 'Escape') {
                    elemento.style.display = '';
                    entrada.remove();
                    this.editorActual = null;
                }
            });
        });
    }
    
/**
 * ┌───────────────────────────────────────────┐
 * │        CONFIGURACIÓN DE EVENTOS           │
 * └───────────────────────────────────────────┘
 */

    configurarEventos() {
        // Botones de tiempo (cambiar cuarto)
        this.elementos.botonIzquierdo.addEventListener("click", () => this.cambiarCuarto(-1));
        this.elementos.botonDerecho.addEventListener("click", () => this.cambiarCuarto(1));
        
        // Botones de marcador LOCAL
        this.elementos.botonesLocal[0].addEventListener("click", () => this.cambiarMarcador('local', 1));
        this.elementos.botonesLocal[1].addEventListener("click", () => this.cambiarMarcador('local', -1));
        
        // Botones de marcador VISITANTE
        this.elementos.botonesVisitante[0].addEventListener("click", () => this.cambiarMarcador('visitante', 1));
        this.elementos.botonesVisitante[1].addEventListener("click", () => this.cambiarMarcador('visitante', -1));
        
        // Botón reset
        this.elementos.botonReinicio.addEventListener("click", () => this.reiniciarJuego());
        
        // Control del temporizador con teclas (solo cuando no se está editando)
        document.addEventListener("keydown", (e) => {
            if (this.editorActual) return; // No interferir con la edición
            
            switch(e.key.toLowerCase()) {
                case " ": // Espacio para pausar/reanudar
                    e.preventDefault();
                    this.alternarTemporizador();
                    break;
                case "r": // R para resetear tiempo
                    //this.reiniciarTemporizador();
                    this.reiniciarJuego();
                    break;
                case "p": // P para cambiar posesión
                    this.alternarPosesion();
                    break;
                case "s": // S para alternar sonidos
                    this.alternarSonidos();
                    break;
                    
            }
        });
        
        let inicioPresion = 0;
        // Umbral para considerar “mantener pulsado” (1.5 segundos)
        const UMBRAL_SOSTENIDO = 200; // em milisegundos

        const elementoExcluido = (el) => !!el.closest('.no-gesture');

        document.body.addEventListener('pointerdown', (e) => {
            if (this.editorActual || elementoExcluido(e.target)) return;
            inicioPresion = Date.now();
        });

        document.body.addEventListener('pointerup', (e) => {
            if (this.editorActual || elementoExcluido(e.target)) {
                inicioPresion = 0;
                return;
            }
            const duracion = Date.now() - inicioPresion;
            inicioPresion = 0;

            if (duracion >= UMBRAL_SOSTENIDO) {
                this.alternarPosesion();
            } else if (duracion > 0) {
                // toque breve → iniciar/pausar temporizador
                this.alternarTemporizador();
            }
        });

        document.body.addEventListener('pointercancel', () => {
            // Si el gesto se cancela, reseteamos
            inicioPresion = 0;
        });

        
    }
    
/**
 * ┌───────────────────────────────────────────┐
 * │        FUNCIONES DEL TEMPORIZADOR         │
 * └───────────────────────────────────────────┘
 */

    alternarTemporizador() {
        if (this.estadoJuego.estaFuncionando) {
            this.pausarTemporizador();
        } else {
            this.iniciarTemporizador();
        }
    }
    
    iniciarTemporizador() {
        if (this.temporizador) return; // Ya está corriendo
        
        this.estadoJuego.estaFuncionando = true;
        this.temporizador = setInterval(() => {
            this.decrementarTiempo();
        }, 1000);
        
        // Cambiar color del temporizador cuando está corriendo
        this.elementos.mostrarTiempo.style.color = "lime";
    }
    
    pausarTemporizador() {
        if (this.temporizador) {
            clearInterval(this.temporizador);
            this.temporizador = null;
        }
        this.estadoJuego.estaFuncionando = false;
        this.elementos.mostrarTiempo.style.color = "red";
    }
    
    reiniciarTemporizador() {
        this.pausarTemporizador();
        this.estadoJuego.minutosTiempo = 20;
        this.estadoJuego.segundosTiempo = 0;
        this.actualizarPantallaTiempo();
    }
    
    decrementarTiempo() {
        if (this.estadoJuego.segundosTiempo > 0) {
            this.estadoJuego.segundosTiempo--;
        } else if (this.estadoJuego.minutosTiempo > 0) {
            this.estadoJuego.minutosTiempo--;
            this.estadoJuego.segundosTiempo = 59;
        } else {
            // Tiempo terminado
            this.pausarTemporizador();
            this.elementos.mostrarTiempo.style.color = "red";
            this.sonidos.buzzFinal(); // Sonido de final de tiempo
            this.parpadearTiempo();
            return;
        }
        
        // Reproducir beep en los últimos 10 segundos
        if (this.estadoJuego.minutosTiempo === 0 && this.estadoJuego.segundosTiempo <= 10) {
            this.sonidos.beep();
        }
        
        this.actualizarPantallaTiempo();
    }
    
    parpadearTiempo() {
        let contadorParpadeo = 0;
        const intervaloParpadeo = setInterval(() => {
            this.elementos.mostrarTiempo.style.visibility = 
                this.elementos.mostrarTiempo.style.visibility === 'hidden' ? 'visible' : 'hidden';
            
            contadorParpadeo++;
            if (contadorParpadeo >= 6) {
                clearInterval(intervaloParpadeo);
                this.elementos.mostrarTiempo.style.visibility = 'visible';
            }
        }, 500);
    }
    
/**
 * ┌───────────────────────────────────────────┐
 * │        FUNCIONES DEL MARCADOR             │
 * └───────────────────────────────────────────┘
 */
    cambiarMarcador(equipo, puntos) {
        if (equipo === 'local') {
            this.estadoJuego.marcadorLocal = Math.max(0, this.estadoJuego.marcadorLocal + puntos);
        } else {
            this.estadoJuego.marcadorVisitante = Math.max(0, this.estadoJuego.marcadorVisitante + puntos);
        }
        
        // Reproducir sonido de puntos solo cuando se agregan puntos
        if (puntos > 0) {
            this.sonidos.puntos();
        }
        
        this.actualizarPantallaMarcador();
    }
    
    
/**
 * ┌───────────────────────────────────────────┐
 * │        FUNCIONES DE CUARTO                │
 * └───────────────────────────────────────────┘
 */
    cambiarCuarto(direccion) {
        const nuevoCuarto = this.estadoJuego.cuarto + direccion;
        if (nuevoCuarto >= 1 && nuevoCuarto <= 4) {
            this.estadoJuego.cuarto = nuevoCuarto;
            this.sonidos.silbato(); // Sonido de silbato al cambiar cuarto
            this.actualizarPantallaCuarto();
        }
    }
     
/**
 * ┌───────────────────────────────────────────┐
 * │        FUNCIONES DE POSESIÓN                │
 * └───────────────────────────────────────────┘
 */
    alternarPosesion() {
        this.estadoJuego.posesion = this.estadoJuego.posesion === 'local' ? 'visitante' : 'local';
        this.actualizarPantallaPosesion();
    }
    
    actualizarPantallaPosesion() {
        const tituloLocal = this.elementos.tituloLocal;
        const tituloVisitante = this.elementos.tituloVisitante;
        
        // Remover indicadores previos
        tituloLocal.style.textDecoration = 'none';
        tituloVisitante.style.textDecoration = 'none';
        
        // Agregar indicador de posesión
        if (this.estadoJuego.posesion === 'local') {
            tituloLocal.style.textDecoration = 'underline';
            tituloLocal.style.textDecorationColor = 'yellow';
        } else {
            tituloVisitante.style.textDecoration = 'underline';
            tituloVisitante.style.textDecorationColor = 'yellow';
        }
    }
    
/**
 * ┌───────────────────────────────────────────┐
 * │ FUNCIONES DE ACTUALIZACIÓN DE PANTALLA    │
 * └───────────────────────────────────────────┘
 */
    actualizarPantallaTiempo() {
        const minutos = this.estadoJuego.minutosTiempo.toString().padStart(2, '0');
        const segundos = this.estadoJuego.segundosTiempo.toString().padStart(2, '0');
        this.elementos.mostrarTiempo.textContent = `${minutos}:${segundos}`;
    }
    
    actualizarPantallaMarcador() {
        this.elementos.mostrarMarcadorLocal.textContent = this.estadoJuego.marcadorLocal;
        this.elementos.mostrarMarcadorVisitante.textContent = this.estadoJuego.marcadorVisitante;
    }
    
    actualizarPantallaCuarto() {
        this.elementos.mostrarCentro.textContent = this.estadoJuego.cuarto;
    }
    
    actualizarPantalla() {
        this.actualizarPantallaTiempo();
        this.actualizarPantallaMarcador();
        this.actualizarPantallaCuarto();
        this.actualizarPantallaPosesion();
        this.elementos.tituloLocal.textContent = this.estadoJuego.nombreLocal;
        this.elementos.tituloVisitante.textContent = this.estadoJuego.nombreVisitante;
    }


/**
 * ┌───────────────────────────────────────────┐
 * │        FUNCIONES PUBLICAS                 │
 * └───────────────────────────────────────────┘
 */
    reiniciarJuego() {
        this.pausarTemporizador();
        this.estadoJuego = {
            marcadorLocal: 0,
            marcadorVisitante: 0,
            minutosTiempo: 20,
            segundosTiempo: 0,
            cuarto: 1,
            estaFuncionando: false,
            posesion: 'local',
            nombreLocal: 'LOCAL',
            nombreVisitante: 'VISITANTE'
        };
        this.actualizarPantalla();
        this.elementos.mostrarTiempo.style.color = "red";
    }
    
    // Métodos para control externo
    obtenerEstadoJuego() {
        return { ...this.estadoJuego };
    }
    
    establecerEstadoJuego(nuevoEstado) {
        this.estadoJuego = { ...this.estadoJuego, ...nuevoEstado };
        this.actualizarPantalla();
    }
}

/**
 * ┌───────────────────────────────────────────┐
 * │        INICIALIZACIÓN                     │
 * └───────────────────────────────────────────┘
 */


let tablero;

document.addEventListener("DOMContentLoaded", function() {
    tablero = new TableroBaloncesto();
    
    window.apiTablero = {
        iniciarTemporizador: () => tablero.iniciarTemporizador(),
        pausarTemporizador: () => tablero.pausarTemporizador(),
        reiniciarTemporizador: () => tablero.reiniciarTemporizador(),
        reiniciarJuego: () => tablero.reiniciarJuego(),
        cambiarMarcador: (equipo, puntos) => tablero.cambiarMarcador(equipo, puntos),
        obtenerEstadoJuego: () => tablero.obtenerEstadoJuego(),
        establecerEstadoJuego: (estado) => tablero.establecerEstadoJuego(estado),
        alternarSonidos: () => tablero.alternarSonidos()
    };
});
