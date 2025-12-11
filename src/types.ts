// Type definitions for TechFinder Platform
import type { Language } from './lib/i18n';

export interface Env {
  DB: D1Database;
}

export interface Company {
  id: number;
  name: string;
  name_en?: string;
  name_zh?: string;
  name_ja?: string;
  name_vi?: string;
  name_mn?: string;
  name_ru?: string;
  description?: string;
  description_en?: string;
  description_zh?: string;
  description_ja?: string;
  description_vi?: string;
  description_mn?: string;
  description_ru?: string;
  contact_person?: string;
  email: string;
  phone?: string;
  website?: string;
  established_year?: number;
  annual_revenue?: string;
  employee_count?: number;
  address?: string;
  country?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface CompanyCertification {
  id: number;
  company_id: number;
  certification_type: string;
  certification_number?: string;
  issued_date?: string;
  expiry_date?: string;
}

export interface CompanyPatent {
  id: number;
  company_id: number;
  patent_number: string;
  patent_title?: string;
  patent_title_en?: string;
  patent_title_zh?: string;
  patent_title_ja?: string;
  patent_title_vi?: string;
  patent_title_mn?: string;
  patent_title_ru?: string;
  filed_date?: string;
  granted_date?: string;
  country?: string;
}

export interface TechnologyCategory {
  id: number;
  parent_id?: number;
  name: string;
  name_en?: string;
  name_zh?: string;
  name_ja?: string;
  name_vi?: string;
  name_mn?: string;
  name_ru?: string;
  level: number;
}

export interface CompanyTechnology {
  id: number;
  company_id: number;
  category_id: number;
  technology_name: string;
  technology_name_en?: string;
  technology_name_zh?: string;
  technology_name_ja?: string;
  technology_name_vi?: string;
  technology_name_mn?: string;
  technology_name_ru?: string;
  description?: string;
  maturity_level?: string;
}

export interface TechnologyListing {
  id: number;
  company_id: number;
  technology_id?: number;
  listing_type: 'tech_sale' | 'equity_sale' | 'collaboration' | 'oem_odm';
  title: string;
  title_en?: string;
  title_zh?: string;
  title_ja?: string;
  title_vi?: string;
  title_mn?: string;
  title_ru?: string;
  description: string;
  description_en?: string;
  description_zh?: string;
  description_ja?: string;
  description_vi?: string;
  description_mn?: string;
  description_ru?: string;
  price_range?: string;
  location?: string;
  status: 'active' | 'closed' | 'pending';
  views: number;
  created_at: string;
  updated_at: string;
}

export interface ImageSearchLog {
  id: number;
  session_id?: string;
  image_url?: string;
  analysis_result?: string;
  detected_category?: string;
  detected_features?: string;
  search_timestamp: string;
}

export interface MatchResult {
  id: number;
  search_log_id?: number;
  company_id: number;
  match_score: number;
  match_reason?: string;
  is_contacted: boolean;
  created_at: string;
}

export interface ConsultationRequest {
  id: number;
  company_id: number;
  requester_name: string;
  requester_email: string;
  requester_phone?: string;
  message?: string;
  status: 'pending' | 'responded' | 'closed';
  created_at: string;
}

export interface UserAnalytics {
  id: number;
  session_id?: string;
  event_type: string;
  event_data?: string;
  user_agent?: string;
  ip_address?: string;
  language?: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Detailed company with related data
export interface CompanyDetail extends Company {
  certifications: CompanyCertification[];
  patents: CompanyPatent[];
  technologies: (CompanyTechnology & { category?: TechnologyCategory })[];
}

// Match result with company detail
export interface MatchResultDetail extends MatchResult {
  company: CompanyDetail;
}

// Image analysis result
export interface ImageAnalysisResult {
  category?: string;
  features: string[];
  keywords: string[];
  detected_text?: string[];
  confidence: number;
}
