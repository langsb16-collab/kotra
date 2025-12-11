-- USDT Payment System
-- USDT (테더) 기반 결제 시스템 추가

-- 기업 USDT 지갑 주소 테이블
CREATE TABLE IF NOT EXISTS company_wallets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  wallet_address TEXT NOT NULL UNIQUE,
  network TEXT NOT NULL DEFAULT 'TRC20', -- TRC20, ERC20, BEP20
  is_verified BOOLEAN DEFAULT 0,
  is_primary BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 거래(Transaction) 테이블
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_hash TEXT UNIQUE,
  listing_id INTEGER,
  buyer_id INTEGER, -- company_id of buyer
  seller_id INTEGER NOT NULL, -- company_id of seller
  amount_usdt REAL NOT NULL,
  network TEXT NOT NULL DEFAULT 'TRC20',
  from_address TEXT,
  to_address TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirming', 'completed', 'failed', 'refunded')),
  confirmations INTEGER DEFAULT 0,
  required_confirmations INTEGER DEFAULT 1,
  transaction_type TEXT NOT NULL CHECK(transaction_type IN ('tech_purchase', 'equity_purchase', 'oem_order', 'consultation_fee', 'platform_fee')),
  payment_proof_url TEXT, -- Screenshot or proof of payment
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (listing_id) REFERENCES technology_listings(id) ON DELETE SET NULL,
  FOREIGN KEY (buyer_id) REFERENCES companies(id) ON DELETE SET NULL,
  FOREIGN KEY (seller_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 거래 메시지/협상 테이블
CREATE TABLE IF NOT EXISTS transaction_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL, -- company_id
  message TEXT NOT NULL,
  attachment_url TEXT,
  is_system_message BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 에스크로 테이블 (플랫폼이 중간 보관)
CREATE TABLE IF NOT EXISTS escrow_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id INTEGER NOT NULL UNIQUE,
  escrow_wallet_address TEXT NOT NULL,
  amount_usdt REAL NOT NULL,
  network TEXT NOT NULL DEFAULT 'TRC20',
  deposit_tx_hash TEXT,
  deposit_confirmed BOOLEAN DEFAULT 0,
  release_tx_hash TEXT,
  released BOOLEAN DEFAULT 0,
  refund_tx_hash TEXT,
  refunded BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
);

-- 플랫폼 수수료 기록
CREATE TABLE IF NOT EXISTS platform_fees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id INTEGER NOT NULL,
  fee_percentage REAL NOT NULL DEFAULT 3.0, -- 3% 기본 수수료
  fee_amount_usdt REAL NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'collected', 'waived')),
  collected_at DATETIME,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
);

-- 환율 정보 (USDT to KRW, USD 등)
CREATE TABLE IF NOT EXISTS exchange_rates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  currency_code TEXT NOT NULL, -- KRW, USD, CNY, JPY, etc.
  usdt_rate REAL NOT NULL, -- 1 USDT = X currency
  source TEXT, -- API source
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 가격 정보 업데이트 (리스팅에 USDT 가격 추가)
ALTER TABLE technology_listings ADD COLUMN price_usdt REAL;
ALTER TABLE technology_listings ADD COLUMN price_min_usdt REAL;
ALTER TABLE technology_listings ADD COLUMN price_max_usdt REAL;
ALTER TABLE technology_listings ADD COLUMN accepts_usdt BOOLEAN DEFAULT 1;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_company_wallets_company ON company_wallets(company_id);
CREATE INDEX IF NOT EXISTS idx_company_wallets_address ON company_wallets(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_listing ON transactions(listing_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_transaction_messages_transaction ON transaction_messages(transaction_id);
CREATE INDEX IF NOT EXISTS idx_escrow_accounts_transaction ON escrow_accounts(transaction_id);
CREATE INDEX IF NOT EXISTS idx_platform_fees_transaction ON platform_fees(transaction_id);

-- 샘플 지갑 주소 (테스트용)
INSERT INTO company_wallets (company_id, wallet_address, network, is_verified) VALUES
(1, 'TXYZa2PCw6hKPyXkfXnQqZqGqHcMmFTzKs', 'TRC20', 1),
(2, 'TEDd8mKKX4qvJCbQDrN1kGGVDnPnMPjrJL', 'TRC20', 1),
(3, 'TRc8VpXhFhz2WxQYBgCJpQzK7P8nMjrEzy', 'TRC20', 1),
(4, 'TJdRCJBVQ8hxQzPwGK8nMjrEzyBgCJpQzK', 'TRC20', 1),
(5, 'TPnMjrEzyBgCJpQzK7P8nTJdRCJBVQ8hxQ', 'TRC20', 1);

-- 샘플 환율 정보
INSERT INTO exchange_rates (currency_code, usdt_rate, source) VALUES
('KRW', 1380.50, 'manual'),
('USD', 1.00, 'manual'),
('CNY', 7.24, 'manual'),
('JPY', 149.50, 'manual'),
('VND', 25380.00, 'manual');

-- 리스팅에 USDT 가격 추가
UPDATE technology_listings SET price_usdt = 15000, price_min_usdt = 12000, price_max_usdt = 20000, accepts_usdt = 1 WHERE id = 1;
UPDATE technology_listings SET accepts_usdt = 1 WHERE id = 2;
UPDATE technology_listings SET price_usdt = 6000, accepts_usdt = 1 WHERE id = 3;
UPDATE technology_listings SET accepts_usdt = 1 WHERE id = 4;
UPDATE technology_listings SET price_usdt = 11000, accepts_usdt = 1 WHERE id = 5;

-- 샘플 트랜잭션 (테스트용)
INSERT INTO transactions (
  transaction_hash, listing_id, buyer_id, seller_id,
  amount_usdt, network, from_address, to_address,
  status, confirmations, transaction_type
) VALUES
(
  '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  1, 2, 1,
  15000.00, 'TRC20',
  'TEDd8mKKX4qvJCbQDrN1kGGVDnPnMPjrJL',
  'TXYZa2PCw6hKPyXkfXnQqZqGqHcMmFTzKs',
  'completed', 20, 'tech_purchase'
),
(
  NULL, 3, 5, 3,
  6000.00, 'TRC20',
  NULL,
  'TRc8VpXhFhz2WxQYBgCJpQzK7P8nMjrEzy',
  'pending', 0, 'oem_order'
);

-- 플랫폼 수수료 기록
INSERT INTO platform_fees (transaction_id, fee_percentage, fee_amount_usdt, status, collected_at) VALUES
(1, 3.0, 450.00, 'collected', '2024-12-10 15:30:00');

INSERT INTO platform_fees (transaction_id, fee_percentage, fee_amount_usdt, status) VALUES
(2, 3.0, 180.00, 'pending');
