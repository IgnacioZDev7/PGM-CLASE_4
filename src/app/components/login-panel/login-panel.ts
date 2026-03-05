import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-login-panel',
  imports: [],
  templateUrl: './login-panel.html',
  styleUrl: './login-panel.scss',
})
export class LoginPanel {
  public createLoginGroup(): THREE.Group {
    const group = new THREE.Group();

    // Fondo del panel
    const panelGeom = new THREE.PlaneGeometry(4, 5);
    const panelMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const panel = new THREE.Mesh(panelGeom, panelMat);
    group.add(panel);

    // Título
    const titleTex = this.createTextTexture('LOGIN RETAIL 360', 128);
    const titleGeom = new THREE.PlaneGeometry(3, 0.5);
    const titleMat = new THREE.MeshBasicMaterial({ map: titleTex, transparent: true });
    const titleMesh = new THREE.Mesh(titleGeom, titleMat);
    titleMesh.position.y = 2;
    group.add(titleMesh);

    // Campo de Usuario
    const userField = this.createInputField('Usuario', -0.5);
    group.add(userField);

    // Campo de Password
    const passField = this.createInputField('Password', -1.5);
    group.add(passField);

    // Botón de Entrar
    const btnTex = this.createTextTexture('ENTRAR', 128, '#ffffff', '#007bff');
    const btnGeom = new THREE.PlaneGeometry(2, 0.8);
    const btnMat = new THREE.MeshBasicMaterial({ map: btnTex, transparent: true });
    const btnMesh = new THREE.Mesh(btnGeom, btnMat);
    btnMesh.position.y = -3;
    btnMesh.name = 'loginButton';
    group.add(btnMesh);

    return group;
  }

  private createInputField(label: string, yPos: number): THREE.Group {
    const fieldGroup = new THREE.Group();

    // Etiqueta
    const labelTex = this.createTextTexture(label, 64);
    const labelGeom = new THREE.PlaneGeometry(1.5, 0.3);
    const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true });
    const labelMesh = new THREE.Mesh(labelGeom, labelMat);
    labelMesh.position.set(-1, yPos + 0.4, 0.01);
    fieldGroup.add(labelMesh);

    // Caja de input
    const boxGeom = new THREE.PlaneGeometry(3.5, 0.6);
    const boxMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
    const boxMesh = new THREE.Mesh(boxGeom, boxMat);
    boxMesh.position.y = yPos;
    fieldGroup.add(boxMesh);

    return fieldGroup;
  }

  private createTextTexture(text: string, size: number, color: string = '#ffffff', bgColor: string = 'transparent'): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 512;
    canvas.height = 128;

    if (bgColor !== 'transparent') {
      context.fillStyle = bgColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.font = `bold ${size}px Arial`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
}

// este componente es el que se encarga de manejar el login
// tiene dos botones para iniciar sesion como usuario o como administrador

