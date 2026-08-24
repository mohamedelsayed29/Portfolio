/**
 * Portfolio entries. `image` is a real screenshot when we have one; `cover`
 * holds a CSS gradient and is what renders when we do not, so entries without
 * artwork still look deliberate rather than broken.
 *
 * User-facing text fields hold `{ en, ar }` locale objects (see src/i18n);
 * structural fields (slug, image, cover, href, year, tech names) stay plain.
 */
export const PROJECT_CATEGORIES = [
  { id: 'all', label: { en: 'All work', ar: 'كل الأعمال' } },
  { id: 'web', label: { en: 'Web', ar: 'الويب' } },
  { id: 'mobile', label: { en: 'Mobile', ar: 'الموبايل' } },
]

export const PROJECTS = [
  {
    slug: 'bioreza-cosmetics',
    title: 'Bioreza',
    subtitle: { en: 'Bilingual beauty storefront', ar: 'متجر مستحضرات تجميل ثنائي اللغة' },
    category: 'web',
    year: 2026,
    client: 'Bioreza Cosmetics',
    featured: true,
    image: '/work/bioreza.jpg',
    cover: 'linear-gradient(135deg, #8a6a4f 0%, #c9a227 55%, #f3e7d8 100%)',
    summary: {
      en: 'A cosmetics storefront for the Egyptian market — 70 brands across 48 categories, in English and full right-to-left Arabic.',
      ar: 'متجر إلكتروني لمستحضرات التجميل موجَّه للسوق المصري — 70 علامة تجارية في 48 فئة، بالإنجليزية وبعربية كاملة من اليمين إلى اليسار.',
    },
    problem: {
      en: 'Beauty shopping in Egypt happens across scattered social pages and resellers, where prices move, ingredient lists are missing and authenticity is a guess. Bioreza needed a storefront of its own — one that reads as naturally in Arabic as it does in English, rather than an English site with translated labels bolted on.',
      ar: 'يتوزع تسوق مستحضرات التجميل في مصر بين صفحات التواصل الاجتماعي والموزعين، حيث تتقلب الأسعار وتغيب قوائم المكونات ويظل التأكد من أصالة المنتج تخمينًا. احتاجت Bioreza إلى متجر يخصها — متجر يُقرأ بالعربية بسلاسة كاملة كما يُقرأ بالإنجليزية، لا موقع إنجليزي أُلصقت عليه ترجمة.',
    },
    approach: {
      en: 'A React storefront on Vite in front of a versioned REST API that owns the catalogue, brands, campaigns, cart and accounts, with product media served from S3-compatible object storage behind Cloudflare. Language is part of the URL: switching to Arabic flips the document to RTL and swaps the page titles and metadata, not just the body copy. Banners, categories and offers are content, so merchandising changes ship without a deploy.',
      ar: 'واجهة متجر مبنية بـ React على Vite أمام REST API مُدارة بالإصدارات تملك الكتالوج والعلامات التجارية والحملات وسلة الشراء والحسابات، مع تقديم وسائط المنتجات من تخزين متوافق مع S3 خلف Cloudflare. اللغة جزء من الرابط نفسه: التبديل إلى العربية يقلب اتجاه الصفحة إلى RTL ويبدّل عناوين الصفحات وبياناتها الوصفية، لا نصوصها فقط. أما البانرات والفئات والعروض فمحتوى قابل للتحرير، لذا تصل تغييرات العرض التسويقي دون أي نشر جديد.',
    },
    outcome: {
      en: 'The catalogue runs 70 brands across 48 categories with offers, wishlists, customer accounts and secure checkout, and the team edits the storefront — banners, campaigns, arrivals — without touching the code.',
      ar: 'يضم الكتالوج 70 علامة تجارية في 48 فئة، مع العروض وقوائم الأمنيات وحسابات العملاء والدفع الآمن، ويحرّر الفريق واجهة المتجر — البانرات والحملات والمنتجات الجديدة — دون الاقتراب من الكود.',
    },
    metrics: [
      { value: '70', label: { en: 'Brands in catalogue', ar: 'علامة تجارية في الكتالوج' } },
      { value: '48', label: { en: 'Product categories', ar: 'فئة منتجات' } },
      {
        value: { en: 'EN / AR', ar: 'عربي / إنجليزي' },
        label: { en: 'Bilingual, full RTL', ar: 'ثنائي اللغة بدعم RTL كامل' },
      },
    ],
    stack: ['React', 'Vite', 'REST API', 'Cloudflare', 'S3 storage'],
    services: ['frontend', 'backend'],
    href: 'https://bioreza.com',
  },
  {
    slug: 'bright-smile-smart',
    title: 'Bright Smile',
    subtitle: { en: 'Dental clinic & patient app', ar: 'نظام عيادة أسنان وتطبيق للمرضى' },
    category: 'mobile',
    year: 2025,
    client: 'Bright Smile Smart System',
    featured: true,
    image: '/work/bright-smile.jpg',
    cover: 'linear-gradient(135deg, #2db2a8 0%, #14766f 55%, #588cff 100%)',
    summary: {
      en: 'A dental practice system in two halves: patients book, pay and follow their treatment plan, while the clinic runs the schedule and the files — with a model assisting diagnosis.',
      ar: 'نظام متكامل لعيادة الأسنان بشقّين: المرضى يحجزون ويدفعون ويتابعون خطة علاجهم، والعيادة تدير المواعيد والملفات — مع نموذج ذكاء اصطناعي يساعد في التشخيص.',
    },
    problem: {
      en: 'The practice needed one system for both sides of the counter: patients who want to book, pay and follow a treatment plan from their phone, and a clinic whose appointments, patient records and billing lived in separate places.',
      ar: 'احتاجت العيادة إلى نظام واحد يخدم الطرفين معًا: مرضى يريدون الحجز والدفع ومتابعة خطة العلاج من هواتفهم، وعيادة كانت مواعيدها وسجلات مرضاها وفواتيرها موزعة في أماكن متفرقة.',
    },
    approach: {
      en: 'A single Python service owns the domain — scheduling, patient records, invoicing and the diagnosis model — and both sides of the app talk to it through one REST API. Roles decide what each account sees: a patient gets their own appointments, plan and invoices, a clinician gets the day and the full file. The model runs server-side behind the same API, which keeps the mobile client thin and the model updatable without shipping a new build.',
      ar: 'خدمة Python واحدة تملك المنطق كاملًا — الجدولة وسجلات المرضى والفوترة ونموذج التشخيص — ويتخاطب معها طرفا التطبيق عبر REST API واحدة. الأدوار تحدد ما يراه كل حساب: المريض يرى مواعيده وخطته وفواتيره، والطبيب يرى جدول اليوم والملف الكامل. يعمل النموذج على الخادم خلف الواجهة نفسها، ما يُبقي تطبيق الموبايل خفيفًا ويتيح تحديث النموذج دون إصدار نسخة جديدة.',
    },
    outcome: {
      en: 'Delivered in 2025 as one product with two faces — booking and reminders, patient records, invoicing and model-assisted review — all served by a single backend the clinic can keep extending.',
      ar: 'سُلّم في 2025 كمنتج واحد بوجهين — الحجز والتذكيرات، وسجلات المرضى، والفوترة، والمراجعة بمساعدة النموذج — كلها من خادم واحد تستطيع العيادة البناء عليه باستمرار.',
    },
    metrics: [
      { value: '2', label: { en: 'Apps: patient & clinic', ar: 'تطبيقان: للمريض وللعيادة' } },
      { value: '4', label: { en: 'Modules on one API', ar: 'وحدات على API واحدة' } },
      {
        value: 'AI',
        label: { en: 'Model-assisted diagnosis', ar: 'تشخيص بمساعدة الذكاء الاصطناعي' },
      },
    ],
    stack: ['Python', 'REST API', 'AI model', 'Cross-platform mobile'],
    services: ['mobile', 'ai', 'backend'],
  },
  {
    slug: 'mkank',
    title: 'Mkank',
    subtitle: { en: 'Compound management platform', ar: 'منصة إدارة كمبوندات سكنية' },
    category: 'mobile',
    year: 2026,
    client: 'Mkank',
    cardLabel: { en: 'Residential compounds', ar: 'كمبوندات سكنية' },
    featured: true,
    image: '/work/mkank.jpg',
    cover: 'linear-gradient(135deg, #10251b 0%, #274334 58%, #b89a55 100%)',
    summary: {
      en: 'One platform for residents, compound management and gate security, covering permits, payments, support, community services and real-time access control.',
      ar: 'منصة واحدة للسكان وإدارة الكمبوند وأمن البوابات، تغطي التصاريح والمدفوعات والدعم وخدمات المجتمع والتحكم اللحظي في الدخول.',
    },
    problem: {
      en: 'Resident services, management operations and gate decisions are tightly connected, but each role needs a different interface. Mkank brings permits, dues, documents, support, community activity and access records into one compound-aware system without exposing one role\'s data to another.',
      ar: 'خدمات السكان وعمليات الإدارة وقرارات البوابة مترابطة بإحكام، لكن كل دور يحتاج واجهة مختلفة. تجمع منصة Mkank التصاريح والمستحقات والمستندات والدعم ونشاط المجتمع وسجلات الدخول في نظام واحد يراعي حدود كل كمبوند، دون أن يكشف بيانات دور لدور آخر.',
    },
    approach: {
      en: 'Three role-specific surfaces share the same live domain: an offline-friendly resident app, an administration dashboard, and a focused gate interface for QR scanning, visitor registration and entry decisions. Arabic RTL, English and Russian are supported alongside light and dark modes, with per-compound permissions and audit trails.',
      ar: 'ثلاث واجهات مخصصة للأدوار تتشارك البيانات الحية نفسها: تطبيق للسكان يعمل حتى دون اتصال، ولوحة تحكم للإدارة، وواجهة مركزة للبوابة لمسح رموز QR وتسجيل الزوار وقرارات الدخول. تدعم المنصة العربية بتخطيط RTL كامل إلى جانب الإنجليزية والروسية، والوضعين الفاتح والداكن، مع صلاحيات مستقلة لكل كمبوند وسجلات تدقيق.',
    },
    outcome: {
      en: 'Residents can handle access, payments and services from one app while management and security see the same updates in real time. The platform keeps buildings, units, people and operations isolated by compound and usable across connectivity conditions.',
      ar: 'يدير السكان الدخول والمدفوعات والخدمات من تطبيق واحد، بينما ترى الإدارة والأمن التحديثات نفسها لحظة حدوثها. وتُبقي المنصة المباني والوحدات والأشخاص والعمليات معزولة لكل كمبوند، وقابلة للاستخدام مهما تقلبت جودة الاتصال.',
    },
    metrics: [
      { value: '3', label: { en: 'Role-specific interfaces', ar: 'واجهات مخصصة للأدوار' } },
      {
        value: { en: 'AR / EN / RU', ar: 'عربي / إنجليزي / روسي' },
        label: { en: 'Languages with full RTL', ar: 'لغات بدعم RTL كامل' },
      },
      {
        value: { en: 'Online / offline', ar: 'أونلاين / أوفلاين' },
        label: { en: 'Resident experience', ar: 'تجربة الساكن' },
      },
    ],
    stack: [
      { en: 'Realtime', ar: 'تحديثات لحظية' },
      { en: 'QR access', ar: 'دخول برمز QR' },
      { en: 'Offline-first', ar: 'يعمل دون اتصال' },
      { en: 'Arabic RTL', ar: 'عربية RTL كاملة' },
    ],
    stackLabel: { en: 'Platform capabilities', ar: 'قدرات المنصة' },
    services: ['frontend', 'mobile', 'backend'],
    resources: {
      video: {
        label: { en: 'Product walkthrough', ar: 'جولة في المنتج' },
        href: 'https://youtu.be/wsxRj9YJRJM',
        embed: 'https://www.youtube-nocookie.com/embed/wsxRj9YJRJM',
      },
      pdf: {
        label: { en: 'Feature deck', ar: 'ملف المزايا' },
        href: '/mkank_assets/mkank-features.pdf',
      },
    },
  },
  {
    slug: 'fitway',
    title: 'FitWay',
    subtitle: { en: 'Multi-branch gym platform', ar: 'منصة صالات رياضية متعددة الفروع' },
    category: 'mobile',
    year: 2026,
    client: 'FitWay',
    cardLabel: { en: 'Multi-branch gyms', ar: 'صالات رياضية متعددة الفروع' },
    featured: true,
    image: '/work/fitway.jpg',
    cover: 'linear-gradient(135deg, #15161a 0%, #22262f 62%, #b7ff36 100%)',
    summary: {
      en: 'A multi-branch gym platform combining QR access, memberships, live occupancy, CRM, trainer bookings and real-time communication across web and mobile.',
      ar: 'منصة لصالات رياضية متعددة الفروع تجمع الدخول برمز QR والعضويات والإشغال اللحظي وإدارة علاقات العملاء وحجوزات المدربين والتواصل الفوري عبر الويب والموبايل.',
    },
    problem: {
      en: 'Multi-branch gyms need access control, memberships, CRM, coaching and member communication to agree in real time. FitWay unifies those workflows so a check-in, subscription state or booking is visible to the right role across every branch.',
      ar: 'تحتاج الصالات متعددة الفروع إلى أن يتزامن التحكم في الدخول والعضويات وإدارة علاقات العملاء والتدريب والتواصل مع الأعضاء لحظيًا. توحّد FitWay هذه العمليات بحيث يظهر تسجيل الدخول أو حالة الاشتراك أو الحجز للدور الصحيح في كل فرع.',
    },
    approach: {
      en: 'Django and DRF manage core workflows in PostgreSQL, MongoDB stores chat and comments, Redis supports caching and occupancy, and WebSockets carry live messages. React and TypeScript power web operations while Flutter serves members on mobile, all shipped with Docker and Swagger documentation.',
      ar: 'يدير Django وDRF العمليات الأساسية في PostgreSQL، ويخزن MongoDB المحادثات والتعليقات، ويدعم Redis التخزين المؤقت وحساب الإشغال، بينما تنقل WebSockets الرسائل الحية. تشغّل React وTypeScript عمليات الويب، ويخدم Flutter الأعضاء على الموبايل، ويُشحن كل ذلك مع Docker وتوثيق Swagger.',
    },
    outcome: {
      en: 'Owners and managers can run multiple branches, trainers can manage availability and conversations, and members can check in, see occupancy, book sessions and chat from the mobile app. Arabic RTL, English, and light and dark modes carry across web and mobile.',
      ar: 'يدير المالكون والمديرون فروعًا متعددة، وينظم المدربون مواعيدهم ومحادثاتهم، ويسجل الأعضاء دخولهم ويتابعون الإشغال ويحجزون الحصص ويتراسلون من تطبيق الموبايل. وتمتد العربية بتخطيط RTL كامل والإنجليزية والوضعان الفاتح والداكن عبر الويب والموبايل.',
    },
    metrics: [
      {
        value: { en: 'Multi-branch', ar: 'متعدد الفروع' },
        label: { en: 'Organization model', ar: 'نموذج المنشأة' },
      },
      { value: '4', label: { en: 'Role-specific experiences', ar: 'تجارب مخصصة للأدوار' } },
      {
        value: { en: 'Web / mobile', ar: 'ويب / موبايل' },
        label: { en: 'Connected applications', ar: 'تطبيقات مترابطة' },
      },
    ],
    stack: [
      'Django',
      'WebSockets',
      'React',
      'Flutter',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'TypeScript',
      'Docker',
      'Swagger',
    ],
    services: ['frontend', 'mobile', 'backend'],
    resources: {
      video: {
        label: { en: 'Product walkthrough', ar: 'جولة في المنتج' },
        href: 'https://youtu.be/3k7gGTS5akY',
        embed: 'https://www.youtube-nocookie.com/embed/3k7gGTS5akY',
      },
      pdf: {
        label: { en: 'Feature deck', ar: 'ملف المزايا' },
        href: '/fitway_assets/fitway_features_ar.pdf',
      },
    },
  },
]

export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured)

export const getProjectBySlug = (slug) => PROJECTS.find((project) => project.slug === slug) ?? null

export const getRelatedProjects = (slug, limit = 2) =>
  PROJECTS.filter((project) => project.slug !== slug).slice(0, limit)
