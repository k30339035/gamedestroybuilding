# 🏗️ FBX Building Destroyer Game

Three.js 기반의 3D 건물 파괴 게임입니다. FBX 파일을 업로드하여 나만의 건물을 파괴할 수 있습니다!

## 🏙️ 포함된 모델

이 게임에는 **미래형 도시 건물** 모델이 포함되어 있습니다:
- 📦 FBX 모델: 129MB (Futuristic_Cityscape)
- 🎨 고품질 텍스처 포함:
  - Base Texture (4.73MB) - 기본 색상
  - Normal Map (6.25MB) - 입체감
  - Metallic Map (1.60MB) - 금속성
  - Roughness Map (1.61MB) - 거칠기
- ✨ PBR (Physically Based Rendering) 재질 적용

## ✨ 주요 기능

- **FBX 모델 로드**: FBX 파일과 텍스처를 자동으로 로드
- **실시간 3D 렌더링**: Three.js를 사용한 부드러운 3D 그래픽
- **파괴 물리 시뮬레이션**: 클릭하면 건물이 조각나며 파괴됩니다
- **파티클 효과**: 폭발 이펙트와 파편 날리기
- **직관적인 조작**: 마우스로 회전, 줌, 클릭만으로 플레이

## 🎮 조작법

- **마우스 드래그**: 카메라 회전
- **마우스 휠**: 줌 인/아웃
- **클릭**: 건물 파괴
- **스페이스바**: 게임 리셋

## 🚀 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

또는 간단한 HTTP 서버 사용:

```bash
npm run serve
```

브라우저에서 `http://localhost:8000` 또는 `http://localhost:5173` (Vite 사용 시) 접속

## 📦 다른 FBX 파일 사용하기

게임에는 이미 미래형 도시 건물이 포함되어 있지만, 원하는 다른 건물 모델을 사용할 수 있습니다!

### 방법 1: 직접 추가

1. `assets/` 폴더에 새 폴더 생성 (예: `my_building/`)
2. FBX 파일과 텍스처들을 폴더에 복사
3. `main.js`의 112번째 줄에서 경로 수정:
   ```javascript
   const fbxPath = 'assets/my_building/my_building.fbx';
   ```

### 방법 2: 구글 드라이브에서 다운로드

```bash
# gdown 설치
pip install gdown

# 구글 드라이브 폴더 다운로드
gdown --folder [구글드라이브링크] -O assets/my_building/
```

### FBX 파일 구조 예시

```
assets/
├── building.fbx           # 3D 모델 파일
├── textures/              # 텍스처 폴더 (선택사항)
│   ├── diffuse.png       # 기본 색상 텍스처
│   ├── normal.png        # 노말 맵
│   └── roughness.png     # 거칠기 맵
└── materials/             # 머티리얼 파일 (선택사항)
```

## 🎨 FBX 모델과 재질

### 지원하는 파일 형식
- **3D 모델**: `.fbx`
- **텍스처**: `.png`, `.jpg`, `.jpeg`
- **머티리얼**: FBX에 포함된 재질 정보 자동 로드

### 재질 자동 적용
FBX 파일에 포함된 머티리얼은 자동으로 적용됩니다:
- Diffuse Color (기본 색상)
- Normal Map (노말 맵)
- Roughness (거칠기)
- Metalness (금속성)
- Transparency (투명도)

### 텍스처가 없을 경우
- 자동으로 기본 재질이 적용됩니다
- 샘플 건물이 표시됩니다

## 🛠️ 커스터마이징

### FBX 파일 경로 변경

`main.js` 파일의 166번 줄:

```javascript
const fbxPath = 'assets/building.fbx'; // 여기를 수정
```

### 건물 크기 조정

`main.js` 파일의 198번 줄:

```javascript
const scale = 20 / maxDim; // 숫자를 조정하여 크기 변경
```

### 배경색 변경

`main.js` 파일의 23번 줄:

```javascript
this.scene.background = new THREE.Color(0x87ceeb); // 색상 코드 변경
```

## 📁 프로젝트 구조

```
gamedestroybuilding/
├── index.html          # 메인 HTML 파일
├── style.css           # 스타일시트
├── main.js             # 게임 로직 (Three.js)
├── package.json        # 프로젝트 설정
├── assets/             # FBX 파일 및 텍스처
│   └── building.fbx
└── README.md           # 이 파일
```

## 🎯 게임 플레이

1. **게임 시작**: 페이지를 열면 건물이 로드됩니다
2. **건물 파괴**: 건물을 클릭하여 파괴
3. **점수 획득**: 파괴할 때마다 점수 증가
4. **게임 리셋**: 스페이스바를 눌러 처음부터 다시 시작

## 🔧 기술 스택

- **Three.js**: 3D 렌더링 엔진
- **FBXLoader**: FBX 파일 로더
- **OrbitControls**: 카메라 컨트롤
- **Vite**: 빌드 도구 (선택사항)

## 📝 문제 해결

### FBX 파일이 로드되지 않을 때

1. 파일 경로 확인: `assets/building.fbx`에 파일이 있는지 확인
2. 브라우저 콘솔 확인: F12 → Console 탭에서 에러 확인
3. CORS 문제: 로컬 서버 사용 (`npm run serve`)

### 텍스처가 표시되지 않을 때

1. 텍스처 파일이 FBX와 같은 폴더에 있는지 확인
2. FBX 파일이 텍스처 경로를 올바르게 참조하는지 확인
3. 3D 모델링 소프트웨어에서 텍스처를 임베드하여 내보내기

### 건물이 너무 크거나 작을 때

`main.js`의 198번 줄에서 scale 값 조정:

```javascript
const scale = 20 / maxDim; // 값을 늘리면 커지고, 줄이면 작아집니다
```

## 🚀 배포

### GitHub Pages로 배포

```bash
npm run build
# dist 폴더를 GitHub Pages에 배포
```

### Vercel/Netlify로 배포

1. GitHub에 푸시
2. Vercel/Netlify에서 import
3. 빌드 명령: `npm run build`
4. 출력 디렉토리: `dist`

## 📄 라이선스

MIT License

## 🤝 기여

이슈와 Pull Request를 환영합니다!

## 📧 문의

문제가 있거나 질문이 있으시면 Issue를 열어주세요.

---

**즐거운 건물 파괴 되세요! 💥🏢**
