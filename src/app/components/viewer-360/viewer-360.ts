import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { LoginPanel } from '../login-panel/login-panel';
import { UserPanel } from '../user-panel/user-panel';

@Component({
  selector: 'app-viewer-360',
  imports: [LoginPanel, UserPanel],
  templateUrl: './viewer-360.html',
  styleUrl: './viewer-360.scss',
})
export class Viewer360 implements AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;
  @ViewChild('loginPanelComponent') loginPanelComponent!: LoginPanel;
  @ViewChild('userPanelComponent') userPanelComponent!: UserPanel;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  // Navegación
  private isUserInteracting = false;
  private onPointerDownPointerX = 0;
  private onPointerDownPointerY = 0;
  private onPointerDownLon = 0;
  private onPointerDownLat = 0;
  private lon = 0;
  private lat = 0;
  private phi = 0;
  private theta = 0;

  ngAfterViewInit() {
    this.initThree();
    this.animate();
  }

  ngOnDestroy() {
    // Limpieza
  }

  private initThree() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
    );

    // Luces Premium
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Luz ambiental suave
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00d4ff, 2, 100);
    pointLight.position.set(2, 5, 2);
    this.scene.add(pointLight);

    const blueLight = new THREE.PointLight(0xffffff, 1, 50);
    blueLight.position.set(-5, -2, -5);
    this.scene.add(blueLight);

    // Fondo 360
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const loader = new THREE.TextureLoader();
    const texture = loader.load('background360.png'); // Cargado desde /public
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    // Añadir Panel de Login 3D
    const loginGroup = this.loginPanelComponent.createLoginGroup();
    loginGroup.position.set(0, 0, -5); 
    this.scene.add(loginGroup);

    // Añadir Icono de Usuario
    const userIcon = this.userPanelComponent.createUserIcon();
    userIcon.position.set(0, 3, -4.5);
    this.scene.add(userIcon);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Interacción
    const container = this.rendererContainer.nativeElement;
    container.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('resize', this.onWindowResize.bind(this));
    container.addEventListener('click', this.onMouseClick.bind(this));
  }

  private onMouseClick() {
    if (this.intersectedObject && this.intersectedObject.name === 'loginButton') {
      alert('¡Acceso concedido! Bienvenido al portal Retail 360.');
      // Simular transición/cambio de estado
      this.loginPanelComponent.onLoginSuccess();
    }
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onPointerDown(event: PointerEvent) {
    if (event.isPrimary === false) return;
    this.isUserInteracting = true;
    this.onPointerDownPointerX = event.clientX;
    this.onPointerDownPointerY = event.clientY;
    this.onPointerDownLon = this.lon;
    this.onPointerDownLat = this.lat;

    document.addEventListener('pointermove', this.onPointerMove.bind(this));
    document.addEventListener('pointerup', this.onPointerUp.bind(this));
  }

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private intersectedObject: THREE.Object3D | null = null;
  private originalScale = new THREE.Vector3(1, 1, 1);

  private update() {
    this.lat = Math.max(-85, Math.min(85, this.lat));
    this.phi = THREE.MathUtils.degToRad(90 - this.lat);
    this.theta = THREE.MathUtils.degToRad(this.lon);

    const x = Math.sin(this.phi) * Math.cos(this.theta);
    const y = Math.cos(this.phi);
    const z = Math.sin(this.phi) * Math.sin(this.theta);

    this.camera.lookAt(x, y, z);

    // Raycasting para hover
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const firstObject = intersects[0].object;
      if (this.intersectedObject !== firstObject) {
        if (this.intersectedObject) {
          this.intersectedObject.scale.copy(this.originalScale);
        }
        
        this.intersectedObject = firstObject;
        this.originalScale.copy(this.intersectedObject.scale);
        
        // Efecto Hover: Escalar
        if (this.intersectedObject.name === 'loginButton') {
           this.intersectedObject.scale.set(1.1, 1.1, 1.1);
        }
      }
    } else {
      if (this.intersectedObject) {
        this.intersectedObject.scale.copy(this.originalScale);
      }
      this.intersectedObject = null;
    }

    this.renderer.render(this.scene, this.camera);
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.update();
  }

  private onPointerUp() {
    this.isUserInteracting = false;
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }

  private onDocumentMouseWheel(event: WheelEvent) {
    const fov = this.camera.fov + event.deltaY * 0.05;
    this.camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
    this.camera.updateProjectionMatrix();
  }

  private onPointerMove(event: PointerEvent) {
    if (event.isPrimary === false) return;
    
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (this.isUserInteracting) {
      this.lon = (this.onPointerDownPointerX - event.clientX) * 0.1 + this.onPointerDownLon;
      this.lat = (event.clientY - this.onPointerDownPointerY) * 0.1 + this.onPointerDownLat;
    }
  }
}
