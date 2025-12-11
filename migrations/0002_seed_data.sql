-- Seed data for TechFinder Platform
-- 초기 데이터 삽입

-- 기술 분류 체계 (대분류)
INSERT INTO technology_categories (id, name, name_en, name_zh, name_ja, name_vi, name_mn, name_ru, level) VALUES
(1, '수처리·환경', 'Water Treatment & Environment', '水处理与环境', '水処理・環境', 'Xử lý nước & Môi trường', 'Ус цэвэрлэгээ ба Байгаль орчин', 'Очистка воды и окружающая среда', 1),
(2, '에너지', 'Energy', '能源', 'エネルギー', 'Năng lượng', 'Эрчим хүч', 'Энергетика', 1),
(3, '자동화·로봇', 'Automation & Robotics', '自动化与机器人', '自動化・ロボット', 'Tự động hóa & Robot', 'Автоматжуулалт ба Робот', 'Автоматизация и робототехника', 1),
(4, '금형·기계가공', 'Mold & Machining', '模具与机械加工', '金型・機械加工', 'Khuôn mẫu & Gia công cơ khí', 'Хэв ба Механик боловсруулалт', 'Формовка и механическая обработка', 1),
(5, '센서·계측', 'Sensor & Measurement', '传感器与测量', 'センサー・計測', 'Cảm biến & Đo lường', 'Мэдрэгч ба Хэмжилт', 'Датчики и измерения', 1),
(6, '반도체·전자부품', 'Semiconductor & Electronics', '半导体与电子元件', '半導体・電子部品', 'Bán dẫn & Linh kiện điện tử', 'Хагас дамжуулагч ба Электрон эд анги', 'Полупроводники и электроника', 1);

-- 기술 분류 (중분류 - 수처리·환경)
INSERT INTO technology_categories (parent_id, name, name_en, name_zh, name_ja, name_vi, name_mn, name_ru, level) VALUES
(1, '담수화 설비', 'Desalination Equipment', '海水淡化设备', '淡水化設備', 'Thiết bị khử muối', 'Давсгүйжүүлэх төхөөрөмж', 'Опреснительное оборудование', 2),
(1, '폐수 처리', 'Wastewater Treatment', '废水处理', '廃水処理', 'Xử lý nước thải', 'Бохир ус цэвэрлэх', 'Очистка сточных вод', 2),
(1, '대기오염 방지', 'Air Pollution Control', '空气污染控制', '大気汚染防止', 'Kiểm soát ô nhiễm không khí', 'Агаарын бохирдлоос сэргийлэх', 'Контроль загрязнения воздуха', 2);

-- 기술 분류 (중분류 - 에너지)
INSERT INTO technology_categories (parent_id, name, name_en, name_zh, name_ja, name_vi, name_mn, name_ru, level) VALUES
(2, '태양광', 'Solar Power', '太阳能', '太陽光', 'Năng lượng mặt trời', 'Нарны эрчим хүч', 'Солнечная энергия', 2),
(2, 'ESS·배터리', 'ESS & Battery', 'ESS与电池', 'ESS・バッテリー', 'ESS & Pin', 'ESS ба Батерей', 'ESS и аккумуляторы', 2),
(2, '수소·연료전지', 'Hydrogen & Fuel Cell', '氢能与燃料电池', '水素・燃料電池', 'Hydro & Pin nhiên liệu', 'Устөрөгч ба Түлшний эс', 'Водород и топливные элементы', 2);

-- 기술 분류 (중분류 - 자동화·로봇)
INSERT INTO technology_categories (parent_id, name, name_en, name_zh, name_ja, name_vi, name_mn, name_ru, level) VALUES
(3, '산업용 로봇팔', 'Industrial Robot Arm', '工业机器人臂', '産業用ロボットアーム', 'Cánh tay robot công nghiệp', 'Үйлдвэрийн робот гар', 'Промышленный роботизированный манипулятор', 2),
(3, '협동 로봇', 'Collaborative Robot', '协作机器人', '協働ロボット', 'Robot cộng tác', 'Хамтын робот', 'Коллаборативный робот', 2),
(3, '공정 자동화', 'Process Automation', '过程自动化', '工程自動化', 'Tự động hóa quy trình', 'Үйл явцын автоматжуулалт', 'Автоматизация процессов', 2);

-- 샘플 기업 데이터
INSERT INTO companies (name, name_en, description, description_en, contact_person, email, phone, website, established_year, annual_revenue, employee_count, address, country, status) VALUES
('한국수처리기술', 'Korea Water Tech', '바닷물 담수화 및 폐수처리 전문기업', 'Specializing in seawater desalination and wastewater treatment', '김철수', 'contact@kwatertech.com', '+82-31-1234-5678', 'https://kwatertech.com', 2010, '50억원', 45, '경기도 화성시', 'KR', 'approved'),
('태양광에너지', 'Solar Energy Korea', '태양광 패널 및 주차장 시스템 제조', 'Manufacturing solar panels and parking lot systems', '이영희', 'info@solarkorea.com', '+82-42-2345-6789', 'https://solarkorea.com', 2015, '80억원', 78, '대전광역시', 'KR', 'approved'),
('자동화로봇', 'AutoRobot Inc', '공장 자동화 로봇 및 협동로봇 개발', 'Factory automation robots and collaborative robot development', '박민수', 'sales@autorobot.com', '+82-53-3456-7890', 'https://autorobot.com', 2012, '120억원', 95, '대구광역시', 'KR', 'approved'),
('정밀금형기술', 'Precision Mold Tech', '산업용 금형 및 사출성형 전문', 'Specializing in industrial molds and injection molding', '최지원', 'info@pmoldtech.com', '+82-55-4567-8901', 'https://pmoldtech.com', 2008, '65억원', 52, '경남 창원시', 'KR', 'approved'),
('스마트센서', 'Smart Sensor Co', 'IoT 센서 및 산업용 계측기 제조', 'IoT sensors and industrial measuring instruments', '정수진', 'contact@smartsensor.kr', '+82-31-5678-9012', 'https://smartsensor.kr', 2016, '35억원', 38, '경기도 안산시', 'KR', 'approved');

-- 기업 인증 정보
INSERT INTO company_certifications (company_id, certification_type, certification_number, issued_date, expiry_date) VALUES
(1, 'ISO9001', 'ISO9001-2024-001', '2024-01-15', '2027-01-14'),
(1, 'KC', 'KC-2024-WTR-123', '2024-02-10', '2026-02-09'),
(2, 'ISO9001', 'ISO9001-2023-045', '2023-06-20', '2026-06-19'),
(2, 'CE', 'CE-2023-SOLAR-456', '2023-07-15', '2028-07-14'),
(3, 'ISO9001', 'ISO9001-2024-078', '2024-03-10', '2027-03-09'),
(3, 'UL', 'UL-2024-ROBOT-789', '2024-04-05', '2027-04-04'),
(4, 'ISO9001', 'ISO9001-2022-112', '2022-09-01', '2025-08-31'),
(5, 'CE', 'CE-2024-SENSOR-345', '2024-05-20', '2029-05-19');

-- 기업 특허 정보
INSERT INTO company_patents (company_id, patent_number, patent_title, patent_title_en, filed_date, granted_date, country) VALUES
(1, 'KR10-2023-0012345', '역삼투압 담수화 시스템', 'Reverse Osmosis Desalination System', '2023-05-10', '2024-03-15', 'KR'),
(1, 'US11234567B2', '에너지 효율형 폐수처리 장치', 'Energy-Efficient Wastewater Treatment Device', '2022-08-20', '2024-01-10', 'US'),
(2, 'KR10-2022-0067890', '양면형 태양광 패널', 'Bifacial Solar Panel', '2022-11-15', '2023-09-20', 'KR'),
(3, 'KR10-2023-0098765', '협동로봇 안전제어 시스템', 'Collaborative Robot Safety Control System', '2023-07-05', '2024-06-01', 'KR'),
(4, 'KR10-2021-0054321', '정밀 사출금형 냉각시스템', 'Precision Injection Mold Cooling System', '2021-12-10', '2023-02-15', 'KR'),
(5, 'KR10-2024-0011111', 'IoT 통합 센서 네트워크', 'IoT Integrated Sensor Network', '2024-01-20', NULL, 'KR');

-- 기업 보유 기술
INSERT INTO company_technologies (company_id, category_id, technology_name, technology_name_en, description, maturity_level) VALUES
(1, 7, 'RO막 담수화', 'RO Membrane Desalination', '역삼투압 방식 바닷물 담수화 기술', 'Production'),
(1, 8, '고효율 폐수처리', 'High-Efficiency Wastewater Treatment', 'MBR 공법 기반 폐수처리', 'Production'),
(2, 10, '양면형 태양광 모듈', 'Bifacial Solar Module', '앞뒤 양면 발전 태양광 패널', 'Production'),
(2, 10, '태양광 주차장 시스템', 'Solar Parking System', '주차장 지붕형 태양광 발전', 'Production'),
(3, 13, '6축 산업용 로봇팔', '6-Axis Industrial Robot Arm', '정밀 제조용 로봇팔', 'Production'),
(3, 14, '협동로봇 UR시리즈', 'Collaborative Robot UR Series', '사람과 협업 가능한 안전 로봇', 'Production'),
(4, 4, '정밀 사출금형', 'Precision Injection Mold', '플라스틱 사출용 정밀 금형', 'Production'),
(5, 5, 'IoT 온습도센서', 'IoT Temperature & Humidity Sensor', '산업용 IoT 센서', 'Production');

-- 기술 매각 게시글
INSERT INTO technology_listings (company_id, technology_id, listing_type, title, title_en, description, description_en, price_range, location, status) VALUES
(1, 1, 'tech_sale', 'RO막 담수화 기술 이전', 'RO Membrane Desalination Technology Transfer', '10년간 축적된 역삼투압 담수화 기술 및 특허 일괄 이전', '10 years of accumulated RO desalination technology and patents', '20억~30억원', '경기도', 'active'),
(2, 4, 'collaboration', '태양광 주차장 공동 개발', 'Solar Parking System Joint Development', '중동 지역 태양광 주차장 프로젝트 공동 개발 파트너 모집', 'Seeking partners for Middle East solar parking projects', '협의', '대전', 'active'),
(3, 6, 'oem_odm', '협동로봇 OEM 생산', 'Collaborative Robot OEM Manufacturing', '협동로봇 OEM/ODM 생산 가능, 월 100대 생산 능력', 'Collaborative robot OEM/ODM available, 100 units/month capacity', '대당 800만원~', '대구', 'active'),
(4, 7, 'oem_odm', '정밀 금형 제작', 'Precision Mold Manufacturing', '플라스틱·금속 정밀 금형 제작, 소량부터 대량까지', 'Plastic & metal precision mold manufacturing, small to large batches', '협의', '창원', 'active'),
(1, 2, 'equity_sale', '폐수처리 사업부 지분 매각', 'Wastewater Division Equity Sale', '폐수처리 사업부 30% 지분 매각 (기술 및 고객 포함)', 'Selling 30% equity in wastewater division (including tech & clients)', '15억원', '경기도', 'active');

-- 샘플 검색 로그 (시연용)
INSERT INTO image_search_logs (session_id, detected_category, detected_features, search_timestamp) VALUES
('session_001', '수처리·환경', '{"features": ["펌프", "배관", "스테인리스"], "category": "담수화"}', '2024-12-10 10:30:00'),
('session_002', '에너지', '{"features": ["태양광패널", "주차장", "지지구조"], "category": "태양광"}', '2024-12-10 11:15:00'),
('session_003', '자동화·로봇', '{"features": ["로봇팔", "6축", "그리퍼"], "category": "산업용로봇"}', '2024-12-10 14:20:00');

-- 매칭 결과 (시연용)
INSERT INTO match_results (search_log_id, company_id, match_score, match_reason) VALUES
(1, 1, 0.92, '{"reason": "담수화 기술 보유", "patents": 2, "certifications": ["ISO9001", "KC"]}'),
(2, 2, 0.88, '{"reason": "태양광 주차장 전문", "patents": 1, "production_capacity": "high"}'),
(3, 3, 0.95, '{"reason": "6축 로봇팔 전문 제조", "patents": 1, "experience": "12년"}');
