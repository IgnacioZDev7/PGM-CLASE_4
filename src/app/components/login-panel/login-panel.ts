import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-panel-login', // Nombre para usar el componente en el HTML
  imports: [],
  templateUrl: './login-panel.html',
  styleUrl: './login-panel.scss',
})
export class PanelLogin {
  // Función principal que construye todo el formulario de login en 3D
  public crearGrupoLogin(): THREE.Group {
    const grupo = new THREE.Group(); // Contenedor para todos los elementos del login

    // Creamos el panel de fondo con un efecto de vidrio oscuro (Gassmorphism)
    // Esto asegura que el texto se lea bien incluso en fondos claros
    const geometriaPanel = new THREE.PlaneGeometry(4, 5.5);
    const materialPanel = new THREE.MeshPhysicalMaterial({
      color: 0x111111, // Negro muy oscuro
      transparent: true,
      opacity: 0.8, // Casi opaco para mejor lectura
      roughness: 0.2, // Un poco de rugosidad para el efecto de vidrio
      metalness: 0,
      transmission: 0.3, // Deja pasar un poco la luz del fondo
      thickness: 1, // Grosor del "vidrio"
      ior: 1.5, // Índice de refracción
      side: THREE.DoubleSide
    });
    const panel = new THREE.Mesh(geometriaPanel, materialPanel);
    grupo.add(panel); // Añadimos el fondo al grupo

    // Creamos un borde neón resaltado para darle un estilo moderno/cyberpunk
    const bordes = new THREE.EdgesGeometry(geometriaPanel);
    const materialLinea = new THREE.LineBasicMaterial({ 
      color: 0x00d4ff, 
      transparent: true, 
      opacity: 0.5 
    });
    const lineaBorde = new THREE.LineSegments(bordes, materialLinea);
    grupo.add(lineaBorde); // Añadimos el marco neón

    // Título del portal: "RETAIL 360"
    const texturaTitulo = this.crearTexturaTexto('RETAIL 360', 100);
    const geometriaTitulo = new THREE.PlaneGeometry(3, 0.4);
    const materialTitulo = new THREE.MeshBasicMaterial({ map: texturaTitulo, transparent: true });
    const mallaTitulo = new THREE.Mesh(geometriaTitulo, materialTitulo);
    mallaTitulo.position.y = 2.2; // Lo ponemos en la parte superior
    grupo.add(mallaTitulo);

    // Subtítulo explicativo
    const texturaSub = this.crearTexturaTexto('Login Experience', 60, '#aaaaaa');
    const geometriaSub = new THREE.PlaneGeometry(2, 0.2);
    const materialSub = new THREE.MeshBasicMaterial({ map: texturaSub, transparent: true });
    const mallaSub = new THREE.Mesh(geometriaSub, materialSub);
    mallaSub.position.y = 1.8;
    grupo.add(mallaSub);

    // Creamos los campos para introducir datos (Usuario y Password)
    const campoUsuario = this.crearCampoEntrada('Usuario', 0.5);
    grupo.add(campoUsuario);

    const campoPass = this.crearCampoEntrada('Password', -0.8);
    grupo.add(campoPass);

    // Creamos el botón principal de acción
    const texturaBoton = this.crearTexturaTexto('INICIAR SESIÓN', 100, '#ffffff');
    const geometriaBoton = new THREE.PlaneGeometry(3, 0.6);
    const materialBoton = new THREE.MeshStandardMaterial({ 
      color: 0x00d4ff, // Fondo azul para el botón
      map: texturaBoton,
      transparent: true,
      emissive: 0x00d4ff, // Iluminación propia para que brille
      emissiveIntensity: 0.3
    });
    const mallaBoton = new THREE.Mesh(geometriaBoton, materialBoton);
    mallaBoton.position.y = -2.2; // Posicionado en la base del panel
    mallaBoton.name = 'botonLogin'; // Identificador para saber cuándo se hace clic
    grupo.add(mallaBoton);

    return grupo; // Retornamos el formulario completo
  }

  // Esta función crea un campo de texto con su etiqueta y su línea de entrada
  private crearCampoEntrada(etiqueta: string, posicionY: number): THREE.Group {
    const grupoCampo = new THREE.Group();

    // Texto de la etiqueta (ej: "Usuario")
    const texturaEtiqueta = this.crearTexturaTexto(etiqueta, 70, '#00d4ff');
    const geometriaEtiqueta = new THREE.PlaneGeometry(1.2, 0.25);
    const materialEtiqueta = new THREE.MeshBasicMaterial({ map: texturaEtiqueta, transparent: true });
    const mallaEtiqueta = new THREE.Mesh(geometriaEtiqueta, materialEtiqueta);
    mallaEtiqueta.position.set(-1, posicionY + 0.5, 0.01);
    grupoCampo.add(mallaEtiqueta);

    // Fondo oscuro sutil para el área donde iría el texto
    const geometriaCaja = new THREE.PlaneGeometry(3.2, 0.5);
    const materialCaja = new THREE.MeshBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.5 });
    const mallaCaja = new THREE.Mesh(geometriaCaja, materialCaja);
    mallaCaja.position.y = posicionY;
    grupoCampo.add(mallaCaja);

    // Línea base brillante para un estilo minimalista
    const geometriaLinea = new THREE.PlaneGeometry(3.2, 0.02);
    const materialLinea = new THREE.MeshBasicMaterial({ color: 0x00d4ff });
    const linea = new THREE.Mesh(geometriaLinea, materialLinea);
    linea.position.y = posicionY - 0.25;
    grupoCampo.add(linea);

    return grupoCampo;
  }

  // Genera una textura a partir de un Canvas de HTML5 para mostrar texto en 3D
  private crearTexturaTexto(contenido: string, tamano: number, color: string = '#ffffff', colorFondo: string = 'transparent'): THREE.CanvasTexture {
    const lienzo = document.createElement('canvas');
    const contexto = lienzo.getContext('2d')!;
    // Usamos resolución 1024x256 para que el texto se vea muy nítido
    lienzo.width = 1024;
    lienzo.height = 256;

    if (colorFondo !== 'transparent') {
      contexto.fillStyle = colorFondo;
      // Dibujamos un fondo sólido si se requiere
      contexto.fillRect(0, 0, lienzo.width, lienzo.height);
    }

    // Estilo de fuente elegante y moderno
    contexto.font = `italic 700 ${tamano}px 'Inter', Arial, sans-serif`;
    contexto.fillStyle = color;
    contexto.textAlign = 'center';
    contexto.textBaseline = 'middle';
    contexto.fillText(contenido, lienzo.width / 2, lienzo.height / 2);

    const textura = new THREE.CanvasTexture(lienzo);
    textura.anisotropy = 16; // Filtro de alta calidad para evitar pixelado
    return textura;
  }

  // Función que se ejecuta cuando el login es correcto (simulación)
  public alIniciarSesionExito() {
    console.log('Animación de éxito iniciada');
  }
}
