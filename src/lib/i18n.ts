// 7개 국어 지원: 한국어, 영어, 중국어, 일본어, 베트남어, 몽골어, 러시아어
export type Language = 'ko' | 'en' | 'zh' | 'ja' | 'vi' | 'mn' | 'ru';

export interface Translation {
  // 헤더 & 네비게이션
  header: {
    title: string;
    subtitle: string;
    nav: {
      home: string;
      search: string;
      company: string;
      marketplace: string;
      admin: string;
    };
    language: string;
  };
  
  // 메인 페이지
  home: {
    hero: {
      title: string;
      subtitle: string;
      uploadButton: string;
    };
    howItWorks: {
      title: string;
      step1: { title: string; desc: string };
      step2: { title: string; desc: string };
      step3: { title: string; desc: string };
    };
    features: {
      title: string;
      feature1: { title: string; desc: string };
      feature2: { title: string; desc: string };
      feature3: { title: string; desc: string };
      feature4: { title: string; desc: string };
    };
    stats: {
      companies: string;
      technologies: string;
      matches: string;
      countries: string;
    };
  };
  
  // 검색 페이지
  search: {
    title: string;
    uploadTitle: string;
    uploadDesc: string;
    uploadButton: string;
    analyzing: string;
    results: string;
    noResults: string;
    company: string;
    contact: string;
    established: string;
    revenue: string;
    certifications: string;
    patents: string;
    capabilities: string;
    contactButton: string;
  };
  
  // 기업 센터
  company: {
    title: string;
    register: string;
    myCompany: string;
    form: {
      name: string;
      description: string;
      contact: string;
      email: string;
      phone: string;
      website: string;
      established: string;
      revenue: string;
      employees: string;
      address: string;
      certifications: string;
      patents: string;
      technologies: string;
      submit: string;
    };
  };
  
  // 기술 거래소
  marketplace: {
    title: string;
    categories: {
      all: string;
      forSale: string;
      equity: string;
      collaboration: string;
      oem: string;
    };
    filters: {
      industry: string;
      priceRange: string;
      location: string;
    };
    card: {
      seller: string;
      price: string;
      location: string;
      viewDetails: string;
      contact: string;
    };
  };
  
  // 관리자
  admin: {
    title: string;
    dashboard: {
      title: string;
      totalCompanies: string;
      totalTechnologies: string;
      totalMatches: string;
      pendingApprovals: string;
    };
    companies: {
      title: string;
      approve: string;
      reject: string;
      edit: string;
      delete: string;
    };
    technologies: {
      title: string;
      category: string;
      manage: string;
    };
    analytics: {
      title: string;
      searchPatterns: string;
      matchRate: string;
      userBehavior: string;
    };
  };
  
  // 결제 (USDT)
  payment: {
    title: string;
    usdt: string;
    wallet: string;
    amount: string;
    network: string;
    sendTo: string;
    transactionHash: string;
    status: string;
    pending: string;
    confirming: string;
    completed: string;
    failed: string;
    payNow: string;
    paymentProof: string;
    uploadProof: string;
    confirmPayment: string;
    viewTransaction: string;
    platformFee: string;
    total: string;
    buyer: string;
    seller: string;
    escrow: string;
    releasePayment: string;
  };
  
  // 공통
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
    download: string;
    upload: string;
    search: string;
    filter: string;
    sort: string;
    next: string;
    previous: string;
    close: string;
  };
}

export const translations: Record<Language, Translation> = {
  ko: {
    header: {
      title: 'TechFinder',
      subtitle: '원천기술 매칭 플랫폼',
      nav: {
        home: '홈',
        search: '기술 탐색',
        company: '기업 센터',
        marketplace: '기술 거래소',
        admin: '관리자',
      },
      language: '언어',
    },
    home: {
      hero: {
        title: '사진만 올리면, 원천기술 보유 기업이 자동으로 찾아집니다',
        subtitle: '기술 매각·OEM·협업까지 바로 연결되는 플랫폼',
        uploadButton: '사진 업로드하고 시작하기',
      },
      howItWorks: {
        title: '어떻게 작동하나요?',
        step1: { title: '사진 촬영', desc: '휴대폰으로 제품·설비·부품을 촬영합니다' },
        step2: { title: 'AI 분석', desc: 'AI가 이미지를 분석하여 기술을 식별합니다' },
        step3: { title: '기업 매칭', desc: '원천기술 보유 중소기업을 자동으로 추천합니다' },
      },
      features: {
        title: '핵심 기능',
        feature1: { title: '이미지 기반 검색', desc: '사진만으로 원천기술 기업을 찾습니다' },
        feature2: { title: '기술 매각 중개', desc: '기술 이전 및 지분 거래를 지원합니다' },
        feature3: { title: 'OEM/ODM 매칭', desc: '실시간 견적 요청 및 발주가 가능합니다' },
        feature4: { title: '글로벌 네트워크', desc: '7개 국어로 전 세계 바이어와 연결됩니다' },
      },
      stats: {
        companies: '등록 기업',
        technologies: '보유 기술',
        matches: '매칭 성공',
        countries: '진출 국가',
      },
    },
    search: {
      title: '기술 탐색',
      uploadTitle: '제품 사진을 업로드하세요',
      uploadDesc: '최대 10장, 각 20MB 이하 (JPG, PNG, WEBP)',
      uploadButton: '사진 선택',
      analyzing: '분석 중...',
      results: '검색 결과',
      noResults: '검색 결과가 없습니다',
      company: '회사명',
      contact: '연락처',
      established: '설립연도',
      revenue: '연매출',
      certifications: '인증',
      patents: '특허',
      capabilities: '제조 능력',
      contactButton: '상담 요청',
    },
    company: {
      title: '기업 센터',
      register: '기업 등록',
      myCompany: '내 기업',
      form: {
        name: '회사명',
        description: '회사 소개',
        contact: '담당자명',
        email: '이메일',
        phone: '전화번호',
        website: '홈페이지',
        established: '설립연도',
        revenue: '연매출',
        employees: '직원 수',
        address: '주소',
        certifications: '인증 (ISO9001, KC, CE 등)',
        patents: '특허 번호',
        technologies: '보유 기술 (쉼표로 구분)',
        submit: '등록하기',
      },
    },
    marketplace: {
      title: '기술 거래소',
      categories: {
        all: '전체',
        forSale: '기술 매각',
        equity: '지분 매각',
        collaboration: '공동 개발',
        oem: 'OEM/ODM',
      },
      filters: {
        industry: '산업 분야',
        priceRange: '가격 범위',
        location: '지역',
      },
      card: {
        seller: '판매자',
        price: '가격',
        location: '위치',
        viewDetails: '상세보기',
        contact: '문의하기',
      },
    },
    admin: {
      title: '관리자',
      dashboard: {
        title: '대시보드',
        totalCompanies: '전체 기업',
        totalTechnologies: '전체 기술',
        totalMatches: '전체 매칭',
        pendingApprovals: '승인 대기',
      },
      companies: {
        title: '기업 관리',
        approve: '승인',
        reject: '거부',
        edit: '수정',
        delete: '삭제',
      },
      technologies: {
        title: '기술 분류',
        category: '카테고리',
        manage: '관리',
      },
      analytics: {
        title: '분석',
        searchPatterns: '검색 패턴',
        matchRate: '매칭 성공률',
        userBehavior: '사용자 행동',
      },
    },
    payment: {
      title: '결제',
      usdt: 'USDT (테더)',
      wallet: '지갑 주소',
      amount: '금액',
      network: '네트워크',
      sendTo: '받는 주소',
      transactionHash: '트랜잭션 해시',
      status: '상태',
      pending: '대기 중',
      confirming: '확인 중',
      completed: '완료',
      failed: '실패',
      payNow: '지금 결제',
      paymentProof: '결제 증명',
      uploadProof: '증명서 업로드',
      confirmPayment: '결제 확인',
      viewTransaction: '거래 내역',
      platformFee: '플랫폼 수수료',
      total: '총액',
      buyer: '구매자',
      seller: '판매자',
      escrow: '에스크로',
      releasePayment: '결제 승인',
    },
    common: {
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      success: '성공했습니다',
      cancel: '취소',
      confirm: '확인',
      save: '저장',
      delete: '삭제',
      edit: '수정',
      view: '보기',
      download: '다운로드',
      upload: '업로드',
      search: '검색',
      filter: '필터',
      sort: '정렬',
      next: '다음',
      previous: '이전',
      close: '닫기',
    },
  },
  
  en: {
    header: {
      title: 'TechFinder',
      subtitle: 'Technology Matching Platform',
      nav: {
        home: 'Home',
        search: 'Search Tech',
        company: 'Company Center',
        marketplace: 'Marketplace',
        admin: 'Admin',
      },
      language: 'Language',
    },
    home: {
      hero: {
        title: 'Upload a photo, and find technology companies automatically',
        subtitle: 'Platform connecting tech sales, OEM, and collaboration',
        uploadButton: 'Upload Photo to Start',
      },
      howItWorks: {
        title: 'How It Works',
        step1: { title: 'Take Photo', desc: 'Capture products, equipment, or parts with your phone' },
        step2: { title: 'AI Analysis', desc: 'AI analyzes images to identify technologies' },
        step3: { title: 'Company Matching', desc: 'Automatically recommends SMEs with core technologies' },
      },
      features: {
        title: 'Key Features',
        feature1: { title: 'Image-based Search', desc: 'Find tech companies just by photos' },
        feature2: { title: 'Tech Transfer', desc: 'Support technology transfer and equity deals' },
        feature3: { title: 'OEM/ODM Matching', desc: 'Real-time quotation requests and orders' },
        feature4: { title: 'Global Network', desc: 'Connect with buyers worldwide in 7 languages' },
      },
      stats: {
        companies: 'Registered Companies',
        technologies: 'Technologies',
        matches: 'Successful Matches',
        countries: 'Countries',
      },
    },
    search: {
      title: 'Search Technology',
      uploadTitle: 'Upload Product Photos',
      uploadDesc: 'Max 10 images, 20MB each (JPG, PNG, WEBP)',
      uploadButton: 'Select Photos',
      analyzing: 'Analyzing...',
      results: 'Search Results',
      noResults: 'No results found',
      company: 'Company',
      contact: 'Contact',
      established: 'Established',
      revenue: 'Revenue',
      certifications: 'Certifications',
      patents: 'Patents',
      capabilities: 'Capabilities',
      contactButton: 'Request Consultation',
    },
    company: {
      title: 'Company Center',
      register: 'Register Company',
      myCompany: 'My Company',
      form: {
        name: 'Company Name',
        description: 'Company Description',
        contact: 'Contact Person',
        email: 'Email',
        phone: 'Phone',
        website: 'Website',
        established: 'Established Year',
        revenue: 'Annual Revenue',
        employees: 'Employees',
        address: 'Address',
        certifications: 'Certifications (ISO9001, KC, CE, etc.)',
        patents: 'Patent Numbers',
        technologies: 'Technologies (comma separated)',
        submit: 'Register',
      },
    },
    marketplace: {
      title: 'Technology Marketplace',
      categories: {
        all: 'All',
        forSale: 'Tech for Sale',
        equity: 'Equity Sale',
        collaboration: 'Collaboration',
        oem: 'OEM/ODM',
      },
      filters: {
        industry: 'Industry',
        priceRange: 'Price Range',
        location: 'Location',
      },
      card: {
        seller: 'Seller',
        price: 'Price',
        location: 'Location',
        viewDetails: 'View Details',
        contact: 'Contact',
      },
    },
    admin: {
      title: 'Admin',
      dashboard: {
        title: 'Dashboard',
        totalCompanies: 'Total Companies',
        totalTechnologies: 'Total Technologies',
        totalMatches: 'Total Matches',
        pendingApprovals: 'Pending Approvals',
      },
      companies: {
        title: 'Manage Companies',
        approve: 'Approve',
        reject: 'Reject',
        edit: 'Edit',
        delete: 'Delete',
      },
      technologies: {
        title: 'Technology Categories',
        category: 'Category',
        manage: 'Manage',
      },
      analytics: {
        title: 'Analytics',
        searchPatterns: 'Search Patterns',
        matchRate: 'Match Rate',
        userBehavior: 'User Behavior',
      },
    },
    payment: {
      title: 'Payment',
      usdt: 'USDT (Tether)',
      wallet: 'Wallet Address',
      amount: 'Amount',
      network: 'Network',
      sendTo: 'Send To',
      transactionHash: 'Transaction Hash',
      status: 'Status',
      pending: 'Pending',
      confirming: 'Confirming',
      completed: 'Completed',
      failed: 'Failed',
      payNow: 'Pay Now',
      paymentProof: 'Payment Proof',
      uploadProof: 'Upload Proof',
      confirmPayment: 'Confirm Payment',
      viewTransaction: 'View Transaction',
      platformFee: 'Platform Fee',
      total: 'Total',
      buyer: 'Buyer',
      seller: 'Seller',
      escrow: 'Escrow',
      releasePayment: 'Release Payment',
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      download: 'Download',
      upload: 'Upload',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
    },
  },
  
  zh: {
    header: {
      title: 'TechFinder',
      subtitle: '技术匹配平台',
      nav: {
        home: '首页',
        search: '技术搜索',
        company: '企业中心',
        marketplace: '技术交易所',
        admin: '管理员',
      },
      language: '语言',
    },
    home: {
      hero: {
        title: '只需上传照片，即可自动找到拥有核心技术的企业',
        subtitle: '连接技术销售、OEM和合作的平台',
        uploadButton: '上传照片开始',
      },
      howItWorks: {
        title: '如何运作',
        step1: { title: '拍照', desc: '用手机拍摄产品、设备或零件' },
        step2: { title: 'AI分析', desc: 'AI分析图像以识别技术' },
        step3: { title: '企业匹配', desc: '自动推荐拥有核心技术的中小企业' },
      },
      features: {
        title: '核心功能',
        feature1: { title: '基于图像搜索', desc: '仅通过照片即可找到技术企业' },
        feature2: { title: '技术转让', desc: '支持技术转让和股权交易' },
        feature3: { title: 'OEM/ODM匹配', desc: '实时报价请求和订单' },
        feature4: { title: '全球网络', desc: '以7种语言与全球买家联系' },
      },
      stats: {
        companies: '注册企业',
        technologies: '技术',
        matches: '成功匹配',
        countries: '国家',
      },
    },
    search: {
      title: '技术搜索',
      uploadTitle: '上传产品照片',
      uploadDesc: '最多10张，每张20MB (JPG, PNG, WEBP)',
      uploadButton: '选择照片',
      analyzing: '分析中...',
      results: '搜索结果',
      noResults: '未找到结果',
      company: '公司',
      contact: '联系方式',
      established: '成立年份',
      revenue: '营业额',
      certifications: '认证',
      patents: '专利',
      capabilities: '能力',
      contactButton: '请求咨询',
    },
    company: {
      title: '企业中心',
      register: '注册企业',
      myCompany: '我的企业',
      form: {
        name: '公司名称',
        description: '公司介绍',
        contact: '联系人',
        email: '电子邮件',
        phone: '电话',
        website: '网站',
        established: '成立年份',
        revenue: '年营业额',
        employees: '员工人数',
        address: '地址',
        certifications: '认证 (ISO9001, KC, CE等)',
        patents: '专利号',
        technologies: '技术 (逗号分隔)',
        submit: '注册',
      },
    },
    marketplace: {
      title: '技术交易所',
      categories: {
        all: '全部',
        forSale: '技术出售',
        equity: '股权出售',
        collaboration: '合作开发',
        oem: 'OEM/ODM',
      },
      filters: {
        industry: '行业',
        priceRange: '价格范围',
        location: '地区',
      },
      card: {
        seller: '卖家',
        price: '价格',
        location: '位置',
        viewDetails: '查看详情',
        contact: '联系',
      },
    },
    admin: {
      title: '管理员',
      dashboard: {
        title: '仪表板',
        totalCompanies: '总企业数',
        totalTechnologies: '总技术数',
        totalMatches: '总匹配数',
        pendingApprovals: '待审批',
      },
      companies: {
        title: '企业管理',
        approve: '批准',
        reject: '拒绝',
        edit: '编辑',
        delete: '删除',
      },
      technologies: {
        title: '技术分类',
        category: '类别',
        manage: '管理',
      },
      analytics: {
        title: '分析',
        searchPatterns: '搜索模式',
        matchRate: '匹配率',
        userBehavior: '用户行为',
      },
    },
    common: {
      loading: '加载中...',
      error: '发生错误',
      success: '成功',
      cancel: '取消',
      confirm: '确认',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      view: '查看',
      download: '下载',
      upload: '上传',
      search: '搜索',
      filter: '筛选',
      sort: '排序',
      next: '下一步',
      previous: '上一步',
      close: '关闭',
    },
  },
  
  ja: {
    header: {
      title: 'TechFinder',
      subtitle: '技術マッチングプラットフォーム',
      nav: {
        home: 'ホーム',
        search: '技術検索',
        company: '企業センター',
        marketplace: '技術取引所',
        admin: '管理者',
      },
      language: '言語',
    },
    home: {
      hero: {
        title: '写真をアップロードするだけで、コア技術を持つ企業が自動的に見つかります',
        subtitle: '技術販売・OEM・協業をつなぐプラットフォーム',
        uploadButton: '写真をアップロードして始める',
      },
      howItWorks: {
        title: '仕組み',
        step1: { title: '写真撮影', desc: '携帯電話で製品・設備・部品を撮影' },
        step2: { title: 'AI分析', desc: 'AIが画像を分析して技術を識別' },
        step3: { title: '企業マッチング', desc: 'コア技術を持つ中小企業を自動推奨' },
      },
      features: {
        title: '主な機能',
        feature1: { title: '画像ベース検索', desc: '写真だけで技術企業を検索' },
        feature2: { title: '技術移転', desc: '技術移転と株式取引をサポート' },
        feature3: { title: 'OEM/ODMマッチング', desc: 'リアルタイム見積依頼と発注' },
        feature4: { title: 'グローバルネットワーク', desc: '7言語で世界中のバイヤーとつながる' },
      },
      stats: {
        companies: '登録企業',
        technologies: '技術',
        matches: 'マッチング成功',
        countries: '進出国',
      },
    },
    search: {
      title: '技術検索',
      uploadTitle: '製品写真をアップロード',
      uploadDesc: '最大10枚、各20MB (JPG, PNG, WEBP)',
      uploadButton: '写真を選択',
      analyzing: '分析中...',
      results: '検索結果',
      noResults: '結果が見つかりません',
      company: '会社',
      contact: '連絡先',
      established: '設立年',
      revenue: '売上高',
      certifications: '認証',
      patents: '特許',
      capabilities: '能力',
      contactButton: '相談依頼',
    },
    company: {
      title: '企業センター',
      register: '企業登録',
      myCompany: 'マイ企業',
      form: {
        name: '会社名',
        description: '会社紹介',
        contact: '担当者名',
        email: 'メール',
        phone: '電話',
        website: 'ウェブサイト',
        established: '設立年',
        revenue: '年間売上高',
        employees: '従業員数',
        address: '住所',
        certifications: '認証 (ISO9001, KC, CEなど)',
        patents: '特許番号',
        technologies: '技術 (カンマ区切り)',
        submit: '登録',
      },
    },
    marketplace: {
      title: '技術取引所',
      categories: {
        all: 'すべて',
        forSale: '技術販売',
        equity: '株式売却',
        collaboration: '共同開発',
        oem: 'OEM/ODM',
      },
      filters: {
        industry: '業界',
        priceRange: '価格帯',
        location: '地域',
      },
      card: {
        seller: '販売者',
        price: '価格',
        location: '場所',
        viewDetails: '詳細を見る',
        contact: 'お問い合わせ',
      },
    },
    admin: {
      title: '管理者',
      dashboard: {
        title: 'ダッシュボード',
        totalCompanies: '総企業数',
        totalTechnologies: '総技術数',
        totalMatches: '総マッチング数',
        pendingApprovals: '承認待ち',
      },
      companies: {
        title: '企業管理',
        approve: '承認',
        reject: '却下',
        edit: '編集',
        delete: '削除',
      },
      technologies: {
        title: '技術分類',
        category: 'カテゴリー',
        manage: '管理',
      },
      analytics: {
        title: '分析',
        searchPatterns: '検索パターン',
        matchRate: 'マッチング率',
        userBehavior: 'ユーザー行動',
      },
    },
    common: {
      loading: '読み込み中...',
      error: 'エラーが発生しました',
      success: '成功',
      cancel: 'キャンセル',
      confirm: '確認',
      save: '保存',
      delete: '削除',
      edit: '編集',
      view: '表示',
      download: 'ダウンロード',
      upload: 'アップロード',
      search: '検索',
      filter: 'フィルター',
      sort: '並び替え',
      next: '次へ',
      previous: '前へ',
      close: '閉じる',
    },
  },
  
  vi: {
    header: {
      title: 'TechFinder',
      subtitle: 'Nền tảng Kết nối Công nghệ',
      nav: {
        home: 'Trang chủ',
        search: 'Tìm Công nghệ',
        company: 'Trung tâm Doanh nghiệp',
        marketplace: 'Chợ Công nghệ',
        admin: 'Quản trị',
      },
      language: 'Ngôn ngữ',
    },
    home: {
      hero: {
        title: 'Tải lên ảnh và tự động tìm doanh nghiệp sở hữu công nghệ cốt lõi',
        subtitle: 'Nền tảng kết nối bán công nghệ, OEM và hợp tác',
        uploadButton: 'Tải ảnh lên để bắt đầu',
      },
      howItWorks: {
        title: 'Cách hoạt động',
        step1: { title: 'Chụp ảnh', desc: 'Chụp sản phẩm, thiết bị hoặc linh kiện bằng điện thoại' },
        step2: { title: 'Phân tích AI', desc: 'AI phân tích hình ảnh để nhận dạng công nghệ' },
        step3: { title: 'Kết nối Doanh nghiệp', desc: 'Tự động đề xuất doanh nghiệp SME có công nghệ cốt lõi' },
      },
      features: {
        title: 'Tính năng chính',
        feature1: { title: 'Tìm kiếm bằng hình ảnh', desc: 'Tìm doanh nghiệp công nghệ chỉ bằng ảnh' },
        feature2: { title: 'Chuyển giao Công nghệ', desc: 'Hỗ trợ chuyển giao công nghệ và giao dịch vốn' },
        feature3: { title: 'Kết nối OEM/ODM', desc: 'Yêu cầu báo giá và đặt hàng theo thời gian thực' },
        feature4: { title: 'Mạng lưới Toàn cầu', desc: 'Kết nối với người mua trên toàn thế giới bằng 7 ngôn ngữ' },
      },
      stats: {
        companies: 'Doanh nghiệp đăng ký',
        technologies: 'Công nghệ',
        matches: 'Kết nối thành công',
        countries: 'Quốc gia',
      },
    },
    search: {
      title: 'Tìm kiếm Công nghệ',
      uploadTitle: 'Tải lên ảnh sản phẩm',
      uploadDesc: 'Tối đa 10 ảnh, mỗi ảnh 20MB (JPG, PNG, WEBP)',
      uploadButton: 'Chọn ảnh',
      analyzing: 'Đang phân tích...',
      results: 'Kết quả tìm kiếm',
      noResults: 'Không tìm thấy kết quả',
      company: 'Công ty',
      contact: 'Liên hệ',
      established: 'Năm thành lập',
      revenue: 'Doanh thu',
      certifications: 'Chứng nhận',
      patents: 'Bằng sáng chế',
      capabilities: 'Khả năng',
      contactButton: 'Yêu cầu tư vấn',
    },
    company: {
      title: 'Trung tâm Doanh nghiệp',
      register: 'Đăng ký Doanh nghiệp',
      myCompany: 'Doanh nghiệp của tôi',
      form: {
        name: 'Tên công ty',
        description: 'Giới thiệu công ty',
        contact: 'Người liên hệ',
        email: 'Email',
        phone: 'Điện thoại',
        website: 'Website',
        established: 'Năm thành lập',
        revenue: 'Doanh thu hàng năm',
        employees: 'Số nhân viên',
        address: 'Địa chỉ',
        certifications: 'Chứng nhận (ISO9001, KC, CE, v.v.)',
        patents: 'Số bằng sáng chế',
        technologies: 'Công nghệ (phân tách bằng dấu phẩy)',
        submit: 'Đăng ký',
      },
    },
    marketplace: {
      title: 'Chợ Công nghệ',
      categories: {
        all: 'Tất cả',
        forSale: 'Bán Công nghệ',
        equity: 'Bán Vốn',
        collaboration: 'Hợp tác',
        oem: 'OEM/ODM',
      },
      filters: {
        industry: 'Ngành',
        priceRange: 'Khoảng giá',
        location: 'Khu vực',
      },
      card: {
        seller: 'Người bán',
        price: 'Giá',
        location: 'Vị trí',
        viewDetails: 'Xem chi tiết',
        contact: 'Liên hệ',
      },
    },
    admin: {
      title: 'Quản trị',
      dashboard: {
        title: 'Bảng điều khiển',
        totalCompanies: 'Tổng số doanh nghiệp',
        totalTechnologies: 'Tổng số công nghệ',
        totalMatches: 'Tổng số kết nối',
        pendingApprovals: 'Đang chờ phê duyệt',
      },
      companies: {
        title: 'Quản lý Doanh nghiệp',
        approve: 'Phê duyệt',
        reject: 'Từ chối',
        edit: 'Chỉnh sửa',
        delete: 'Xóa',
      },
      technologies: {
        title: 'Danh mục Công nghệ',
        category: 'Danh mục',
        manage: 'Quản lý',
      },
      analytics: {
        title: 'Phân tích',
        searchPatterns: 'Mẫu tìm kiếm',
        matchRate: 'Tỷ lệ kết nối',
        userBehavior: 'Hành vi người dùng',
      },
    },
    common: {
      loading: 'Đang tải...',
      error: 'Đã xảy ra lỗi',
      success: 'Thành công',
      cancel: 'Hủy',
      confirm: 'Xác nhận',
      save: 'Lưu',
      delete: 'Xóa',
      edit: 'Chỉnh sửa',
      view: 'Xem',
      download: 'Tải xuống',
      upload: 'Tải lên',
      search: 'Tìm kiếm',
      filter: 'Lọc',
      sort: 'Sắp xếp',
      next: 'Tiếp theo',
      previous: 'Trước',
      close: 'Đóng',
    },
  },
  
  mn: {
    header: {
      title: 'TechFinder',
      subtitle: 'Технологи холбох платформ',
      nav: {
        home: 'Нүүр',
        search: 'Технологи хайх',
        company: 'Компанийн төв',
        marketplace: 'Технологийн зах',
        admin: 'Админ',
      },
      language: 'Хэл',
    },
    home: {
      hero: {
        title: 'Зураг оруулаад үндсэн технологитой компаниудыг автоматаар олоорой',
        subtitle: 'Технологи борлуулах, OEM болон хамтын ажиллагааг холбох платформ',
        uploadButton: 'Зураг оруулж эхлэх',
      },
      howItWorks: {
        title: 'Хэрхэн ажилладаг',
        step1: { title: 'Зураг авах', desc: 'Утсаараа бүтээгдэхүүн, тоног төхөөрөмж, эд ангиудыг авна' },
        step2: { title: 'AI шинжилгээ', desc: 'AI зургийг шинжилж технологийг тодорхойлно' },
        step3: { title: 'Компани холбох', desc: 'Үндсэн технологитой ЖДҮ-ийг автоматаар санал болгоно' },
      },
      features: {
        title: 'Гол боломжууд',
        feature1: { title: 'Зургаар хайх', desc: 'Зургаар л технологийн компани олох' },
        feature2: { title: 'Технологи шилжүүлэх', desc: 'Технологи шилжүүлэх болон хувьцаа арилжааг дэмжинэ' },
        feature3: { title: 'OEM/ODM холбох', desc: 'Бодит цагийн үнийн санал болон захиалга' },
        feature4: { title: 'Дэлхийн сүлжээ', desc: '7 хэлээр дэлхийн худалдан авагчидтай холбогдоно' },
      },
      stats: {
        companies: 'Бүртгэлтэй компани',
        technologies: 'Технологи',
        matches: 'Амжилттай холболт',
        countries: 'Улс орнууд',
      },
    },
    search: {
      title: 'Технологи хайх',
      uploadTitle: 'Бүтээгдэхүүний зураг оруулах',
      uploadDesc: 'Хамгийн ихдээ 10 зураг, тус бүр 20MB (JPG, PNG, WEBP)',
      uploadButton: 'Зураг сонгох',
      analyzing: 'Шинжилж байна...',
      results: 'Хайлтын үр дүн',
      noResults: 'Үр дүн олдсонгүй',
      company: 'Компани',
      contact: 'Холбоо барих',
      established: 'Байгуулагдсан он',
      revenue: 'Орлого',
      certifications: 'Гэрчилгээ',
      patents: 'Патент',
      capabilities: 'Чадавхи',
      contactButton: 'Зөвлөгөө авах',
    },
    company: {
      title: 'Компанийн төв',
      register: 'Компани бүртгэх',
      myCompany: 'Миний компани',
      form: {
        name: 'Компанийн нэр',
        description: 'Компанийн тодорхойлолт',
        contact: 'Холбогдох хүн',
        email: 'Имэйл',
        phone: 'Утас',
        website: 'Вэбсайт',
        established: 'Байгуулагдсан он',
        revenue: 'Жилийн орлого',
        employees: 'Ажилтны тоо',
        address: 'Хаяг',
        certifications: 'Гэрчилгээ (ISO9001, KC, CE гэх мэт)',
        patents: 'Патентын дугаар',
        technologies: 'Технологи (таслалаар тусгаарлах)',
        submit: 'Бүртгэх',
      },
    },
    marketplace: {
      title: 'Технологийн зах',
      categories: {
        all: 'Бүгд',
        forSale: 'Технологи борлуулах',
        equity: 'Хувьцаа борлуулах',
        collaboration: 'Хамтран хөгжүүлэх',
        oem: 'OEM/ODM',
      },
      filters: {
        industry: 'Салбар',
        priceRange: 'Үнийн хүрээ',
        location: 'Байршил',
      },
      card: {
        seller: 'Борлуулагч',
        price: 'Үнэ',
        location: 'Байршил',
        viewDetails: 'Дэлгэрэнгүй',
        contact: 'Холбогдох',
      },
    },
    admin: {
      title: 'Админ',
      dashboard: {
        title: 'Хяналтын самбар',
        totalCompanies: 'Нийт компани',
        totalTechnologies: 'Нийт технологи',
        totalMatches: 'Нийт холболт',
        pendingApprovals: 'Батлах хүлээлттэй',
      },
      companies: {
        title: 'Компани удирдах',
        approve: 'Батлах',
        reject: 'Татгалзах',
        edit: 'Засах',
        delete: 'Устгах',
      },
      technologies: {
        title: 'Технологийн ангилал',
        category: 'Ангилал',
        manage: 'Удирдах',
      },
      analytics: {
        title: 'Шинжилгээ',
        searchPatterns: 'Хайлтын хэв маяг',
        matchRate: 'Холболтын хувь',
        userBehavior: 'Хэрэглэгчийн үйлдэл',
      },
    },
    common: {
      loading: 'Ачааллаж байна...',
      error: 'Алдаа гарлаа',
      success: 'Амжилттай',
      cancel: 'Цуцлах',
      confirm: 'Батлах',
      save: 'Хадгалах',
      delete: 'Устгах',
      edit: 'Засах',
      view: 'Үзэх',
      download: 'Татаж авах',
      upload: 'Оруулах',
      search: 'Хайх',
      filter: 'Шүүх',
      sort: 'Эрэмбэлэх',
      next: 'Дараах',
      previous: 'Өмнөх',
      close: 'Хаах',
    },
  },
  
  ru: {
    header: {
      title: 'TechFinder',
      subtitle: 'Платформа подбора технологий',
      nav: {
        home: 'Главная',
        search: 'Поиск технологий',
        company: 'Центр компаний',
        marketplace: 'Биржа технологий',
        admin: 'Админ',
      },
      language: 'Язык',
    },
    home: {
      hero: {
        title: 'Загрузите фото и автоматически найдите компании с ключевыми технологиями',
        subtitle: 'Платформа, связывающая продажу технологий, OEM и сотрудничество',
        uploadButton: 'Загрузить фото для начала',
      },
      howItWorks: {
        title: 'Как это работает',
        step1: { title: 'Сделать фото', desc: 'Сфотографируйте продукты, оборудование или детали телефоном' },
        step2: { title: 'AI-анализ', desc: 'AI анализирует изображения для определения технологий' },
        step3: { title: 'Подбор компаний', desc: 'Автоматически рекомендует МСП с ключевыми технологиями' },
      },
      features: {
        title: 'Ключевые функции',
        feature1: { title: 'Поиск по изображению', desc: 'Найдите технологические компании просто по фото' },
        feature2: { title: 'Передача технологий', desc: 'Поддержка передачи технологий и сделок с акциями' },
        feature3: { title: 'OEM/ODM подбор', desc: 'Запрос цен и заказы в реальном времени' },
        feature4: { title: 'Глобальная сеть', desc: 'Связь с покупателями по всему миру на 7 языках' },
      },
      stats: {
        companies: 'Зарегистрированных компаний',
        technologies: 'Технологий',
        matches: 'Успешных совпадений',
        countries: 'Стран',
      },
    },
    search: {
      title: 'Поиск технологий',
      uploadTitle: 'Загрузить фото продукта',
      uploadDesc: 'Макс. 10 изображений, по 20 МБ (JPG, PNG, WEBP)',
      uploadButton: 'Выбрать фото',
      analyzing: 'Анализ...',
      results: 'Результаты поиска',
      noResults: 'Результаты не найдены',
      company: 'Компания',
      contact: 'Контакты',
      established: 'Год основания',
      revenue: 'Выручка',
      certifications: 'Сертификаты',
      patents: 'Патенты',
      capabilities: 'Возможности',
      contactButton: 'Запросить консультацию',
    },
    company: {
      title: 'Центр компаний',
      register: 'Зарегистрировать компанию',
      myCompany: 'Моя компания',
      form: {
        name: 'Название компании',
        description: 'Описание компании',
        contact: 'Контактное лицо',
        email: 'Email',
        phone: 'Телефон',
        website: 'Веб-сайт',
        established: 'Год основания',
        revenue: 'Годовая выручка',
        employees: 'Количество сотрудников',
        address: 'Адрес',
        certifications: 'Сертификаты (ISO9001, KC, CE и т.д.)',
        patents: 'Номера патентов',
        technologies: 'Технологии (через запятую)',
        submit: 'Зарегистрировать',
      },
    },
    marketplace: {
      title: 'Биржа технологий',
      categories: {
        all: 'Все',
        forSale: 'Продажа технологий',
        equity: 'Продажа акций',
        collaboration: 'Сотрудничество',
        oem: 'OEM/ODM',
      },
      filters: {
        industry: 'Отрасль',
        priceRange: 'Диапазон цен',
        location: 'Местоположение',
      },
      card: {
        seller: 'Продавец',
        price: 'Цена',
        location: 'Местоположение',
        viewDetails: 'Подробнее',
        contact: 'Связаться',
      },
    },
    admin: {
      title: 'Админ',
      dashboard: {
        title: 'Панель управления',
        totalCompanies: 'Всего компаний',
        totalTechnologies: 'Всего технологий',
        totalMatches: 'Всего совпадений',
        pendingApprovals: 'Ожидают утверждения',
      },
      companies: {
        title: 'Управление компаниями',
        approve: 'Утвердить',
        reject: 'Отклонить',
        edit: 'Редактировать',
        delete: 'Удалить',
      },
      technologies: {
        title: 'Категории технологий',
        category: 'Категория',
        manage: 'Управление',
      },
      analytics: {
        title: 'Аналитика',
        searchPatterns: 'Шаблоны поиска',
        matchRate: 'Процент совпадений',
        userBehavior: 'Поведение пользователей',
      },
    },
    common: {
      loading: 'Загрузка...',
      error: 'Произошла ошибка',
      success: 'Успешно',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      save: 'Сохранить',
      delete: 'Удалить',
      edit: 'Редактировать',
      view: 'Просмотр',
      download: 'Скачать',
      upload: 'Загрузить',
      search: 'Поиск',
      filter: 'Фильтр',
      sort: 'Сортировка',
      next: 'Далее',
      previous: 'Назад',
      close: 'Закрыть',
    },
  },
};

export function getTranslation(lang: Language): Translation {
  return translations[lang] || translations.ko;
}
