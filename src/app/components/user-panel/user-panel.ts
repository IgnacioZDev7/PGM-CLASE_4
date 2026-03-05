import { Component } from '@angular/core';
import * as THREE from 'three';
@Component({
  selector: 'app-panel-usuario', 
  imports: [],
  templateUrl: './user-panel.html', 
  styleUrl: './user-panel.scss', 
})
export class PanelUsuario {
  // funcion para crear representación 3D del usuario
  public crearIconoUsuario(): THREE.Group {
    const grupo = new THREE.Group(); // Creamos un contenedor vacío para agrupar las partes

    // Definimos la cabeza del avatar como una esfera con brillo holográfico
    const geometriaCabeza = new THREE.SphereGeometry(0.35, 32, 32); 
    const materialCabeza = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, // Color blanco base
      emissive: 0x00d4ff, // Brillo propio en color azul celeste
      emissiveIntensity: 0.5, // Intensidad del brillo
      roughness: 0 // Superficie totalmente lisa para reflejar luz
    });
    const cabeza = new THREE.Mesh(geometriaCabeza, materialCabeza); // Unimos geometría y material
    cabeza.position.y = 0.5; // La subimos un poco sobre el cuerpo
    grupo.add(cabeza); // La añadimos al grupo

    // Creamos el cuerpo usando una cápsula estilizada
    const geometriaCuerpo = new THREE.CapsuleGeometry(0.35, 0.4, 8, 16); 
    const cuerpo = new THREE.Mesh(geometriaCuerpo, materialCabeza); // Usamos el mismo material que la cabeza
    cuerpo.position.y = -0.1; // Lo posicionamos debajo de la cabeza
    grupo.add(cuerpo); // Lo añadimos al grupo

    // Añadimos un anillo holográfico alrededor del icono para darle un toque premium
    const geometriaAnillo = new THREE.TorusGeometry(0.8, 0.02, 16, 100); 
    const materialAnillo = new THREE.MeshBasicMaterial({ 
      color: 0x00d4ff, 
      transparent: true, 
      opacity: 0.5 // Transparente para que parezca una proyección
    });
    const anillo = new THREE.Mesh(geometriaAnillo, materialAnillo);
    anillo.rotation.x = Math.PI / 2; // Lo acostamos horizontalmente
    anillo.position.y = 0.5; // Lo centramos a la altura de la cabeza
    grupo.add(anillo); // Añadimos el toque final al grupo

    return grupo; // Devolvemos el personaje completo
  }
}
