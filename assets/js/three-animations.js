/* =========================================================
   ZAVYX INFOTECH — Three.js Process Animations
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  // If Three.js is not loaded, exit silently
  if (typeof THREE === 'undefined') return;

  const canvases = document.querySelectorAll('.process-canvas');
  if (!canvases.length) return;

  canvases.forEach(function (canvas) {
    const stepId = canvas.id.replace('canvas-', '');
    const parentCard = canvas.closest('.process-step');
    if (!parentCard) return;

    // 1. Setup Scene, Camera and Renderer
    const scene = new THREE.Scene();
    
    // Smooth camera perspective
    const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.shadowMap.enabled = true;

    // 2. Setup Lighting for Luxury Metallic Look
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(5, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x23B6F3, 0.45); // Subtle Blue Accent Light
    dirLight2.position.set(-6, -4, 2);
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0xD70E69, 0.35); // Subtle Neon Pink Accent Light
    dirLight3.position.set(0, 6, -3);
    scene.add(dirLight3);

    // 3. Create the 3D Object Group
    const objectGroup = create3DObject(stepId, scene);

    // 4. Mouse Tracking and Interaction Variables
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    let targetScale = 1.0;
    let currentScale = 1.0;
    let isHovered = false;

    // Event Listeners for Hover and Mouse Motion Tilt Action
    parentCard.addEventListener('mouseenter', function () {
      isHovered = true;
      targetScale = 1.15;
    });

    parentCard.addEventListener('mousemove', function (e) {
      if (!isHovered) return;
      const rect = parentCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0 to 1
      const y = (e.clientY - rect.top) / rect.height; // 0 to 1
      
      // Calculate tilt angles based on cursor position (-25 to 25 degrees)
      targetRotationY = (x - 0.5) * 0.9;
      targetRotationX = (y - 0.5) * 0.9;
    });

    parentCard.addEventListener('mouseleave', function () {
      isHovered = false;
      targetScale = 1.0;
      targetRotationX = 0;
      targetRotationY = 0;
    });

    // 5. Animation Render Loop with IntersectionObserver & Reduced Motion Optimization
    let isVisible = true;
    let animFrameId = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animate() {
      if (!isVisible) return;
      animFrameId = requestAnimationFrame(animate);

      // Smooth interpolation for rotations and scales
      currentRotationX += (targetRotationX - currentRotationX) * 0.1;
      currentRotationY += (targetRotationY - currentRotationY) * 0.1;
      currentScale += (targetScale - currentScale) * 0.1;

      if (objectGroup) {
        objectGroup.rotation.x = currentRotationX;
        if (!prefersReducedMotion) {
          if (isHovered) {
            objectGroup.rotation.y = currentRotationY + (Date.now() * 0.001);
          } else {
            objectGroup.rotation.y = currentRotationY + (Date.now() * 0.0003);
          }
        }
        objectGroup.scale.set(currentScale, currentScale, currentScale);
      }

      renderer.render(scene, camera);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            if (!animFrameId) animate();
          } else {
            if (animFrameId) {
              cancelAnimationFrame(animFrameId);
              animFrameId = null;
            }
          }
        });
      }, { threshold: 0.05 });
      observer.observe(parentCard);
    } else {
      animate();
    }

    // 6. Handle Resizing
    window.addEventListener('resize', function () {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    });
  });

  // Helper inside the closure to build the procedural geometries
  function create3DObject(stepId, scene) {
    const group = new THREE.Group();

    // Material system
    const blueMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x23B6F3,
      metalness: 0.1,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    
    const pinkMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xD70E69,
      metalness: 0.1,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    const whiteMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFDFDFD,
      metalness: 0.1,
      roughness: 0.4,
      clearcoat: 0.4
    });

    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xDDDEE3,
      metalness: 0.95,
      roughness: 0.1,
      clearcoat: 1.0
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.95,
      ior: 1.5
    });

    if (stepId === 'discover') {
      // Magnifying glass: ring + handle + lens
      const ringGeo = new THREE.TorusGeometry(0.9, 0.09, 16, 100);
      const ring = new THREE.Mesh(ringGeo, chromeMaterial);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      const handleGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.0, 16);
      const handle = new THREE.Mesh(handleGeo, chromeMaterial);
      handle.position.set(0.7, -1.1, 0);
      handle.rotation.z = -Math.PI / 4;
      group.add(handle);

      const lensGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.04, 32);
      const lens = new THREE.Mesh(lensGeo, glassMaterial);
      lens.rotation.x = Math.PI / 2;
      group.add(lens);

      // Minor blocks inside magnifying glass view
      for (let i = 0; i < 3; i++) {
        const block = new THREE.Mesh(
          new THREE.BoxGeometry(0.24, 0.24, 0.24),
          i === 0 ? blueMaterial : i === 1 ? pinkMaterial : chromeMaterial
        );
        block.position.set((i - 1) * 0.3, i * 0.1 - 0.1, 0.15);
        block.rotation.set(0.2 * i, 0.5 * i, 0.1);
        group.add(block);
      }
    } 
    else if (stepId === 'design') {
      // Notepad Open Book
      const bookGroup = new THREE.Group();
      
      // Page back cover
      const cover = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.3, 0.06), blueMaterial);
      cover.rotation.x = 0.1;
      bookGroup.add(cover);

      // Left page leaf
      const pLeft = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.2, 0.03), whiteMaterial);
      pLeft.position.set(-0.43, 0, 0.04);
      pLeft.rotation.y = 0.08;
      bookGroup.add(pLeft);

      // Right page leaf
      const pRight = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.2, 0.03), whiteMaterial);
      pRight.position.set(0.43, 0, 0.04);
      pRight.rotation.y = -0.08;
      bookGroup.add(pRight);

      // Pencil laying resting
      const pencil = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 12), chromeMaterial);
      pencil.position.set(0.8, -0.2, 0.15);
      pencil.rotation.z = -0.5;
      pencil.rotation.x = 0.15;
      bookGroup.add(pencil);

      group.add(bookGroup);
    }
    else if (stepId === 'develop') {
      // Brackets < / >
      const brackets = new THREE.Group();

      // Left bracket <
      const leftB = new THREE.Group();
      const s1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 0.08), chromeMaterial);
      s1.position.set(-0.25, 0.22, 0);
      s1.rotation.z = -Math.PI / 4;
      leftB.add(s1);

      const s2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 0.08), chromeMaterial);
      s2.position.set(-0.25, -0.22, 0);
      s2.rotation.z = Math.PI / 4;
      leftB.add(s2);

      leftB.position.x = -0.3;
      brackets.add(leftB);

      // Right bracket >
      const rightB = new THREE.Group();
      const s3 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 0.08), chromeMaterial);
      s3.position.set(0.25, 0.22, 0);
      s3.rotation.z = Math.PI / 4;
      rightB.add(s3);

      const s4 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 0.08), chromeMaterial);
      s4.position.set(0.25, -0.22, 0);
      s4.rotation.z = -Math.PI / 4;
      rightB.add(s4);

      rightB.position.x = 0.3;
      brackets.add(rightB);

      // Center dash /
      const slash = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.1, 0.07), pinkMaterial);
      slash.rotation.z = 0.3;
      brackets.add(slash);

      group.add(brackets);
    }
    else if (stepId === 'deploy') {
      // Cloud and rocket overlay
      const deployGp = new THREE.Group();

      // Cloud spheres mesh
      const baseMesh = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 24), whiteMaterial);
      baseMesh.position.set(0, -0.2, 0);
      deployGp.add(baseMesh);

      const leftSph = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 24), whiteMaterial);
      leftSph.position.set(-0.45, -0.25, 0.1);
      deployGp.add(leftSph);

      const rightSph = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 24), whiteMaterial);
      rightSph.position.set(0.45, -0.25, 0.1);
      deployGp.add(rightSph);

      // Tiny ascending rocket
      const rocket = new THREE.Group();
      const rBody = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 12), chromeMaterial);
      rocket.add(rBody);

      const rNose = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.25, 12), pinkMaterial);
      rNose.position.y = 0.375;
      rocket.add(rNose);

      const rFin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.15, 0.25), blueMaterial);
      rFin.position.y = -0.15;
      rocket.add(rFin);

      rocket.position.set(0, 0.25, 0.15);
      rocket.rotation.z = -0.15;
      deployGp.add(rocket);

      group.add(deployGp);
    }
    else if (stepId === 'support') {
      // Gear & Infinity Loop
      const gearGp = new THREE.Group();

      // Core gear base
      const gearCore = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.15, 24), chromeMaterial);
      gearCore.rotation.x = Math.PI / 2;
      gearGp.add(gearCore);

      // Teeth
      const toothGeo = new THREE.BoxGeometry(0.15, 0.15, 0.17);
      for (let i = 0; i < 8; i++) {
        const rad = (i / 8) * Math.PI * 2;
        const tooth = new THREE.Mesh(toothGeo, chromeMaterial);
        tooth.position.set(Math.cos(rad) * 0.7, Math.sin(rad) * 0.7, 0);
        tooth.rotation.z = rad;
        gearGp.add(tooth);
      }

      // 3D Infinity hoop loop curve
      const infGroup = new THREE.Group();
      const loopScale = 0.44;
      const points = [];
      for (let t = -Math.PI; t <= Math.PI; t += 0.06) {
        const denom = 1 + Math.sin(t) * Math.sin(t);
        const x = (Math.cos(t) / denom) * 1.2 * loopScale;
        const y = ((Math.sin(t) * Math.cos(t)) / denom) * 1.4 * loopScale;
        points.push(new THREE.Vector3(x, y, 0.15));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.05, 8, true);
      const loopMesh = new THREE.Mesh(tubeGeo, blueMaterial);
      infGroup.add(loopMesh);
      
      gearGp.add(infGroup);
      group.add(gearGp);
    }

    scene.add(group);
    return group;
  }
});
