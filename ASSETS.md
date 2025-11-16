# 🏙️ FBX Building Destroyer - Asset Download

## 📥 미래형 도시 건물 다운로드

이 게임의 3D 모델과 텍스처는 파일 크기가 커서 Git 저장소에 포함되어 있지 않습니다.

### 구글 드라이브에서 다운로드:

**링크**: https://drive.google.com/drive/folders/15Ai5PItkti4vtVuvRsYkFUNDhTHdh5s0?usp=sharing

### 자동 다운로드 방법:

```bash
# gdown 설치
pip install gdown

# 프로젝트 루트에서 실행
gdown --folder https://drive.google.com/drive/folders/15Ai5PItkti4vtVuvRsYkFUNDhTHdh5s0 -O assets/
```

### 수동 다운로드 방법:

1. 위 구글 드라이브 링크 접속
2. 모든 파일 다운로드:
   - `Futuristic_Cityscape_1115025127_texture.fbx` (129MB)
   - `Futuristic_Cityscape_1115025127_texture.png` (4.73MB)
   - `Futuristic_Cityscape_1115025127_texture_normal.png` (6.25MB)
   - `Futuristic_Cityscape_1115025127_texture_metallic.png` (1.60MB)
   - `Futuristic_Cityscape_1115025127_texture_roughness.png` (1.61MB)
3. `assets/Futuristic_Cityscape_1115025127_texture_fbx/` 폴더에 모든 파일 복사

### 포함된 파일:

- 📦 **FBX 모델**: 129MB
- 🎨 **Base Texture**: 4.73MB (기본 색상)
- 🎨 **Normal Map**: 6.25MB (입체감)
- 🎨 **Metallic Map**: 1.60MB (금속성)
- 🎨 **Roughness Map**: 1.61MB (거칠기)

**총 파일 크기**: ~143MB

---

다운로드 후 `npm run serve`로 게임을 실행하세요!
