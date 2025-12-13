import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import type { Env, ApiResponse, Company, CompanyDetail, TechnologyListing, MatchResultDetail, ImageAnalysisResult } from './types'
import type { Language } from './lib/i18n'
import { getTranslation } from './lib/i18n'

const app = new Hono<{ Bindings: Env }>()

// Enable CORS for all routes
app.use('/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Health check
app.get('/api/health', (c) => {
  return c.json({ success: true, message: 'TechFinder API is running' })
})

// ==================== Company API ====================

// Get all companies (with filters)
app.get('/api/companies', async (c) => {
  try {
    const { status, country, limit = '50', offset = '0' } = c.req.query()
    const db = c.env.DB

    let query = 'SELECT * FROM companies WHERE 1=1'
    const params: any[] = []

    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }
    if (country) {
      query += ' AND country = ?'
      params.push(country)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))

    const result = await db.prepare(query).bind(...params).all()

    return c.json<ApiResponse<Company[]>>({
      success: true,
      data: result.results as Company[],
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// Get company by ID with details
app.get('/api/companies/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const db = c.env.DB

    // Get company
    const company = await db
      .prepare('SELECT * FROM companies WHERE id = ?')
      .bind(id)
      .first<Company>()

    if (!company) {
      return c.json<ApiResponse>({ success: false, error: 'Company not found' }, 404)
    }

    // Get certifications
    const certifications = await db
      .prepare('SELECT * FROM company_certifications WHERE company_id = ?')
      .bind(id)
      .all()

    // Get patents
    const patents = await db
      .prepare('SELECT * FROM company_patents WHERE company_id = ?')
      .bind(id)
      .all()

    // Get technologies with categories
    const technologies = await db
      .prepare(`
        SELECT ct.*, tc.name as category_name, tc.name_en as category_name_en
        FROM company_technologies ct
        LEFT JOIN technology_categories tc ON ct.category_id = tc.id
        WHERE ct.company_id = ?
      `)
      .bind(id)
      .all()

    const companyDetail: CompanyDetail = {
      ...company,
      certifications: certifications.results as any[],
      patents: patents.results as any[],
      technologies: technologies.results as any[],
    }

    return c.json<ApiResponse<CompanyDetail>>({
      success: true,
      data: companyDetail,
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// Register new company
app.post('/api/companies', async (c) => {
  try {
    const body = await c.req.json()
    const db = c.env.DB

    const result = await db
      .prepare(`
        INSERT INTO companies (
          name, name_en, description, description_en,
          contact_person, email, phone, website,
          established_year, annual_revenue, employee_count,
          address, country, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `)
      .bind(
        body.name,
        body.name_en || null,
        body.description || null,
        body.description_en || null,
        body.contact_person || null,
        body.email,
        body.phone || null,
        body.website || null,
        body.established_year || null,
        body.annual_revenue || null,
        body.employee_count || null,
        body.address || null,
        body.country || 'KR'
      )
      .run()

    return c.json<ApiResponse>({
      success: true,
      message: 'Company registered successfully',
      data: { id: result.meta.last_row_id },
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// ==================== Technology Listings API ====================

// Get all technology listings
app.get('/api/listings', async (c) => {
  try {
    const { type, status = 'active', limit = '20', offset = '0' } = c.req.query()
    const db = c.env.DB

    let query = `
      SELECT tl.*, c.name as company_name, c.country
      FROM technology_listings tl
      LEFT JOIN companies c ON tl.company_id = c.id
      WHERE tl.status = ?
    `
    const params: any[] = [status]

    if (type) {
      query += ' AND tl.listing_type = ?'
      params.push(type)
    }

    query += ' ORDER BY tl.created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))

    const result = await db.prepare(query).bind(...params).all()

    return c.json<ApiResponse<TechnologyListing[]>>({
      success: true,
      data: result.results as any[],
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// Get listing by ID
app.get('/api/listings/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const db = c.env.DB

    const listing = await db
      .prepare(`
        SELECT tl.*, c.name as company_name, c.email as company_email,
               c.phone as company_phone, c.website as company_website
        FROM technology_listings tl
        LEFT JOIN companies c ON tl.company_id = c.id
        WHERE tl.id = ?
      `)
      .bind(id)
      .first()

    if (!listing) {
      return c.json<ApiResponse>({ success: false, error: 'Listing not found' }, 404)
    }

    // Increment views
    await db
      .prepare('UPDATE technology_listings SET views = views + 1 WHERE id = ?')
      .bind(id)
      .run()

    return c.json<ApiResponse>({
      success: true,
      data: listing,
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// Create new listing
app.post('/api/listings', async (c) => {
  try {
    const body = await c.req.json()
    const db = c.env.DB

    const result = await db
      .prepare(`
        INSERT INTO technology_listings (
          company_id, technology_id, listing_type,
          title, title_en, description, description_en,
          price_range, location, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `)
      .bind(
        body.company_id,
        body.technology_id || null,
        body.listing_type,
        body.title,
        body.title_en || null,
        body.description,
        body.description_en || null,
        body.price_range || null,
        body.location || null
      )
      .run()

    return c.json<ApiResponse>({
      success: true,
      message: 'Listing created successfully',
      data: { id: result.meta.last_row_id },
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// ==================== Technology Categories API ====================

// Get all categories
app.get('/api/categories', async (c) => {
  try {
    const { level } = c.req.query()
    const db = c.env.DB

    let query = 'SELECT * FROM technology_categories'
    const params: any[] = []

    if (level) {
      query += ' WHERE level = ?'
      params.push(parseInt(level))
    }

    query += ' ORDER BY level, id'

    const result = await db.prepare(query).bind(...params).all()

    return c.json<ApiResponse>({
      success: true,
      data: result.results,
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// ==================== Image Search API ====================

// Simulate image analysis (in production, integrate with real AI service)
app.post('/api/search/image', async (c) => {
  try {
    const body = await c.req.json()
    const { image_url, session_id } = body
    const db = c.env.DB

    // Simulate AI analysis (replace with real AI service in production)
    const analysisResult: ImageAnalysisResult = {
      category: '수처리·환경',
      features: ['펌프', '배관', '스테인리스', '담수화'],
      keywords: ['역삼투압', 'RO막', '바닷물'],
      confidence: 0.85,
    }

    // Save search log
    const searchLog = await db
      .prepare(`
        INSERT INTO image_search_logs (
          session_id, image_url, analysis_result,
          detected_category, detected_features
        ) VALUES (?, ?, ?, ?, ?)
      `)
      .bind(
        session_id || null,
        image_url || null,
        JSON.stringify(analysisResult),
        analysisResult.category,
        JSON.stringify(analysisResult.features)
      )
      .run()

    // Find matching companies
    const matches = await db
      .prepare(`
        SELECT DISTINCT c.*, 
          (SELECT COUNT(*) FROM company_certifications WHERE company_id = c.id) as cert_count,
          (SELECT COUNT(*) FROM company_patents WHERE company_id = c.id) as patent_count
        FROM companies c
        LEFT JOIN company_technologies ct ON c.id = ct.company_id
        LEFT JOIN technology_categories tc ON ct.category_id = tc.id
        WHERE c.status = 'approved'
          AND (tc.name LIKE '%담수화%' OR tc.name LIKE '%수처리%' OR ct.technology_name LIKE '%RO%')
        ORDER BY patent_count DESC, cert_count DESC
        LIMIT 10
      `)
      .all()

    // Save match results
    for (const company of matches.results as any[]) {
      await db
        .prepare(`
          INSERT INTO match_results (
            search_log_id, company_id, match_score, match_reason
          ) VALUES (?, ?, ?, ?)
        `)
        .bind(
          searchLog.meta.last_row_id,
          company.id,
          0.85,
          JSON.stringify({ reason: '기술 분야 일치', features: analysisResult.features })
        )
        .run()
    }

    return c.json<ApiResponse>({
      success: true,
      data: {
        analysis: analysisResult,
        matches: matches.results,
        search_log_id: searchLog.meta.last_row_id,
      },
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// ==================== Consultation Request API ====================

// Submit consultation request
app.post('/api/consultations', async (c) => {
  try {
    const body = await c.req.json()
    const db = c.env.DB

    const result = await db
      .prepare(`
        INSERT INTO consultation_requests (
          company_id, requester_name, requester_email,
          requester_phone, message, status
        ) VALUES (?, ?, ?, ?, ?, 'pending')
      `)
      .bind(
        body.company_id,
        body.requester_name,
        body.requester_email,
        body.requester_phone || null,
        body.message || null
      )
      .run()

    return c.json<ApiResponse>({
      success: true,
      message: 'Consultation request submitted successfully',
      data: { id: result.meta.last_row_id },
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// ==================== Analytics API ====================

// Track user event
app.post('/api/analytics', async (c) => {
  try {
    const body = await c.req.json()
    const db = c.env.DB
    const userAgent = c.req.header('user-agent')
    const ip = c.req.header('cf-connecting-ip')

    await db
      .prepare(`
        INSERT INTO user_analytics (
          session_id, event_type, event_data,
          user_agent, ip_address, language
        ) VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(
        body.session_id || null,
        body.event_type,
        body.event_data ? JSON.stringify(body.event_data) : null,
        userAgent || null,
        ip || null,
        body.language || 'ko'
      )
      .run()

    return c.json<ApiResponse>({ success: true })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// Get analytics dashboard (admin only)
app.get('/api/admin/analytics', async (c) => {
  try {
    const db = c.env.DB

    // Get statistics
    const stats = await db
      .prepare(`
        SELECT
          (SELECT COUNT(*) FROM companies WHERE status = 'approved') as total_companies,
          (SELECT COUNT(*) FROM company_technologies) as total_technologies,
          (SELECT COUNT(*) FROM match_results) as total_matches,
          (SELECT COUNT(*) FROM companies WHERE status = 'pending') as pending_companies,
          (SELECT COUNT(*) FROM technology_listings WHERE status = 'active') as active_listings
      `)
      .first()

    // Get recent searches
    const recentSearches = await db
      .prepare(`
        SELECT detected_category, COUNT(*) as count
        FROM image_search_logs
        WHERE search_timestamp >= datetime('now', '-7 days')
        GROUP BY detected_category
        ORDER BY count DESC
        LIMIT 10
      `)
      .all()

    return c.json<ApiResponse>({
      success: true,
      data: {
        stats,
        recentSearches: recentSearches.results,
      },
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// ==================== Admin API ====================

// Update company status
app.patch('/api/admin/companies/:id/status', async (c) => {
  try {
    const id = c.req.param('id')
    const { status } = await c.req.json()
    const db = c.env.DB

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return c.json<ApiResponse>({ success: false, error: 'Invalid status' }, 400)
    }

    await db
      .prepare('UPDATE companies SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(status, id)
      .run()

    return c.json<ApiResponse>({
      success: true,
      message: 'Company status updated',
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// Update listing status
app.patch('/api/admin/listings/:id/status', async (c) => {
  try {
    const id = c.req.param('id')
    const { status } = await c.req.json()
    const db = c.env.DB

    if (!['active', 'closed', 'pending'].includes(status)) {
      return c.json<ApiResponse>({ success: false, error: 'Invalid status' }, 400)
    }

    await db
      .prepare('UPDATE technology_listings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(status, id)
      .run()

    return c.json<ApiResponse>({
      success: true,
      message: 'Listing status updated',
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// ==================== USDT Payment API ====================

// Get company wallet address
app.get('/api/wallets/:companyId', async (c) => {
  try {
    const companyId = c.req.param('companyId')
    const db = c.env.DB

    const wallet = await db
      .prepare('SELECT * FROM company_wallets WHERE company_id = ? AND is_primary = 1')
      .bind(companyId)
      .first()

    if (!wallet) {
      return c.json<ApiResponse>({ success: false, error: 'Wallet not found' }, 404)
    }

    return c.json<ApiResponse>({
      success: true,
      data: wallet,
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// Create transaction
app.post('/api/transactions', async (c) => {
  try {
    const body = await c.req.json()
    const db = c.env.DB

    // Calculate platform fee (3% default)
    const feePercentage = 3.0
    const feeAmount = body.amount_usdt * (feePercentage / 100)

    // Create transaction
    const transaction = await db
      .prepare(`
        INSERT INTO transactions (
          listing_id, buyer_id, seller_id, amount_usdt,
          network, to_address, status, transaction_type
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
      `)
      .bind(
        body.listing_id || null,
        body.buyer_id || null,
        body.seller_id,
        body.amount_usdt,
        body.network || 'TRC20',
        body.to_address,
        body.transaction_type || 'tech_purchase'
      )
      .run()

    const transactionId = transaction.meta.last_row_id

    // Record platform fee
    await db
      .prepare(`
        INSERT INTO platform_fees (
          transaction_id, fee_percentage, fee_amount_usdt, status
        ) VALUES (?, ?, ?, 'pending')
      `)
      .bind(transactionId, feePercentage, feeAmount)
      .run()

    return c.json<ApiResponse>({
      success: true,
      message: 'Transaction created',
      data: {
        transaction_id: transactionId,
        amount_usdt: body.amount_usdt,
        platform_fee: feeAmount,
        total: body.amount_usdt + feeAmount,
      },
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// Get transaction by ID
app.get('/api/transactions/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const db = c.env.DB

    const transaction = await db
      .prepare(`
        SELECT t.*, 
          bc.name as buyer_name, bc.email as buyer_email,
          sc.name as seller_name, sc.email as seller_email,
          sw.wallet_address as seller_wallet,
          pf.fee_amount_usdt as platform_fee
        FROM transactions t
        LEFT JOIN companies bc ON t.buyer_id = bc.id
        LEFT JOIN companies sc ON t.seller_id = sc.id
        LEFT JOIN company_wallets sw ON t.seller_id = sw.company_id AND sw.is_primary = 1
        LEFT JOIN platform_fees pf ON t.id = pf.transaction_id
        WHERE t.id = ?
      `)
      .bind(id)
      .first()

    if (!transaction) {
      return c.json<ApiResponse>({ success: false, error: 'Transaction not found' }, 404)
    }

    return c.json<ApiResponse>({
      success: true,
      data: transaction,
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// Update transaction status (confirm payment)
app.patch('/api/transactions/:id/status', async (c) => {
  try {
    const id = c.req.param('id')
    const { status, transaction_hash, payment_proof_url } = await c.req.json()
    const db = c.env.DB

    if (!['pending', 'confirming', 'completed', 'failed', 'refunded'].includes(status)) {
      return c.json<ApiResponse>({ success: false, error: 'Invalid status' }, 400)
    }

    const updates: string[] = ['status = ?', 'updated_at = CURRENT_TIMESTAMP']
    const params: any[] = [status]

    if (transaction_hash) {
      updates.push('transaction_hash = ?')
      params.push(transaction_hash)
    }

    if (payment_proof_url) {
      updates.push('payment_proof_url = ?')
      params.push(payment_proof_url)
    }

    if (status === 'completed') {
      updates.push('completed_at = CURRENT_TIMESTAMP')
      
      // Update platform fee status
      await db
        .prepare('UPDATE platform_fees SET status = ?, collected_at = CURRENT_TIMESTAMP WHERE transaction_id = ?')
        .bind('collected', id)
        .run()
    }

    params.push(id)

    await db
      .prepare(`UPDATE transactions SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...params)
      .run()

    return c.json<ApiResponse>({
      success: true,
      message: 'Transaction updated',
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// Get all transactions (with filters)
app.get('/api/transactions', async (c) => {
  try {
    const { buyer_id, seller_id, status, limit = '20', offset = '0' } = c.req.query()
    const db = c.env.DB

    let query = `
      SELECT t.*, 
        bc.name as buyer_name,
        sc.name as seller_name,
        pf.fee_amount_usdt as platform_fee
      FROM transactions t
      LEFT JOIN companies bc ON t.buyer_id = bc.id
      LEFT JOIN companies sc ON t.seller_id = sc.id
      LEFT JOIN platform_fees pf ON t.id = pf.transaction_id
      WHERE 1=1
    `
    const params: any[] = []

    if (buyer_id) {
      query += ' AND t.buyer_id = ?'
      params.push(buyer_id)
    }
    if (seller_id) {
      query += ' AND t.seller_id = ?'
      params.push(seller_id)
    }
    if (status) {
      query += ' AND t.status = ?'
      params.push(status)
    }

    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))

    const result = await db.prepare(query).bind(...params).all()

    return c.json<ApiResponse>({
      success: true,
      data: result.results,
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// Get exchange rates
app.get('/api/exchange-rates', async (c) => {
  try {
    const db = c.env.DB

    const rates = await db
      .prepare(`
        SELECT * FROM (
          SELECT *, ROW_NUMBER() OVER (PARTITION BY currency_code ORDER BY created_at DESC) as rn
          FROM exchange_rates
        ) WHERE rn = 1
      `)
      .all()

    return c.json<ApiResponse>({
      success: true,
      data: rates.results,
    })
  } catch (error: any) {
    return c.json<ApiResponse>({ success: false, error: error.message }, 500)
  }
})

// ==================== Frontend Routes ====================

// Main page
app.get('/', (c) => {
  const lang = (c.req.query('lang') as Language) || 'ko'
  const t = getTranslation(lang)
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>${t.header.title} - ${t.header.subtitle}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          * { -webkit-tap-highlight-color: transparent; scroll-behavior: smooth; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Apple SD Gothic Neo', sans-serif; }
        </style>
    </head>
    <body class="bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div id="app">
            <!-- Compact Header -->
            <nav class="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
                <div class="mx-auto px-3 py-2">
                    <div class="flex justify-between items-center">
                        <a href="/?lang=${lang}" class="flex items-center gap-2">
                            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
                                <i class="fas fa-search text-white text-sm"></i>
                            </div>
                            <span class="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">TechFinder</span>
                        </a>
                        
                        <!-- Mobile Nav + Language -->
                        <div class="flex items-center gap-2">
                            <!-- Nav Icons (Mobile) -->
                            <div class="flex gap-1">
                                <a href="/?lang=${lang}" class="p-2 text-indigo-600"><i class="fas fa-home text-sm"></i></a>
                                <a href="/search?lang=${lang}" class="p-2 text-gray-600 hover:text-indigo-600"><i class="fas fa-camera text-sm"></i></a>
                                <a href="/marketplace?lang=${lang}" class="p-2 text-gray-600 hover:text-indigo-600"><i class="fas fa-store text-sm"></i></a>
                            </div>
                            
                            <!-- Language Selector (Prominent) -->
                            <div class="relative">
                                <button onclick="document.getElementById('langMenu').classList.toggle('hidden')" 
                                        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-1">
                                    <i class="fas fa-globe"></i>
                                    <span>${lang.toUpperCase()}</span>
                                    <i class="fas fa-chevron-down text-[10px]"></i>
                                </button>
                                <div id="langMenu" class="hidden absolute right-0 mt-2 bg-white rounded-xl shadow-2xl p-2 min-w-[140px] z-50">
                                    <a href="/?lang=ko" class="block px-3 py-2 rounded-lg ${lang === 'ko' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}">🇰🇷 한국어</a>
                                    <a href="/?lang=en" class="block px-3 py-2 rounded-lg ${lang === 'en' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}">🇺🇸 English</a>
                                    <a href="/?lang=zh" class="block px-3 py-2 rounded-lg ${lang === 'zh' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}">🇨🇳 中文</a>
                                    <a href="/?lang=ja" class="block px-3 py-2 rounded-lg ${lang === 'ja' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}">🇯🇵 日本語</a>
                                    <a href="/?lang=vi" class="block px-3 py-2 rounded-lg ${lang === 'vi' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}">🇻🇳 Tiếng Việt</a>
                                    <a href="/?lang=mn" class="block px-3 py-2 rounded-lg ${lang === 'mn' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}">🇲🇳 Монгол</a>
                                    <a href="/?lang=ru" class="block px-3 py-2 rounded-lg ${lang === 'ru' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}">🇷🇺 Русский</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Compact Hero Section -->
            <section class="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-12 px-4">
                <div class="max-w-2xl mx-auto text-center">
                    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                        <div class="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-camera text-3xl"></i>
                        </div>
                        <h2 class="text-2xl md:text-3xl font-bold mb-3">${t.home.hero.title}</h2>
                        <p class="text-sm md:text-base mb-6 text-white/90">${t.home.hero.subtitle}</p>
                        <a href="/search?lang=${lang}" class="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 inline-flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all">
                            <i class="fas fa-camera"></i>
                            <span>${t.home.hero.uploadButton}</span>
                        </a>
                    </div>
                </div>
            </section>

            <!-- Compact How It Works -->
            <section class="py-8 px-4">
                <div class="max-w-2xl mx-auto">
                    <h3 class="text-xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">${t.home.howItWorks.title}</h3>
                    <div class="space-y-3">
                        <div class="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-4">
                            <div class="bg-gradient-to-br from-indigo-500 to-purple-500 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-camera text-xl text-white"></i>
                            </div>
                            <div>
                                <h4 class="text-sm font-bold mb-1">${t.home.howItWorks.step1.title}</h4>
                                <p class="text-xs text-gray-600">${t.home.howItWorks.step1.desc}</p>
                            </div>
                        </div>
                        <div class="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-4">
                            <div class="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-brain text-xl text-white"></i>
                            </div>
                            <div>
                                <h4 class="text-sm font-bold mb-1">${t.home.howItWorks.step2.title}</h4>
                                <p class="text-xs text-gray-600">${t.home.howItWorks.step2.desc}</p>
                            </div>
                        </div>
                        <div class="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-4">
                            <div class="bg-gradient-to-br from-pink-500 to-rose-500 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-handshake text-xl text-white"></i>
                            </div>
                            <div>
                                <h4 class="text-sm font-bold mb-1">${t.home.howItWorks.step3.title}</h4>
                                <p class="text-xs text-gray-600">${t.home.howItWorks.step3.desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Compact Features Grid -->
            <section class="py-8 px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
                <div class="max-w-2xl mx-auto">
                    <h3 class="text-xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">${t.home.features.title}</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
                            <div class="bg-gradient-to-br from-blue-500 to-cyan-500 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                                <i class="fas fa-image text-lg text-white"></i>
                            </div>
                            <h4 class="text-sm font-bold mb-1">${t.home.features.feature1.title}</h4>
                            <p class="text-xs text-gray-600 leading-snug">${t.home.features.feature1.desc}</p>
                        </div>
                        <div class="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
                            <div class="bg-gradient-to-br from-emerald-500 to-teal-500 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                                <i class="fas fa-exchange-alt text-lg text-white"></i>
                            </div>
                            <h4 class="text-sm font-bold mb-1">${t.home.features.feature2.title}</h4>
                            <p class="text-xs text-gray-600 leading-snug">${t.home.features.feature2.desc}</p>
                        </div>
                        <div class="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
                            <div class="bg-gradient-to-br from-orange-500 to-amber-500 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                                <i class="fas fa-industry text-lg text-white"></i>
                            </div>
                            <h4 class="text-sm font-bold mb-1">${t.home.features.feature3.title}</h4>
                            <p class="text-xs text-gray-600 leading-snug">${t.home.features.feature3.desc}</p>
                        </div>
                        <div class="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
                            <div class="bg-gradient-to-br from-purple-500 to-fuchsia-500 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                                <i class="fas fa-globe text-lg text-white"></i>
                            </div>
                            <h4 class="text-sm font-bold mb-1">${t.home.features.feature4.title}</h4>
                            <p class="text-xs text-gray-600 leading-snug">${t.home.features.feature4.desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Compact Stats -->
            <section class="py-8 px-4">
                <div class="max-w-2xl mx-auto">
                    <div class="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 shadow-2xl">
                        <div class="grid grid-cols-2 gap-4 text-center text-white">
                            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div class="text-3xl font-bold mb-1">150+</div>
                                <div class="text-xs opacity-90">${t.home.stats.companies}</div>
                            </div>
                            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div class="text-3xl font-bold mb-1">500+</div>
                                <div class="text-xs opacity-90">${t.home.stats.technologies}</div>
                            </div>
                            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div class="text-3xl font-bold mb-1">1,200+</div>
                                <div class="text-xs opacity-90">${t.home.stats.matches}</div>
                            </div>
                            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div class="text-3xl font-bold mb-1">15+</div>
                                <div class="text-xs opacity-90">${t.home.stats.countries}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Mobile-Friendly Footer -->
            <footer class="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 px-4">
                <div class="max-w-2xl mx-auto text-center">
                    <div class="flex items-center justify-center gap-2 mb-3">
                        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
                            <i class="fas fa-search text-white text-sm"></i>
                        </div>
                        <span class="text-lg font-bold">${t.header.title}</span>
                    </div>
                    <p class="text-xs text-gray-400 mb-4">${t.header.subtitle}</p>
                    <div class="flex justify-center gap-4 mb-4">
                        <a href="/?lang=${lang}" class="text-gray-400 hover:text-white text-xs">${t.header.nav.home}</a>
                        <a href="/search?lang=${lang}" class="text-gray-400 hover:text-white text-xs">${t.header.nav.search}</a>
                        <a href="/marketplace?lang=${lang}" class="text-gray-400 hover:text-white text-xs">${t.header.nav.marketplace}</a>
                        <a href="/admin?lang=${lang}" class="text-gray-400 hover:text-white text-xs">${t.header.nav.admin}</a>
                    </div>
                    <p class="text-xs text-gray-500">&copy; 2024 ${t.header.title}. All rights reserved.</p>
                </div>
            </footer>
        </div>

        <script src="/static/app.js"></script>
        <script>
          // Close language menu when clicking outside
          document.addEventListener('click', (e) => {
            const langMenu = document.getElementById('langMenu');
            if (!e.target.closest('.relative') && langMenu) {
              langMenu.classList.add('hidden');
            }
          });
        </script>
    </body>
    </html>
  `)
})

// Search page
app.get('/search', (c) => {
  const lang = (c.req.query('lang') as Language) || 'ko'
  const t = getTranslation(lang)
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.search.title} - ${t.header.title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <nav class="bg-white shadow-md">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-blue-600">${t.header.title}</h1>
                        <p class="text-sm text-gray-600">${t.header.subtitle}</p>
                    </div>
                    <div class="flex gap-6">
                        <a href="/?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.home}</a>
                        <a href="/search?lang=${lang}" class="text-blue-600 font-semibold">${t.header.nav.search}</a>
                        <a href="/company?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.company}</a>
                        <a href="/marketplace?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.marketplace}</a>
                        <a href="/admin?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.admin}</a>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container mx-auto px-4 py-8">
            <h2 class="text-3xl font-bold mb-8">${t.search.title}</h2>
            
            <div id="upload-area" class="border-4 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition mb-8">
                <i class="fas fa-cloud-upload-alt text-6xl text-gray-400 mb-4"></i>
                <h3 class="text-xl font-semibold mb-2">${t.search.uploadTitle}</h3>
                <p class="text-gray-600 mb-4">${t.search.uploadDesc}</p>
                <button class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                    ${t.search.uploadButton}
                </button>
                <input type="file" id="file-input" accept="image/*" multiple class="hidden">
            </div>
            
            <div id="loading" class="hidden text-center py-8">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
                <p class="text-gray-600 mt-4">${t.search.analyzing}</p>
            </div>
            
            <div id="results"></div>
        </div>

        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

// Company registration page
app.get('/company', (c) => {
  const lang = (c.req.query('lang') as Language) || 'ko'
  const t = getTranslation(lang)
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.company.title} - ${t.header.title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <nav class="bg-white shadow-md">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-blue-600">${t.header.title}</h1>
                        <p class="text-sm text-gray-600">${t.header.subtitle}</p>
                    </div>
                    <div class="flex gap-6">
                        <a href="/?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.home}</a>
                        <a href="/search?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.search}</a>
                        <a href="/company?lang=${lang}" class="text-blue-600 font-semibold">${t.header.nav.company}</a>
                        <a href="/marketplace?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.marketplace}</a>
                        <a href="/admin?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.admin}</a>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container mx-auto px-4 py-8">
            <h2 class="text-3xl font-bold mb-8">${t.company.register}</h2>
            
            <form id="company-form" class="bg-white p-8 rounded-lg shadow max-w-3xl mx-auto">
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-semibold mb-2">${t.company.form.name} *</label>
                        <input type="text" name="name" required class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">${t.company.form.email} *</label>
                        <input type="email" name="email" required class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">${t.company.form.phone}</label>
                        <input type="tel" name="phone" class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">${t.company.form.website}</label>
                        <input type="url" name="website" class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">${t.company.form.contact}</label>
                        <input type="text" name="contact_person" class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">${t.company.form.established}</label>
                        <input type="number" name="established_year" min="1900" max="2024" class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">${t.company.form.revenue}</label>
                        <input type="text" name="annual_revenue" class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold mb-2">${t.company.form.employees}</label>
                        <input type="number" name="employee_count" class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                
                <div class="mt-6">
                    <label class="block text-sm font-semibold mb-2">${t.company.form.address}</label>
                    <input type="text" name="address" class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div class="mt-6">
                    <label class="block text-sm font-semibold mb-2">${t.company.form.description}</label>
                    <textarea name="description" rows="4" class="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                
                <div class="mt-8">
                    <button type="submit" class="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600">
                        ${t.company.form.submit}
                    </button>
                </div>
            </form>
        </div>

        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

// Marketplace page
app.get('/marketplace', (c) => {
  const lang = (c.req.query('lang') as Language) || 'ko'
  const t = getTranslation(lang)
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.marketplace.title} - ${t.header.title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <nav class="bg-white shadow-md">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-blue-600">${t.header.title}</h1>
                        <p class="text-sm text-gray-600">${t.header.subtitle}</p>
                    </div>
                    <div class="flex gap-6">
                        <a href="/?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.home}</a>
                        <a href="/search?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.search}</a>
                        <a href="/company?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.company}</a>
                        <a href="/marketplace?lang=${lang}" class="text-blue-600 font-semibold">${t.header.nav.marketplace}</a>
                        <a href="/admin?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.admin}</a>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container mx-auto px-4 py-8">
            <h2 class="text-3xl font-bold mb-8">${t.marketplace.title}</h2>
            
            <div class="flex gap-4 mb-8">
                <a href="/marketplace?lang=${lang}" class="px-4 py-2 bg-blue-500 text-white rounded">${t.marketplace.categories.all}</a>
                <a href="/marketplace?type=tech_sale&lang=${lang}" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">${t.marketplace.categories.forSale}</a>
                <a href="/marketplace?type=equity_sale&lang=${lang}" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">${t.marketplace.categories.equity}</a>
                <a href="/marketplace?type=collaboration&lang=${lang}" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">${t.marketplace.categories.collaboration}</a>
                <a href="/marketplace?type=oem_odm&lang=${lang}" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">${t.marketplace.categories.oem}</a>
            </div>
            
            <div id="listings">
                <p class="text-center text-gray-500">${t.common.loading}</p>
            </div>
        </div>

        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

// Admin page
app.get('/admin', (c) => {
  const lang = (c.req.query('lang') as Language) || 'ko'
  const t = getTranslation(lang)
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.admin.title} - ${t.header.title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <nav class="bg-white shadow-md">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold text-blue-600">${t.header.title}</h1>
                        <p class="text-sm text-gray-600">${t.header.subtitle}</p>
                    </div>
                    <div class="flex gap-6">
                        <a href="/?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.home}</a>
                        <a href="/search?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.search}</a>
                        <a href="/company?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.company}</a>
                        <a href="/marketplace?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.marketplace}</a>
                        <a href="/admin?lang=${lang}" class="text-blue-600 font-semibold">${t.header.nav.admin}</a>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container mx-auto px-4 py-8">
            <h2 class="text-3xl font-bold mb-8">${t.admin.dashboard.title}</h2>
            
            <div id="admin-stats">
                <p class="text-center text-gray-500">${t.common.loading}</p>
            </div>
        </div>

        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
