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

    // Cabeza
    const headGeom = new THREE.SphereGeometry(0.3, 32, 32);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00d4ff });
    const head = new THREE.Mesh(headGeom, mat);
    head.position.y = 0.4;
    group.add(head);

    // Cuerpo
    const bodyGeom = new THREE.CapsuleGeometry(0.3, 0.4, 4, 8);
    const body = new THREE.Mesh(bodyGeom, mat);
    body.position.y = -0.1;
    group.add(body);

    return group;
  }
}

// este componente es el que se encarga de manejar el panel de usuario

