import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { PanelLogin } from '../login-panel/login-panel';
import { PanelUsuario } from '../user-panel/user-panel';

@Component({
  selector: 'app-visor-360',
  imports: [PanelLogin, PanelUsuario],
  templateUrl: './viewer-360.html',
  styleUrl: './viewer-360.scss',
})
export class Visor360 implements AfterViewInit {
  // ref al contenedor principal 
  @ViewChild('rendererContainer') contenedorRender!: ElementRef;
  
  // Instancias de nuestros componentes hijos para acceder a su lógica
  private componentePanelLogin = new PanelLogin();
  private componentePanelUsuario = new PanelUsuario();

  // Variables básicas del motor Three.js
  private escena!: THREE.Scene;
  private camara!: THREE.PerspectiveCamera;
  private renderizador!: THREE.WebGLRenderer;

  // Variables para el control de la cámara y navegación 360
  private esInteractuando = false;
  private longitud = 0;
  private latitud = 0;
  private phi = 0;
  private theta = 0;

  // Variables para capturar la posición del mouse en el inicio del click
  private mouseXEnClick = 0;
  private mouseYEnClick = 0;
  private longitudEnClick = 0;
  private latitudEnClick = 0;

  // Raycaster para detectar a qué objetos 3D apuntamos con el mouse
  private lanzadorRayos = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private objetoIntersecado: THREE.Object3D | null = null;
  private escalaOriginal = new THREE.Vector3();

  constructor() {}

  // se ejecuta al cargar la vista HTML
  ngAfterViewInit() {
    this.iniciarMotor3D(); // Configurar hree.js
    this.animar(); //bucle de dibujo
  }

  // Configuración de mundo 3D
  private iniciarMotor3D() {
    this.escena = new THREE.Scene(); // se crea una escena vacía

    // se configura la cámara (ángulo de visión, aspecto, distancia mínima y máxima)
    this.camara = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1100
    );

    // le pongo iluminación al mundo
    const luzAmbiental = new THREE.AmbientLight(0x404040, 2); 
    this.escena.add(luzAmbiental);

    const luzPuntual = new THREE.PointLight(0x00d4ff, 2, 100); 
    luzPuntual.position.set(2, 5, 2);
    this.escena.add(luzPuntual);

    const luzBlanca = new THREE.PointLight(0xffffff, 1, 50); 
    luzBlanca.position.set(-5, -2, -5);
    this.escena.add(luzBlanca);

    // se crea la esfera que contiene la foto 360
    const geometriaFondo = new THREE.SphereGeometry(500, 60, 40);
    geometriaFondo.scale(-1, 1, 1); // se invierte para verla desde adentro

    const cargador = new THREE.TextureLoader();
    // se carga la foto desde la carpeta /public
    const texturaFondo = cargador.load('PXL_20250614_152137453.PHOTOSPHERE.jpg');// la foto de mi proyecto anterior funciona mejor que unas de internet y generadas por ia
    const materialFondo = new THREE.MeshBasicMaterial({ map: texturaFondo });

    const mallaFondo = new THREE.Mesh(geometriaFondo, materialFondo);
    this.escena.add(mallaFondo); // se pone el fondo en la escena

    // Integramos el panel de login que diseñamos anteriormente
    const grupoLogin = this.componentePanelLogin.crearGrupoLogin();
    grupoLogin.position.set(0, 0, -5); // se pone frente a la cámara
    this.escena.add(grupoLogin);

    // Integramos el avatar de usuario
    const iconoUsuario = this.componentePanelUsuario.crearIconoUsuario();
    iconoUsuario.position.set(0, 3.5, -4.5); // se pone arriba del login
    this.escena.add(iconoUsuario);

    // se configura el renderizador (la "pantalla" que dibuja los píxeles)
    this.renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderizador.setPixelRatio(window.devicePixelRatio);
    this.renderizador.setSize(window.innerWidth, window.innerHeight);
    
    // se pega en el div de nuestro HTML
    const contenedor = this.contenedorRender.nativeElement;
    contenedor.appendChild(this.renderizador.domElement);

    // se escuchan los eventos del usuario (mouse, teclado, ventana)
    contenedor.addEventListener('pointerdown', this.alPresionarPuntero.bind(this));
    contenedor.addEventListener('wheel', this.alUsarRuedaMouse.bind(this));
    window.addEventListener('resize', this.alRedimensionarVentana.bind(this));
    contenedor.addEventListener('click', this.alHacerClic.bind(this));
  }

  // se ejecuta cuando el usuario hace clic con el mouse
  private alHacerClic() {
    // si estamos apuntando al botón de login, lanzamos la entrada
    if (this.objetoIntersecado && this.objetoIntersecado.name === 'botonLogin') {
      alert('¡Acceso concedido! Bienvenido al portal Retail 360.');
      this.componentePanelLogin.alIniciarSesionExito();
    }
  }

  // ajusta el 3D si el usuario cambia el tamaño del navegador
  private alRedimensionarVentana() {
    this.camara.aspect = window.innerWidth / window.innerHeight;
    this.camara.updateProjectionMatrix();
    this.renderizador.setSize(window.innerWidth, window.innerHeight);
  }

  // captura el inicio del arrastre de cámara
  private alPresionarPuntero(evento: PointerEvent) {
    if (evento.isPrimary === false) return;

    this.esInteractuando = true;

    this.mouseXEnClick = evento.clientX;
    this.mouseYEnClick = evento.clientY;

    this.longitudEnClick = this.longitud;
    this.latitudEnClick = this.latitud;

    document.addEventListener('pointermove', this.alMoverPuntero.bind(this));
    document.addEventListener('pointerup', this.alSoltarPuntero.bind(this));
  }

  // bucle infinito para que la escena se mueva y reaccione
  private animar() {
    requestAnimationFrame(() => this.animar());
    this.actualizar(); // calculamos cambios
  }

  // finaliza el arrastre de la cámara
  private alSoltarPuntero() {
    this.esInteractuando = false;
    document.removeEventListener('pointermove', this.alMoverPuntero);
    document.removeEventListener('pointerup', this.alSoltarPuntero);
  }

  // control del zoom mediante la rueda del mouse
  private alUsarRuedaMouse(evento: WheelEvent) {
    const fovActual = this.camara.fov + evento.deltaY * 0.05;
    this.camara.fov = THREE.MathUtils.clamp(fovActual, 10, 75); // limitamos el zoom
    this.camara.updateProjectionMatrix();
  }

  // mueve la vista cuando el usuario arrastra el mouse
  private alMoverPuntero(evento: PointerEvent) {
    if (evento.isPrimary === false) return;
    
    // actualizamos coordenadas para el Raycaster (detección de objetos)
    this.mouse.x = (evento.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(evento.clientY / window.innerHeight) * 2 + 1;

    // si estamos haciendo clic y arrastrando, rotamos la cámara
    if (this.esInteractuando) {
      this.longitud = (this.mouseXEnClick - evento.clientX) * 0.1 + this.longitudEnClick;
      this.latitud = (evento.clientY - this.mouseYEnClick) * 0.1 + this.latitudEnClick;
    }
  }

  // lógica de cálculo frame a frame
  private actualizar() {
    // limitamos la cámara para que no dé la vuelta completa verticalmente
    this.latitud = Math.max(-85, Math.min(85, this.latitud));
    this.phi = THREE.MathUtils.degToRad(90 - this.latitud);
    this.theta = THREE.MathUtils.degToRad(this.longitud);

    // calculamos hacia dónde mira la cámara en el espacio 3D
    const x = Math.sin(this.phi) * Math.cos(this.theta);
    const y = Math.cos(this.phi);
    const z = Math.sin(this.phi) * Math.sin(this.theta);

    // aplicamos un Lerp para que el movimiento sea elegante y se SUAVICE
    const objetivoMira = new THREE.Vector3(x, y, z);
    const direccionActual = this.camara.getWorldDirection(new THREE.Vector3()).add(this.camara.position);
    direccionActual.lerp(objetivoMira, 0.1); 
    this.camara.lookAt(direccionActual);

    // detecta si el mouse está encima de algún botón
    this.lanzadorRayos.setFromCamera(this.mouse, this.camara);
    const interacciones = this.lanzadorRayos.intersectObjects(this.escena.children, true);

    if (interacciones.length > 0) {
      const objetoActual = interacciones[0].object;
      if (this.objetoIntersecado !== objetoActual) {
        if (this.objetoIntersecado) {
          this.objetoIntersecado.scale.copy(this.escalaOriginal);
          if ((this.objetoIntersecado as any).material.emissive) {
            (this.objetoIntersecado as any).material.emissiveIntensity = 0.3;
          }
        }
        
        this.objetoIntersecado = objetoActual;
        this.escalaOriginal.copy(this.objetoIntersecado.scale);
        
        if (this.objetoIntersecado.name === 'botonLogin') {
           this.objetoIntersecado.scale.set(1.1, 1.1, 1.1);
           if ((this.objetoIntersecado as any).material.emissive) {
             (this.objetoIntersecado as any).material.emissiveIntensity = 1.0;
           }
        }
      }
    } else {
      if (this.objetoIntersecado) {
        this.objetoIntersecado.scale.copy(this.escalaOriginal);
        if ((this.objetoIntersecado as any).material.emissive) {
            (this.objetoIntersecado as any).material.emissiveIntensity = 0.3;
          }
      }
      this.objetoIntersecado = null;
    }

    // se dibuja el frame final
    this.renderizador.render(this.escena, this.camara);
  }
}
