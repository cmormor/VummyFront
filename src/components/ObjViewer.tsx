import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ObjViewerProps {
  size: number | string;
  filename: string;
  className?: string;
  minDistance?: number;
  maxDistance?: number;
  enableZoom?: boolean;
  enableRotate?: boolean;
  enablePan?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

class OrbitControls {
  camera: THREE.PerspectiveCamera;
  domElement: HTMLElement;
  target: THREE.Vector3;
  enableDamping: boolean;
  dampingFactor: number;
  minDistance: number;
  maxDistance: number;
  enableZoom: boolean;
  enableRotate: boolean;
  enablePan: boolean;
  autoRotate: boolean;
  autoRotateSpeed: number;

  private spherical: THREE.Spherical;
  private sphericalDelta: THREE.Spherical;
  private scale: number;
  private rotateStart: THREE.Vector2;
  private rotateEnd: THREE.Vector2;
  private rotateDelta: THREE.Vector2;
  private state: string;
  private mouseButtons: { LEFT: number; MIDDLE: number; RIGHT: number };

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.target = new THREE.Vector3();

    this.enableDamping = true;
    this.dampingFactor = 0.15;
    this.minDistance = 1;
    this.maxDistance = 100;
    this.enableZoom = true;
    this.enableRotate = true;
    this.enablePan = true;
    this.autoRotate = false;
    this.autoRotateSpeed = 2.0;

    this.spherical = new THREE.Spherical();
    this.sphericalDelta = new THREE.Spherical();
    this.scale = 1;

    this.rotateStart = new THREE.Vector2();
    this.rotateEnd = new THREE.Vector2();
    this.rotateDelta = new THREE.Vector2();

    this.state = "NONE";
    this.mouseButtons = { LEFT: 0, MIDDLE: 1, RIGHT: 2 };

    this.setupEventListeners();
    this.update();
  }

  private setupEventListeners(): void {
    this.domElement.addEventListener(
      "contextmenu",
      this.onContextMenu.bind(this)
    );
    this.domElement.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.domElement.addEventListener("wheel", this.onMouseWheel.bind(this));
  }

  private onContextMenu(event: Event): void {
    event.preventDefault();
  }

  private onMouseDown(event: MouseEvent): void {
    event.preventDefault();

    switch (event.button) {
      case this.mouseButtons.LEFT: {
        if (this.enableRotate) {
          this.handleMouseDownRotate(event);
          this.state = "ROTATE";
        }
        break;
      }
      case this.mouseButtons.RIGHT: {
        if (this.enablePan) {
          this.state = "PAN";
        }
        break;
      }
    }

    if (this.state !== "NONE") {
      document.addEventListener("mousemove", this.onMouseMove.bind(this));
      document.addEventListener("mouseup", this.onMouseUp.bind(this));
    }
  }

  private onMouseMove(event: MouseEvent): void {
    event.preventDefault();

    if (this.state === "ROTATE" && this.enableRotate) {
      this.handleMouseMoveRotate(event);
    }
  }

  private onMouseUp(): void {
    document.removeEventListener("mousemove", this.onMouseMove.bind(this));
    document.removeEventListener("mouseup", this.onMouseUp.bind(this));
    this.state = "NONE";
  }

  private onMouseWheel(event: WheelEvent): void {
    if (!this.enableZoom) return;
    event.preventDefault();

    const zoomSpeed = 0.98;
    if (event.deltaY < 0) {
      this.scale /= zoomSpeed;
    } else {
      this.scale *= zoomSpeed;
    }

    this.update();
  }

  private handleMouseDownRotate(event: MouseEvent): void {
    this.rotateStart.set(event.clientX, event.clientY);
  }

  private handleMouseMoveRotate(event: MouseEvent): void {
    this.rotateEnd.set(event.clientX, event.clientY);
    this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);

    const element = this.domElement;
    this.sphericalDelta.theta -=
      ((2 * Math.PI * this.rotateDelta.x) / element.clientHeight) * 0.3;
    this.sphericalDelta.phi -=
      ((2 * Math.PI * this.rotateDelta.y) / element.clientHeight) * 0.3;

    this.rotateStart.copy(this.rotateEnd);
    this.update();
  }

  update(): boolean {
    const offset = new THREE.Vector3();

    offset.copy(this.camera.position).sub(this.target);

    this.spherical.setFromVector3(offset);

    if (this.autoRotate && this.state === "NONE") {
      this.sphericalDelta.theta -=
        ((2 * Math.PI) / 60 / 60) * this.autoRotateSpeed;
    }

    this.spherical.theta += this.sphericalDelta.theta;
    this.spherical.phi += this.sphericalDelta.phi;

    this.spherical.phi = Math.max(
      0.000001,
      Math.min(Math.PI - 0.000001, this.spherical.phi)
    );
    this.spherical.radius *= this.scale;
    this.spherical.radius = Math.max(
      this.minDistance,
      Math.min(this.maxDistance, this.spherical.radius)
    );

    offset.setFromSpherical(this.spherical);

    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);

    if (this.enableDamping) {
      this.sphericalDelta.theta *= 1 - this.dampingFactor;
      this.sphericalDelta.phi *= 1 - this.dampingFactor;
    } else {
      this.sphericalDelta.set(0, 0, 0);
    }

    this.scale = 1;

    return true;
  }

  dispose(): void {
    this.domElement.removeEventListener("contextmenu", this.onContextMenu);
    this.domElement.removeEventListener("mousedown", this.onMouseDown);
    this.domElement.removeEventListener("wheel", this.onMouseWheel);
  }
}

class OBJLoader {
  parse(text: string): THREE.Group {
    const lines = text.split("\n");
    const vertices: number[] = [];
    const normals: number[] = [];
    const faces: Array<Array<{ vertex: number; normal: number | null }>> = [];

    for (let line of lines) {
      line = line.trim();
      if (line.length === 0 || line.charAt(0) === "#") continue;

      const parts = line.split(/\s+/);
      const type = parts[0];

      switch (type) {
        case "v": {
          vertices.push(
            parseFloat(parts[1]),
            parseFloat(parts[2]),
            parseFloat(parts[3])
          );
          break;
        }

        case "vn": {
          normals.push(
            parseFloat(parts[1]),
            parseFloat(parts[2]),
            parseFloat(parts[3])
          );
          break;
        }

        case "f": {
          const face: Array<{ vertex: number; normal: number | null }> = [];
          for (let i = 1; i < parts.length; i++) {
            const indices = parts[i].split("/");
            face.push({
              vertex: parseInt(indices[0]) - 1,
              normal: indices[2] ? parseInt(indices[2]) - 1 : null,
            });
          }
          faces.push(face);
          break;
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const normalsArray: number[] = [];

    for (const face of faces) {
      if (face.length === 3) {
        for (const vertex of face) {
          const vIndex = vertex.vertex * 3;
          positions.push(
            vertices[vIndex],
            vertices[vIndex + 1],
            vertices[vIndex + 2]
          );

          if (vertex.normal !== null && normals.length > 0) {
            const nIndex = vertex.normal * 3;
            normalsArray.push(
              normals[nIndex],
              normals[nIndex + 1],
              normals[nIndex + 2]
            );
          }
        }
      } else if (face.length === 4) {
        const indices = [0, 1, 2, 0, 2, 3];
        for (const i of indices) {
          const vertex = face[i];
          const vIndex = vertex.vertex * 3;
          positions.push(
            vertices[vIndex],
            vertices[vIndex + 1],
            vertices[vIndex + 2]
          );

          if (vertex.normal !== null && normals.length > 0) {
            const nIndex = vertex.normal * 3;
            normalsArray.push(
              normals[nIndex],
              normals[nIndex + 1],
              normals[nIndex + 2]
            );
          }
        }
      }
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    if (normalsArray.length > 0) {
      geometry.setAttribute(
        "normal",
        new THREE.Float32BufferAttribute(normalsArray, 3)
      );
    } else {
      geometry.computeVertexNormals();
    }

    const material = new THREE.MeshLambertMaterial({
      color: 0xcccccc,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const group = new THREE.Group();
    group.add(mesh);

    return group;
  }
}

export default function ObjViewer(props: ObjViewerProps) {
  const box = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(props.filename);
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }
        const text = await response.text();
        setFile(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        console.error("Error cargando archivo OBJ:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [props.filename]);

  useEffect(() => {
    if (!box.current || !file) return;

    const div = box.current;
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }

    const width = div.clientWidth;
    const height = div.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    div.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0x404040, 1.2);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight3.position.set(0, -5, 0);
    scene.add(directionalLight3);

    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
    scene.add(hemisphereLight);

    try {
      const loader = new OBJLoader();
      const obj = loader.parse(file);

      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });

      scene.add(obj);

      const bounding = new THREE.Box3().setFromObject(obj);
      const center = bounding.getCenter(new THREE.Vector3());
      const size = bounding.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      obj.position.sub(center);

      const distance = maxDim * 0.8;

      camera.position.set(0, 0, distance);
      camera.up.set(0, 1, 0);
      camera.lookAt(0, 0, 0);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = props.enableZoom ?? true;
      controls.minDistance = props.minDistance ?? maxDim * 0.5;
      controls.maxDistance = props.maxDistance ?? maxDim * 5;
      controls.enableRotate = props.enableRotate ?? true;
      controls.enablePan = props.enablePan ?? true;
      controls.autoRotate = props.autoRotate ?? true;
      controls.autoRotateSpeed = props.autoRotateSpeed ?? 1.0;

      controls.target.set(0, 0, 0);

      controls.update();

      const handleResize = () => {
        const newWidth = div.clientWidth;
        const newHeight = div.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener("resize", handleResize);

      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(div);

      let animationId: number;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        window.removeEventListener("resize", handleResize);
        resizeObserver.disconnect();
        controls.dispose();
        renderer.dispose();
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        if (div.contains(renderer.domElement)) {
          div.removeChild(renderer.domElement);
        }
      };
    } catch (err) {
      console.error("Error parseando archivo OBJ:", err);
      setError("Error al parsear el archivo OBJ");
      return;
    }
  }, [file, props]);

  if (loading) {
    return (
      <div
        className={props.className}
        style={{
          width: props.size,
          height: props.size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <p style={{ color: "#666", fontSize: "14px" }}>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={props.className}
        style={{
          width: props.size,
          height: props.size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff5f5",
          border: "1px solid #fecaca",
          borderRadius: "8px",
        }}
      >
        <p style={{ color: "#dc2626", fontSize: "14px" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      ref={box}
      className={props.className}
      style={{
        width: props.size,
        height: props.size,
        border: "1px solid #1976d2",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    />
  );
}