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

    // Fondo del panel - Glassmorphism más oscuro para contraste
    const panelGeom = new THREE.PlaneGeometry(4, 5.5);
    const panelMat = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      transparent: true,
      opacity: 0.8,
      roughness: 0.2,
      metalness: 0,
      transmission: 0.3, // Menos transparente para leer mejor en fondos claros
      thickness: 1,
      ior: 1.5,
      side: THREE.DoubleSide
    });
    const panel = new THREE.Mesh(panelGeom, panelMat);
    group.add(panel);

    // Borde brillante (Neon)
    const edges = new THREE.EdgesGeometry(panelGeom);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.5 });
    const line = new THREE.LineSegments(edges, lineMat);
    group.add(line);

    // Título - Más compacto y elegante
    const titleTex = this.createTextTexture('RETAIL 360', 100);
    const titleGeom = new THREE.PlaneGeometry(3, 0.4);
    const titleMat = new THREE.MeshBasicMaterial({ map: titleTex, transparent: true });
    const titleMesh = new THREE.Mesh(titleGeom, titleMat);
    titleMesh.position.y = 2.2;
    group.add(titleMesh);

    // Subtítulo
    const subTex = this.createTextTexture('Login Experience', 60, '#aaaaaa');
    const subGeom = new THREE.PlaneGeometry(2, 0.2);
    const subMat = new THREE.MeshBasicMaterial({ map: subTex, transparent: true });
    const subMesh = new THREE.Mesh(subGeom, subMat);
    subMesh.position.y = 1.8;
    group.add(subMesh);

    // Campo de Usuario
    const userField = this.createInputField('Usuario', 0.5);
    group.add(userField);

    // Campo de Password
    const passField = this.createInputField('Password', -0.8);
    group.add(passField);

    // Botón de Entrar - Diseño más limpio
    const btnTex = this.createTextTexture('INICIAR SESIÓN', 100, '#ffffff');
    const btnGeom = new THREE.PlaneGeometry(3, 0.6);
    const btnMat = new THREE.MeshStandardMaterial({ 
      color: 0x00d4ff,
      map: btnTex,
      transparent: true,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.3
    });
    const btnMesh = new THREE.Mesh(btnGeom, btnMat);
    btnMesh.position.y = -2.2;
    btnMesh.name = 'loginButton';
    group.add(btnMesh);

    return group;
  }

  private createInputField(label: string, yPos: number): THREE.Group {
    const fieldGroup = new THREE.Group();

    // Etiqueta - Alineada arriba a la izquierda
    const labelTex = this.createTextTexture(label, 70, '#00d4ff');
    const labelGeom = new THREE.PlaneGeometry(1.2, 0.25);
    const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true });
    const labelMesh = new THREE.Mesh(labelGeom, labelMat);
    labelMesh.position.set(-1, yPos + 0.5, 0.01);
    fieldGroup.add(labelMesh);

    // Caja de input - Estilo minimalista
    const boxGeom = new THREE.PlaneGeometry(3.2, 0.5);
    // Borde inferior solamente
    const boxMat = new THREE.MeshBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.5 });
    const boxMesh = new THREE.Mesh(boxGeom, boxMat);
    boxMesh.position.y = yPos;
    fieldGroup.add(boxMesh);

    // Línea de base brillante
    const lineGeom = new THREE.PlaneGeometry(3.2, 0.02);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff });
    const line = new THREE.Mesh(lineGeom, lineMat);
    line.position.y = yPos - 0.25;
    fieldGroup.add(line);

    return fieldGroup;
  }

  private createTextTexture(text: string, size: number, color: string = '#ffffff', bgColor: string = 'transparent'): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 1024;
    canvas.height = 256;

    if (bgColor !== 'transparent') {
      context.fillStyle = bgColor;
      context.roundRect ? context.roundRect(0, 0, canvas.width, canvas.height, 20) : context.fillRect(0, 0, canvas.width, canvas.height);
      context.fill();
    }

    context.font = `italic 700 ${size}px 'Inter', system-ui, -apple-system, sans-serif`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    return texture;
  }

  public onLoginSuccess() {
    console.log('Login success animation triggered');
  }
}

// este componente es el que se encarga de manejar el login
// tiene dos botones para iniciar sesion como usuario o como administrador

