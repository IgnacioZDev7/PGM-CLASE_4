import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-user-panel',
  imports: [],
  templateUrl: './user-panel.html',
  styleUrl: './user-panel.scss',
})
export class UserPanel {
  public createUserIcon(): THREE.Group {
    const group = new THREE.Group();

    // Cabeza (Esfera con brillo)
    const headGeom = new THREE.SphereGeometry(0.35, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      emissive: 0x00d4ff,
      emissiveIntensity: 0.5,
      roughness: 0
    });
    const head = new THREE.Mesh(headGeom, headMat);
    head.position.y = 0.5;
    group.add(head);

    // Cuerpo (Capsula estilizada)
    const bodyGeom = new THREE.CapsuleGeometry(0.35, 0.4, 8, 16);
    const body = new THREE.Mesh(bodyGeom, headMat);
    body.position.y = -0.1;
    group.add(body);

    // Anillo Holográfico
    const ringGeom = new THREE.TorusGeometry(0.8, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.5;
    group.add(ring);

    return group;
  }
}

// este componente es el que se encarga de manejar el panel de usuario

