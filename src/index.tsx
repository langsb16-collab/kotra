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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.header.title} - ${t.header.subtitle}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <div id="app">
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
                            <a href="/admin?lang=${lang}" class="text-gray-700 hover:text-blue-600">${t.header.nav.admin}</a>
                        </div>
                        <div class="flex gap-2">
                            <a href="/?lang=ko" class="px-2 py-1 ${lang === 'ko' ? 'bg-blue-500 text-white' : 'text-gray-600'} rounded">한</a>
                            <a href="/?lang=en" class="px-2 py-1 ${lang === 'en' ? 'bg-blue-500 text-white' : 'text-gray-600'} rounded">EN</a>
                            <a href="/?lang=zh" class="px-2 py-1 ${lang === 'zh' ? 'bg-blue-500 text-white' : 'text-gray-600'} rounded">中</a>
                            <a href="/?lang=ja" class="px-2 py-1 ${lang === 'ja' ? 'bg-blue-500 text-white' : 'text-gray-600'} rounded">日</a>
                            <a href="/?lang=vi" class="px-2 py-1 ${lang === 'vi' ? 'bg-blue-500 text-white' : 'text-gray-600'} rounded">VI</a>
                            <a href="/?lang=mn" class="px-2 py-1 ${lang === 'mn' ? 'bg-blue-500 text-white' : 'text-gray-600'} rounded">MN</a>
                            <a href="/?lang=ru" class="px-2 py-1 ${lang === 'ru' ? 'bg-blue-500 text-white' : 'text-gray-600'} rounded">RU</a>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Hero Section -->
            <section class="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20">
                <div class="container mx-auto px-4 text-center">
                    <h2 class="text-4xl md:text-5xl font-bold mb-6">${t.home.hero.title}</h2>
                    <p class="text-xl mb-8">${t.home.hero.subtitle}</p>
                    <a href="/search?lang=${lang}" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block">
                        <i class="fas fa-camera mr-2"></i>${t.home.hero.uploadButton}
                    </a>
                </div>
            </section>

            <!-- How It Works -->
            <section class="py-16">
                <div class="container mx-auto px-4">
                    <h3 class="text-3xl font-bold text-center mb-12">${t.home.howItWorks.title}</h3>
                    <div class="grid md:grid-cols-3 gap-8">
                        <div class="text-center">
                            <div class="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-camera text-3xl text-blue-600"></i>
                            </div>
                            <h4 class="text-xl font-bold mb-2">${t.home.howItWorks.step1.title}</h4>
                            <p class="text-gray-600">${t.home.howItWorks.step1.desc}</p>
                        </div>
                        <div class="text-center">
                            <div class="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-brain text-3xl text-blue-600"></i>
                            </div>
                            <h4 class="text-xl font-bold mb-2">${t.home.howItWorks.step2.title}</h4>
                            <p class="text-gray-600">${t.home.howItWorks.step2.desc}</p>
                        </div>
                        <div class="text-center">
                            <div class="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-handshake text-3xl text-blue-600"></i>
                            </div>
                            <h4 class="text-xl font-bold mb-2">${t.home.howItWorks.step3.title}</h4>
                            <p class="text-gray-600">${t.home.howItWorks.step3.desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Features -->
            <section class="bg-gray-100 py-16">
                <div class="container mx-auto px-4">
                    <h3 class="text-3xl font-bold text-center mb-12">${t.home.features.title}</h3>
                    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div class="bg-white p-6 rounded-lg shadow">
                            <i class="fas fa-image text-3xl text-blue-600 mb-4"></i>
                            <h4 class="text-lg font-bold mb-2">${t.home.features.feature1.title}</h4>
                            <p class="text-gray-600">${t.home.features.feature1.desc}</p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow">
                            <i class="fas fa-exchange-alt text-3xl text-blue-600 mb-4"></i>
                            <h4 class="text-lg font-bold mb-2">${t.home.features.feature2.title}</h4>
                            <p class="text-gray-600">${t.home.features.feature2.desc}</p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow">
                            <i class="fas fa-industry text-3xl text-blue-600 mb-4"></i>
                            <h4 class="text-lg font-bold mb-2">${t.home.features.feature3.title}</h4>
                            <p class="text-gray-600">${t.home.features.feature3.desc}</p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow">
                            <i class="fas fa-globe text-3xl text-blue-600 mb-4"></i>
                            <h4 class="text-lg font-bold mb-2">${t.home.features.feature4.title}</h4>
                            <p class="text-gray-600">${t.home.features.feature4.desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Stats -->
            <section class="py-16">
                <div class="container mx-auto px-4">
                    <div class="grid md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div class="text-4xl font-bold text-blue-600 mb-2">150+</div>
                            <div class="text-gray-600">${t.home.stats.companies}</div>
                        </div>
                        <div>
                            <div class="text-4xl font-bold text-blue-600 mb-2">500+</div>
                            <div class="text-gray-600">${t.home.stats.technologies}</div>
                        </div>
                        <div>
                            <div class="text-4xl font-bold text-blue-600 mb-2">1,200+</div>
                            <div class="text-gray-600">${t.home.stats.matches}</div>
                        </div>
                        <div>
                            <div class="text-4xl font-bold text-blue-600 mb-2">15+</div>
                            <div class="text-gray-600">${t.home.stats.countries}</div>
                        </div>
                    </div>
                </div>
            </section>

            <footer class="bg-gray-800 text-white py-8">
                <div class="container mx-auto px-4 text-center">
                    <p>&copy; 2024 ${t.header.title}. All rights reserved.</p>
                </div>
            </footer>
        </div>

        <script>
            // Track page view
            fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_type: 'page_view',
                    event_data: { page: 'home', lang: '${lang}' },
                    language: '${lang}'
                })
            });
        </script>
    </body>
    </html>
  `)
})

export default app
