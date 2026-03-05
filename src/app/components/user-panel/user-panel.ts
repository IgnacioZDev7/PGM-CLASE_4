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
    const grupo = new THREE.Group(); //se crea un container vacio para agrupar 

    //definicion de la cabeza del avatar
    const geometriaCabeza = new THREE.SphereGeometry(0.35, 32, 32); 
    const materialCabeza = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      emissive: 0x00d4ff, 
      emissiveIntensity: 0.5, 
      roughness: 0 
    });
    const cabeza = new THREE.Mesh(geometriaCabeza, materialCabeza); 
    cabeza.position.y = 0.5; 
    grupo.add(cabeza); 

    // se crea el cuerpo con forma de capsula
    const geometriaCuerpo = new THREE.CapsuleGeometry(0.35, 0.4, 8, 16); 
    const cuerpo = new THREE.Mesh(geometriaCuerpo, materialCabeza);
    cuerpo.position.y = -0.1; 
    grupo.add(cuerpo); 

    // se crea un anillo alrededor del icono
    const geometriaAnillo = new THREE.TorusGeometry(0.8, 0.02, 16, 100); 
    const materialAnillo = new THREE.MeshBasicMaterial({ 
      color: 0x00d4ff, 
      transparent: true, 
      opacity: 0.5 
    });
    const anillo = new THREE.Mesh(geometriaAnillo, materialAnillo);
    anillo.rotation.x = Math.PI / 2; //para acostarlo horizontalmente
    anillo.position.y = 0.5; // para centrar a la altura de la cabeza
    grupo.add(anillo);

    return grupo; //se retorna el personaje 
  }
}
