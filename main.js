import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

// 게임 상태 관리
class Game {
    constructor() {
        this.score = 0;
        this.building = null;
        this.debris = [];
        this.isLoaded = false;

        this.init();
    }

    init() {
        // Scene 설정
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // 하늘색 배경
        this.scene.fog = new THREE.Fog(0x87ceeb, 50, 200);

        // Camera 설정
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(30, 30, 30);
        this.camera.lookAt(0, 0, 0);

        // Renderer 설정
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('gameCanvas'),
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Controls 설정
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 100;
        this.controls.minDistance = 10;

        // 조명 설정
        this.setupLights();

        // 지면 설정
        this.setupGround();

        // FBX 로더 설정
        this.setupFBXLoader();

        // 이벤트 리스너
        this.setupEventListeners();

        // 애니메이션 시작
        this.animate();
    }

    setupLights() {
        // 태양광 (Directional Light)
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
        sunLight.position.set(50, 50, 50);
        sunLight.castShadow = true;
        sunLight.shadow.camera.left = -50;
        sunLight.shadow.camera.right = 50;
        sunLight.shadow.camera.top = 50;
        sunLight.shadow.camera.bottom = -50;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);

        // 환경광 (Ambient Light)
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        this.scene.add(ambientLight);

        // 반사광 (Hemisphere Light)
        const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x8b7355, 0.5);
        this.scene.add(hemiLight);
    }

    setupGround() {
        // 지면 생성
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // 그리드 헬퍼
        const gridHelper = new THREE.GridHelper(200, 50, 0x000000, 0x555555);
        this.scene.add(gridHelper);
    }

    setupFBXLoader() {
        const loader = new FBXLoader();
        const textureLoader = new THREE.TextureLoader();
        const loadingElement = document.getElementById('loading');
        const statusElement = document.getElementById('status');

        // 실제 FBX 파일 경로 (미래형 도시 건물)
        const fbxPath = 'assets/Futuristic_Cityscape_1115025127_texture_fbx/Futuristic_Cityscape_1115025127_texture.fbx';
        const texturePath = 'assets/Futuristic_Cityscape_1115025127_texture_fbx/Futuristic_Cityscape_1115025127_texture.png';
        const normalPath = 'assets/Futuristic_Cityscape_1115025127_texture_fbx/Futuristic_Cityscape_1115025127_texture_normal.png';
        const metallicPath = 'assets/Futuristic_Cityscape_1115025127_texture_fbx/Futuristic_Cityscape_1115025127_texture_metallic.png';
        const roughnessPath = 'assets/Futuristic_Cityscape_1115025127_texture_fbx/Futuristic_Cityscape_1115025127_texture_roughness.png';

        // 텍스처들을 미리 로드
        const baseTexture = textureLoader.load(texturePath);
        const normalTexture = textureLoader.load(normalPath);
        const metallicTexture = textureLoader.load(metallicPath);
        const roughnessTexture = textureLoader.load(roughnessPath);

        // FBX 파일 로드
        loader.load(
            fbxPath,
            (object) => {
                // FBX 로드 성공
                console.log('🏙️ 미래형 도시 건물 로드 성공!', object);

                // FBX 모델 설정
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;

                        // 고급 재질 적용 (PBR - Physically Based Rendering)
                        child.material = new THREE.MeshStandardMaterial({
                            map: baseTexture,              // 기본 색상 텍스처
                            normalMap: normalTexture,       // 노말 맵 (입체감)
                            metalnessMap: metallicTexture,  // 메탈릭 맵
                            roughnessMap: roughnessTexture, // 거칠기 맵
                            metalness: 0.5,                 // 금속성
                            roughness: 0.7,                 // 거칠기
                        });
                    }
                });

                // 크기 조정
                const box = new THREE.Box3().setFromObject(object);
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 30 / maxDim; // 미래형 도시는 좀 더 크게
                object.scale.multiplyScalar(scale);

                // 중심으로 이동
                const center = box.getCenter(new THREE.Vector3());
                object.position.sub(center.multiplyScalar(scale));
                object.position.y = size.y * scale / 2; // 지면 위에 배치

                this.building = object;
                this.originalFBXModel = object.clone(); // 리셋용 백업
                this.scene.add(object);

                loadingElement.classList.add('hidden');
                statusElement.textContent = '미래형 도시 건물 로드 완료! 🏙️';
                this.isLoaded = true;

                console.log('모델 크기:', size);
                console.log('스케일:', scale);
            },
            (xhr) => {
                // 로딩 진행률
                if (xhr.lengthComputable) {
                    const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
                    statusElement.textContent = `로딩 중... ${percent}%`;
                } else {
                    const loadedMB = (xhr.loaded / 1024 / 1024).toFixed(1);
                    statusElement.textContent = `로딩 중... ${loadedMB}MB`;
                }
            },
            (error) => {
                // 로드 실패 (샘플 건물 사용)
                console.error('FBX 로드 실패:', error);
                this.createSampleBuilding();
                loadingElement.classList.add('hidden');
                statusElement.textContent = '샘플 건물 사용 중 (FBX 로드 실패)';
                this.isLoaded = true;
            }
        );
    }

    createSampleBuilding() {
        // 샘플 건물 생성 (FBX가 없을 때 사용)
        const buildingGroup = new THREE.Group();

        // 건물 재질
        const materials = [
            new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.8 }), // 갈색
            new THREE.MeshStandardMaterial({ color: 0x696969, roughness: 0.7 }), // 회색
            new THREE.MeshStandardMaterial({ color: 0xdaa520, roughness: 0.6 }), // 금색
        ];

        // 층별 건물 생성
        for (let i = 0; i < 5; i++) {
            const width = 8 - i * 0.5;
            const height = 3;
            const depth = 8 - i * 0.5;

            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = materials[i % materials.length];
            const floor = new THREE.Mesh(geometry, material);

            floor.position.y = i * height + height / 2;
            floor.castShadow = true;
            floor.receiveShadow = true;

            buildingGroup.add(floor);

            // 창문 추가
            this.addWindows(floor, width, height, depth);
        }

        // 지붕 추가
        const roofGeometry = new THREE.ConeGeometry(5, 3, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b0000,
            roughness: 0.9
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 16;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        buildingGroup.add(roof);

        this.building = buildingGroup;
        this.scene.add(buildingGroup);
    }

    addWindows(floor, width, height, depth) {
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0x87ceeb,
            emissive: 0x4682b4,
            emissiveIntensity: 0.3,
            roughness: 0.1,
            metalness: 0.9
        });

        const windowSize = 0.8;
        const windowGeo = new THREE.BoxGeometry(windowSize, windowSize, 0.1);

        // 4면에 창문 추가
        for (let x = -width / 2 + 1; x < width / 2; x += 2) {
            // 앞면
            const windowFront = new THREE.Mesh(windowGeo, windowMaterial);
            windowFront.position.set(x, 0, depth / 2 + 0.05);
            floor.add(windowFront);

            // 뒷면
            const windowBack = new THREE.Mesh(windowGeo, windowMaterial);
            windowBack.position.set(x, 0, -depth / 2 - 0.05);
            floor.add(windowBack);
        }

        for (let z = -depth / 2 + 1; z < depth / 2; z += 2) {
            // 왼쪽
            const windowLeft = new THREE.Mesh(windowGeo, windowMaterial);
            windowLeft.position.set(-width / 2 - 0.05, 0, z);
            floor.add(windowLeft);

            // 오른쪽
            const windowRight = new THREE.Mesh(windowGeo, windowMaterial);
            windowRight.position.set(width / 2 + 0.05, 0, z);
            floor.add(windowRight);
        }
    }

    setupEventListeners() {
        // 윈도우 리사이즈
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // 클릭 이벤트 (건물 파괴)
        this.renderer.domElement.addEventListener('click', (event) => {
            this.onBuildingClick(event);
        });

        // 스페이스바 (리셋)
        window.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                this.resetGame();
            }
        });
    }

    onBuildingClick(event) {
        if (!this.isLoaded || !this.building) return;

        // Raycaster로 클릭 위치 감지
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObject(this.building, true);

        if (intersects.length > 0) {
            const hitPoint = intersects[0].point;
            this.createExplosion(hitPoint);
            this.destroyBuilding(intersects[0].object);
            this.score += 10;
            document.getElementById('score').textContent = this.score;
        }
    }

    createExplosion(position) {
        // 파티클 폭발 효과
        const particleCount = 30;
        const particles = new THREE.Group();

        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.2, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0xff6600 : 0xffaa00
            });
            const particle = new THREE.Mesh(geometry, material);

            particle.position.copy(position);

            // 랜덤 방향으로 날아가기
            particle.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                Math.random() * 3,
                (Math.random() - 0.5) * 2
            );

            particles.add(particle);
            this.debris.push(particle);
        }

        this.scene.add(particles);

        // 5초 후 제거
        setTimeout(() => {
            this.scene.remove(particles);
            this.debris = this.debris.filter(p => !particles.children.includes(p));
        }, 5000);
    }

    destroyBuilding(mesh) {
        if (!mesh.geometry) return;

        // 메쉬를 작은 조각으로 분해
        const fragments = this.fragmentMesh(mesh);
        fragments.forEach(fragment => {
            this.scene.add(fragment);
            this.debris.push(fragment);
        });

        // 원본 메쉬 숨기기
        mesh.visible = false;

        // 일정 시간 후 조각 제거
        setTimeout(() => {
            fragments.forEach(fragment => {
                this.scene.remove(fragment);
                this.debris = this.debris.filter(d => d !== fragment);
            });
        }, 5000);
    }

    fragmentMesh(mesh) {
        const fragments = [];
        const position = new THREE.Vector3();
        mesh.getWorldPosition(position);

        // 작은 조각 생성
        for (let i = 0; i < 10; i++) {
            const size = Math.random() * 0.5 + 0.2;
            const geometry = new THREE.BoxGeometry(size, size, size);
            const material = mesh.material.clone();
            const fragment = new THREE.Mesh(geometry, material);

            fragment.position.copy(position);
            fragment.position.x += (Math.random() - 0.5) * 2;
            fragment.position.y += (Math.random() - 0.5) * 2;
            fragment.position.z += (Math.random() - 0.5) * 2;

            fragment.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                Math.random() * 5 + 2,
                (Math.random() - 0.5) * 5
            );

            fragment.userData.angularVelocity = new THREE.Vector3(
                Math.random() * 0.2,
                Math.random() * 0.2,
                Math.random() * 0.2
            );

            fragment.castShadow = true;
            fragments.push(fragment);
        }

        return fragments;
    }

    resetGame() {
        // 게임 리셋
        this.score = 0;
        document.getElementById('score').textContent = this.score;

        // 파편 제거
        this.debris.forEach(debris => {
            this.scene.remove(debris);
        });
        this.debris = [];

        // 건물 제거 후 재생성
        if (this.building) {
            this.scene.remove(this.building);
        }

        // FBX 모델이 있으면 다시 로드, 없으면 샘플 건물 생성
        if (this.originalFBXModel) {
            this.building = this.originalFBXModel.clone();
            this.scene.add(this.building);
            document.getElementById('status').textContent = '게임 리셋! 🏙️';
        } else {
            this.createSampleBuilding();
            document.getElementById('status').textContent = '게임 리셋!';
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Controls 업데이트
        this.controls.update();

        // 파편 물리 업데이트
        this.debris.forEach(debris => {
            if (debris.userData.velocity) {
                debris.position.add(debris.userData.velocity.clone().multiplyScalar(0.016));
                debris.userData.velocity.y -= 9.8 * 0.016; // 중력

                // 회전
                if (debris.userData.angularVelocity) {
                    debris.rotation.x += debris.userData.angularVelocity.x;
                    debris.rotation.y += debris.userData.angularVelocity.y;
                    debris.rotation.z += debris.userData.angularVelocity.z;
                }

                // 지면 충돌
                if (debris.position.y < 0) {
                    debris.position.y = 0;
                    debris.userData.velocity.y *= -0.5; // 반발
                    debris.userData.velocity.multiplyScalar(0.8); // 마찰
                }
            }
        });

        // 렌더링
        this.renderer.render(this.scene, this.camera);
    }
}

// 게임 시작
const game = new Game();

// 디버깅용
window.game = game;
