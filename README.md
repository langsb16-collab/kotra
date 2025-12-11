# TechFinder - 원천기술 매칭 O2O 플랫폼

**휴대폰으로 촬영한 사진 기반으로 해당 기술·제품의 원천기술 보유 중소기업을 찾아 연결해주는 기초기술·제조원 매칭 플랫폼**

## 📋 프로젝트 개요

### 핵심 가치
- **사진만 올리면** 원천기술 보유 기업이 자동으로 찾아지고
- **기술 매각·OEM·협업**까지 바로 연결되는 플랫폼
- **7개 국어 지원**으로 글로벌 시장 확장 (한국어, 영어, 중국어, 일본어, 베트남어, 몽골어, 러시아어)

### 주요 기능
1. **이미지 기반 기술 검색** - AI 비전으로 사진 → 기술 및 제조기업 추천 자동화
2. **기술 매각 중개** - 기술 이전, 지분 매각, 공동 개발 매칭
3. **OEM/ODM 발주 시스템** - 실시간 견적 요청 및 발주
4. **기업 데이터베이스** - 원천기술 보유 중소기업 정보 관리
5. **다국어 지원** - 7개 국어로 글로벌 바이어와 연결

## 🌐 공개 URL

**현재 개발 서버**: https://3000-ifyu8j5u4pqnfy4tmli0w-ad490db5.sandbox.novita.ai

### 주요 페이지
- **메인 페이지**: https://3000-ifyu8j5u4pqnfy4tmli0w-ad490db5.sandbox.novita.ai/?lang=ko
- **기술 검색**: https://3000-ifyu8j5u4pqnfy4tmli0w-ad490db5.sandbox.novita.ai/search?lang=ko
- **기업 등록**: https://3000-ifyu8j5u4pqnfy4tmli0w-ad490db5.sandbox.novita.ai/company?lang=ko
- **기술 거래소**: https://3000-ifyu8j5u4pqnfy4tmli0w-ad490db5.sandbox.novita.ai/marketplace?lang=ko
- **관리자**: https://3000-ifyu8j5u4pqnfy4tmli0w-ad490db5.sandbox.novita.ai/admin?lang=ko

### API 엔드포인트
- `GET /api/health` - 헬스 체크
- `GET /api/companies` - 기업 목록 조회
- `GET /api/companies/:id` - 기업 상세 정보
- `POST /api/companies` - 기업 등록
- `GET /api/listings` - 기술 거래 목록
- `POST /api/search/image` - 이미지 기반 검색
- `POST /api/consultations` - 상담 요청
- `GET /api/categories` - 기술 분류 조회
- `GET /api/admin/analytics` - 분석 대시보드

## 🗄️ 데이터 아키텍처

### Cloudflare D1 Database (SQLite)

#### 주요 테이블
1. **companies** - 기업 정보 (다국어 지원)
2. **company_certifications** - 기업 인증 (ISO9001, KC, CE, UL 등)
3. **company_patents** - 특허 정보
4. **technology_categories** - 기술 분류 체계 (대·중·소 분류)
5. **company_technologies** - 기업 보유 기술
6. **technology_listings** - 기술 매각/거래 게시글
7. **image_search_logs** - 이미지 검색 로그
8. **match_results** - 매칭 결과
9. **consultation_requests** - 상담 요청
10. **user_analytics** - 사용자 행동 분석

### 샘플 데이터
- **5개 기업** 등록 (수처리, 태양광, 로봇, 금형, 센서)
- **6개 기술 카테고리** (수처리·환경, 에너지, 자동화·로봇, 금형·기계가공, 센서·계측, 반도체·전자부품)
- **8개 중분류** (담수화, 폐수처리, 태양광, ESS, 로봇팔, 협동로봇 등)
- **5개 기술 매각 게시글** (기술 매각, 공동 개발, OEM/ODM, 지분 매각)

## 🛠️ 기술 스택

### Backend
- **Framework**: Hono (v4.10.8) - 경량 고성능 웹 프레임워크
- **Runtime**: Cloudflare Workers (Edge Runtime)
- **Database**: Cloudflare D1 (SQLite-based globally distributed database)
- **Language**: TypeScript

### Frontend
- **UI Framework**: TailwindCSS (CDN)
- **Icons**: Font Awesome 6.4.0
- **JavaScript**: Vanilla JS (ES6+)

### DevOps
- **Build Tool**: Vite 6.3.5
- **Deployment**: Cloudflare Pages
- **Process Manager**: PM2 (sandbox 환경)
- **Version Control**: Git

### 다국어 지원
- **i18n System**: 커스텀 TypeScript 기반 다국어 시스템
- **지원 언어**: 한국어(ko), 영어(en), 중국어(zh), 일본어(ja), 베트남어(vi), 몽골어(mn), 러시아어(ru)

## 📂 프로젝트 구조

```
webapp/
├── src/
│   ├── index.tsx           # 메인 애플리케이션 (Hono 앱 + 라우트)
│   ├── types.ts            # TypeScript 타입 정의
│   └── lib/
│       └── i18n.ts         # 7개 국어 번역 시스템
├── public/
│   └── static/
│       └── app.js          # 프론트엔드 JavaScript
├── migrations/
│   ├── 0001_initial_schema.sql  # 데이터베이스 스키마
│   └── 0002_seed_data.sql       # 샘플 데이터
├── dist/                   # 빌드 결과물
├── .wrangler/             # Wrangler 로컬 개발 파일
│   └── state/v3/d1/       # 로컬 SQLite 데이터베이스
├── ecosystem.config.cjs    # PM2 설정
├── wrangler.jsonc          # Cloudflare 설정
├── vite.config.ts          # Vite 설정
├── package.json            # 의존성 및 스크립트
└── README.md              # 프로젝트 문서
```

## 🚀 로컬 개발

### 1. 의존성 설치
```bash
npm install
```

### 2. 데이터베이스 마이그레이션
```bash
npm run db:migrate:local
```

### 3. 빌드
```bash
npm run build
```

### 4. 개발 서버 시작
```bash
# PM2로 시작 (권장)
pm2 start ecosystem.config.cjs

# 또는 직접 실행
npm run dev:sandbox
```

### 5. 테스트
```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/companies?status=approved
```

## 📊 완료된 기능

### ✅ Backend API
- [x] 기업 CRUD (등록, 조회, 수정, 삭제)
- [x] 기술 카테고리 관리
- [x] 기술 매각 게시판
- [x] 이미지 기반 검색 API (AI 시뮬레이션)
- [x] 매칭 결과 저장
- [x] 상담 요청 시스템
- [x] 사용자 분석 (이벤트 트래킹)
- [x] 관리자 대시보드 API

### ✅ Frontend Pages
- [x] 메인 페이지 (히어로, 기능 소개, 통계)
- [x] 기술 검색 페이지 (이미지 업로드, 드래그 앤 드롭)
- [x] 기업 등록 페이지 (폼 제출)
- [x] 기술 거래소 페이지 (리스팅 조회, 필터)
- [x] 관리자 페이지 (통계 대시보드)

### ✅ 다국어 지원
- [x] 7개 국어 번역 시스템 (한/영/중/일/베/몽/러)
- [x] URL 파라미터 기반 언어 전환 (?lang=ko)
- [x] 데이터베이스 다국어 컬럼 (name_en, description_zh 등)

### ✅ Database
- [x] 포괄적 스키마 설계 (10개 테이블)
- [x] 샘플 데이터 (5개 기업, 6개 카테고리, 5개 리스팅)
- [x] 인덱스 최적화
- [x] 외래키 제약조건

## 🔜 향후 개발 추천사항

### 우선순위 높음
1. **실제 AI 서비스 연동**
   - Cloudflare AI (Vision 모델) 또는 OpenAI Vision API
   - OCR 기능 (텍스트 추출)
   - 이미지 카테고리 분류 정확도 향상

2. **이미지 업로드 스토리지**
   - Cloudflare R2 버킷 생성 및 연동
   - 이미지 최적화 (리사이즈, 압축)
   - CDN 캐싱

3. **사용자 인증 시스템**
   - 회원가입/로그인
   - JWT 토큰 인증
   - 권한 관리 (일반 사용자, 기업, 관리자)

4. **검색 알고리즘 개선**
   - 벡터 검색 (D1 Full-Text Search 또는 외부 서비스)
   - 매칭 스코어 정확도 향상
   - 필터링 및 정렬 옵션 확장

### 중간 우선순위
5. **기업 상세 페이지**
   - 인증서 이미지 표시
   - 특허 상세 정보
   - 기술 포트폴리오
   - 납품 사례

6. **견적 요청 시스템**
   - OEM/ODM 견적서 양식
   - 다중 업체 견적 비교
   - 자동 견적 알림

7. **NDA 계약 시스템**
   - 비밀유지계약 템플릿
   - 전자서명 연동
   - 계약 관리

8. **알림 시스템**
   - 이메일 알림 (SendGrid, Resend)
   - 실시간 알림 (WebSocket)
   - 매칭 결과 알림

### 낮은 우선순위
9. **고급 관리자 기능**
   - 기업 승인/거부 UI
   - 리스팅 승인/거부
   - 통계 차트 (Chart.js)
   - 사용자 행동 분석 시각화

10. **성능 최적화**
    - 데이터베이스 쿼리 최적화
    - 캐싱 전략 (KV Storage)
    - 이미지 Lazy Loading
    - 페이지네이션 개선

## 📝 배포 가이드

### Cloudflare Pages 배포

1. **D1 데이터베이스 생성**
```bash
npx wrangler d1 create webapp-production
# database_id를 wrangler.jsonc에 업데이트
```

2. **마이그레이션 실행**
```bash
npm run db:migrate:prod
```

3. **빌드 및 배포**
```bash
npm run deploy:prod
```

4. **환경 변수 설정** (필요시)
```bash
npx wrangler pages secret put API_KEY --project-name webapp
```

5. **커스텀 도메인 추가** (선택)
```bash
npx wrangler pages domain add example.com --project-name webapp
```

## 🧪 테스트 가이드

### API 테스트
```bash
# 기업 목록 조회
curl http://localhost:3000/api/companies?status=approved

# 기업 상세 정보
curl http://localhost:3000/api/companies/1

# 기술 거래 목록
curl http://localhost:3000/api/listings?status=active

# 이미지 검색 (시뮬레이션)
curl -X POST http://localhost:3000/api/search/image \
  -H "Content-Type: application/json" \
  -d '{"image_url":"test.jpg","session_id":"test123"}'

# 관리자 통계
curl http://localhost:3000/api/admin/analytics
```

### 프론트엔드 테스트
1. 메인 페이지 접속
2. 언어 전환 (한/EN/中/日/VI/MN/RU)
3. 각 페이지 네비게이션 확인
4. 기업 등록 폼 제출
5. 이미지 검색 기능 테스트

## 📊 데이터베이스 관리

### 로컬 데이터베이스 조작
```bash
# 로컬 DB 콘솔
npm run db:console:local

# 쿼리 실행 예시
wrangler d1 execute webapp-production --local \
  --command="SELECT * FROM companies WHERE status='approved'"
```

### 프로덕션 데이터베이스
```bash
# 프로덕션 DB 콘솔
npm run db:console:prod

# 백업 (자동)
wrangler d1 backup create webapp-production
```

## 🔐 보안 고려사항

### 현재 구현된 보안 기능
- CORS 활성화 (모든 라우트)
- SQL Injection 방지 (Prepared Statements)
- XSS 방지 (HTML 이스케이핑)

### 추가 보안 권장사항
1. **Rate Limiting** - API 요청 제한
2. **Authentication** - JWT 토큰 인증
3. **Input Validation** - Zod 또는 Joi 스키마 검증
4. **HTTPS Only** - Cloudflare 자동 제공
5. **환경 변수** - API 키 및 시크릿 관리

## 📈 비즈니스 모델

### 수익 모델
1. **B2B 매칭 수수료** - 성사 1건당 3~5%
2. **프리미엄 기업 등록** - 상위 노출 월 3만~10만원
3. **기술 매각 중개** - 성공 보수제 5~10%
4. **지자체/공공기관 패키지** - 컨설팅 서비스
5. **글로벌 바이어 리드** - 유효 바이어 리스트 판매

## 📞 문의

프로젝트 관련 문의: [contact@techfinder.com](mailto:contact@techfinder.com)

---

**마지막 업데이트**: 2024-12-11  
**버전**: 1.0.0  
**개발 상태**: ✅ MVP 완료 (배포 준비 완료)
