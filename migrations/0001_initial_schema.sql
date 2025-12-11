-- TechFinder Platform Database Schema
-- 원천기술 매칭 플랫폼을 위한 데이터베이스 스키마

-- 기업 정보 테이블
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_en TEXT,
  name_zh TEXT,
  name_ja TEXT,
  name_vi TEXT,
  name_mn TEXT,
  name_ru TEXT,
  description TEXT,
  description_en TEXT,
  description_zh TEXT,
  description_ja TEXT,
  description_vi TEXT,
  description_mn TEXT,
  description_ru TEXT,
  contact_person TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  established_year INTEGER,
  annual_revenue TEXT,
  employee_count INTEGER,
  address TEXT,
  country TEXT DEFAULT 'KR',
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 기업 인증 정보 테이블
CREATE TABLE IF NOT EXISTS company_certifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  certification_type TEXT NOT NULL, -- ISO9001, KC, CE, UL, etc.
  certification_number TEXT,
  issued_date DATE,
  expiry_date DATE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 기업 특허 정보 테이블
CREATE TABLE IF NOT EXISTS company_patents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  patent_number TEXT NOT NULL,
  patent_title TEXT,
  patent_title_en TEXT,
  patent_title_zh TEXT,
  patent_title_ja TEXT,
  patent_title_vi TEXT,
  patent_title_mn TEXT,
  patent_title_ru TEXT,
  filed_date DATE,
  granted_date DATE,
  country TEXT,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 기술 분류 체계 테이블
CREATE TABLE IF NOT EXISTS technology_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_id INTEGER,
  name TEXT NOT NULL,
  name_en TEXT,
  name_zh TEXT,
  name_ja TEXT,
  name_vi TEXT,
  name_mn TEXT,
  name_ru TEXT,
  level INTEGER DEFAULT 1, -- 1: 대분류, 2: 중분류, 3: 소분류
  FOREIGN KEY (parent_id) REFERENCES technology_categories(id) ON DELETE CASCADE
);

-- 기업 보유 기술 테이블
CREATE TABLE IF NOT EXISTS company_technologies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  technology_name TEXT NOT NULL,
  technology_name_en TEXT,
  technology_name_zh TEXT,
  technology_name_ja TEXT,
  technology_name_vi TEXT,
  technology_name_mn TEXT,
  technology_name_ru TEXT,
  description TEXT,
  maturity_level TEXT, -- R&D, Prototype, Production
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES technology_categories(id)
);

-- 기술 매각/거래 게시글 테이블
CREATE TABLE IF NOT EXISTS technology_listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  technology_id INTEGER,
  listing_type TEXT NOT NULL CHECK(listing_type IN ('tech_sale', 'equity_sale', 'collaboration', 'oem_odm')),
  title TEXT NOT NULL,
  title_en TEXT,
  title_zh TEXT,
  title_ja TEXT,
  title_vi TEXT,
  title_mn TEXT,
  title_ru TEXT,
  description TEXT NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  description_ja TEXT,
  description_vi TEXT,
  description_mn TEXT,
  description_ru TEXT,
  price_range TEXT,
  location TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'closed', 'pending')),
  views INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (technology_id) REFERENCES company_technologies(id)
);

-- 이미지 검색 로그 테이블
CREATE TABLE IF NOT EXISTS image_search_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  image_url TEXT,
  analysis_result TEXT, -- JSON format
  detected_category TEXT,
  detected_features TEXT, -- JSON format
  search_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 매칭 결과 테이블
CREATE TABLE IF NOT EXISTS match_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  search_log_id INTEGER,
  company_id INTEGER NOT NULL,
  match_score REAL DEFAULT 0.0, -- 0.0 ~ 1.0
  match_reason TEXT, -- JSON format
  is_contacted BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (search_log_id) REFERENCES image_search_logs(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 상담 요청 테이블
CREATE TABLE IF NOT EXISTS consultation_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'responded', 'closed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 사용자 행동 분석 테이블
CREATE TABLE IF NOT EXISTS user_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  event_type TEXT NOT NULL, -- page_view, search, upload, contact, etc.
  event_data TEXT, -- JSON format
  user_agent TEXT,
  ip_address TEXT,
  language TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_country ON companies(country);
CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email);
CREATE INDEX IF NOT EXISTS idx_company_certifications_company ON company_certifications(company_id);
CREATE INDEX IF NOT EXISTS idx_company_patents_company ON company_patents(company_id);
CREATE INDEX IF NOT EXISTS idx_technology_categories_parent ON technology_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_company_technologies_company ON company_technologies(company_id);
CREATE INDEX IF NOT EXISTS idx_company_technologies_category ON company_technologies(category_id);
CREATE INDEX IF NOT EXISTS idx_technology_listings_company ON technology_listings(company_id);
CREATE INDEX IF NOT EXISTS idx_technology_listings_type ON technology_listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_technology_listings_status ON technology_listings(status);
CREATE INDEX IF NOT EXISTS idx_match_results_search_log ON match_results(search_log_id);
CREATE INDEX IF NOT EXISTS idx_match_results_company ON match_results(company_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_company ON consultation_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON consultation_requests(status);
CREATE INDEX IF NOT EXISTS idx_user_analytics_session ON user_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_type ON user_analytics(event_type);
