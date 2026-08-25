/**
 * Single source of truth for services. Consumed by the services section, the
 * booking form's service picker, and the footer links — so `id` values are
 * stable and used as anchors (/services#backend) and query params (?service=ai).
 *
 * User-facing text fields are `{ en, ar }` locale objects — collapse them with
 * `useLocalized` before rendering. Structural fields (id, icon, stack names,
 * colours) stay plain.
 */
export const SERVICES = [
  {
    id: 'frontend',
    icon: 'Layers',
    title: { en: 'Frontend Engineering', ar: 'هندسة الواجهات الأمامية' },
    summary: {
      en: 'Interfaces that feel instant. Design systems, complex state, and animation that respects the user.',
      ar: 'واجهات تستجيب في اللحظة. أنظمة تصميم، وإدارة حالات معقدة، وحركة تحترم المستخدم.',
    },
    description: {
      en: 'We build production frontends in React and Next.js — accessible, fast on mid-range hardware, and typed end to end. Every project ships with a component library your team can keep building on.',
      ar: 'نبني واجهات جاهزة للإنتاج بـ React وNext.js — سهلة الوصول، سريعة حتى على الأجهزة متوسطة الإمكانات، ومكتوبة بـ TypeScript من أولها إلى آخرها. ويُسلَّم كل مشروع مع مكتبة مكوّنات يواصل فريقك البناء عليها.',
    },
    deliverables: [
      { en: 'React / Next.js applications', ar: 'تطبيقات React / Next.js' },
      { en: 'Design systems & component libraries', ar: 'أنظمة تصميم ومكتبات مكوّنات' },
      { en: 'Accessibility (WCAG 2.2 AA)', ar: 'إمكانية الوصول (WCAG 2.2 AA)' },
      { en: 'Core Web Vitals optimisation', ar: 'تحسين مؤشرات Core Web Vitals' },
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Motion'],
    timeline: { en: '3–8 weeks', ar: '3–8 أسابيع' },
    accent: '#55d6ff',
    art: {
      primary: '#55d6ff',
      secondary: '#4169ff',
      primaryRgb: '85 214 255',
      secondaryRgb: '65 105 255',
    },
  },
  {
    id: 'backend',
    icon: 'Server',
    title: { en: 'Backend & APIs', ar: 'الأنظمة الخلفية وواجهات API' },
    summary: {
      en: 'Services that stay up. Clean data models, boring reliability, and infrastructure you can reason about.',
      ar: 'خدمات لا تتوقف. نماذج بيانات نظيفة، وموثوقية بلا مفاجآت، وبنية تحتية واضحة يسهل فهمها.',
    },
    description: {
      en: 'From the first schema to autoscaling in production: REST and GraphQL APIs, event pipelines, auth, payments, and the observability to know it all works at 3am.',
      ar: 'من أول مخطط لقاعدة البيانات حتى التوسّع التلقائي في الإنتاج: واجهات REST وGraphQL، وخطوط معالجة الأحداث، والمصادقة، والمدفوعات، وأدوات مراقبة تُطمئنك أن كل شيء يعمل في الثالثة فجرًا.',
    },
    deliverables: [
      { en: 'REST & GraphQL APIs', ar: 'واجهات REST وGraphQL' },
      { en: 'Database design & migrations', ar: 'تصميم قواعد البيانات وترحيلها' },
      { en: 'Auth, billing & integrations', ar: 'المصادقة والفوترة والتكاملات' },
      { en: 'CI/CD, monitoring & alerting', ar: 'CI/CD والمراقبة والتنبيهات' },
    ],
    stack: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
    timeline: { en: '4–10 weeks', ar: '4–10 أسابيع' },
    accent: '#8090ff',
    art: {
      primary: '#8090ff',
      secondary: '#3957d9',
      primaryRgb: '128 144 255',
      secondaryRgb: '57 87 217',
    },
  },
  {
    id: 'mobile',
    icon: 'Smartphone',
    title: { en: 'Mobile Applications', ar: 'تطبيقات الموبايل' },
    summary: {
      en: 'iOS and Android apps that feel native because they behave like the platform, not like a website.',
      ar: 'تطبيقات iOS وAndroid بإحساس أصيل، لأنها تتصرف كالمنصة نفسها لا كموقع ويب.',
    },
    description: {
      en: 'Cross-platform with React Native when speed matters, fully native Swift or Kotlin when it does not. We handle the parts teams underestimate: offline state, push, deep links, and store review.',
      ar: 'نبني بـ React Native متعدد المنصات حين تكون السرعة أولوية، وبـ Swift أو Kotlin الأصيلة حين تكون التجربة هي الأولوية. ونتولى الأجزاء التي تستهين بها الفرق عادة: العمل دون اتصال، والإشعارات، والروابط العميقة، ومراجعة المتاجر.',
    },
    deliverables: [
      { en: 'React Native & native builds', ar: 'تطبيقات React Native وتطبيقات أصيلة' },
      { en: 'Offline-first data sync', ar: 'مزامنة بيانات تعمل دون اتصال' },
      { en: 'Push notifications & deep links', ar: 'إشعارات فورية وروابط عميقة' },
      { en: 'App Store / Play submission', ar: 'النشر على App Store وGoogle Play' },
    ],
    stack: ['React Native', 'Expo', 'Swift', 'Kotlin', 'Firebase'],
    timeline: { en: '6–14 weeks', ar: '6–14 أسبوعًا' },
    accent: '#c383ff',
    art: {
      primary: '#c383ff',
      secondary: '#695cff',
      primaryRgb: '195 131 255',
      secondaryRgb: '105 92 255',
    },
  },
  {
    id: 'ai',
    icon: 'BrainCircuit',
    title: { en: 'AI, LLM & Models', ar: 'الذكاء الاصطناعي والنماذج اللغوية' },
    summary: {
      en: 'Agents, RAG and fine-tuned models wired into real products, with evals that prove they work.',
      ar: 'وكلاء ذكيون وRAG ونماذج مخصّصة داخل منتجات حقيقية، مع اختبارات تقييم تُثبت أنها تعمل.',
    },
    description: {
      en: 'We ship AI features that survive contact with users: retrieval pipelines over your own data, tool-using agents, fine-tuned and distilled models, and the evaluation harness that keeps quality from drifting.',
      ar: 'نطلق ميزات ذكاء اصطناعي تصمد أمام الاستخدام الفعلي: خطوط استرجاع فوق بياناتك أنت، ووكلاء يستخدمون الأدوات، ونماذج مضبوطة ومقطّرة، ومنظومة تقييم تحمي الجودة من التراجع.',
    },
    deliverables: [
      { en: 'RAG & semantic search', ar: 'RAG والبحث الدلالي' },
      { en: 'Tool-using agents & workflows', ar: 'وكلاء يستخدمون الأدوات ومسارات عمل مؤتمتة' },
      { en: 'Fine-tuning & model distillation', ar: 'الضبط الدقيق وتقطير النماذج' },
      { en: 'Eval suites, guardrails & cost control', ar: 'حزم تقييم وضوابط أمان وتحكم في التكلفة' },
    ],
    stack: ['Claude', 'OpenAI', 'LangChain', 'PyTorch', 'pgvector', 'vLLM'],
    timeline: { en: '4–12 weeks', ar: '4–12 أسبوعًا' },
    accent: '#5be9ff',
    art: {
      primary: '#5be9ff',
      secondary: '#936cff',
      primaryRgb: '91 233 255',
      secondaryRgb: '147 108 255',
    },
  },
  {
    id: 'bugfix',
    icon: 'Bug',
    title: { en: 'Bug Fixing & Rescue', ar: 'إصلاح الأخطاء وإنقاذ المشاريع' },
    summary: {
      en: 'The build is broken, the release is Friday. We find the root cause, not the nearest symptom.',
      ar: 'البناء متعطل والإطلاق يوم الجمعة؟ نصل إلى السبب الجذري، لا إلى أقرب عرَضٍ ظاهر.',
    },
    description: {
      en: 'Drop us into an unfamiliar codebase and we will reproduce, isolate and fix — then leave behind the regression test so it stays fixed. Also available as an ongoing retainer.',
      ar: 'ضعنا أمام أي قاعدة كود لا نعرفها، وسنعيد إنتاج الخطأ ونعزله ونصلحه — ثم نترك خلفنا اختبار الانحدار الذي يضمن ألا يعود. متاح أيضًا كعقد دعم مستمر.',
    },
    deliverables: [
      { en: 'Root-cause diagnosis', ar: 'تشخيص السبب الجذري' },
      { en: 'Performance & memory profiling', ar: 'تحليل الأداء واستهلاك الذاكرة' },
      { en: 'Regression test coverage', ar: 'تغطية باختبارات الانحدار' },
      { en: 'Legacy refactors & upgrades', ar: 'إعادة هيكلة الأنظمة القديمة وترقيتها' },
    ],
    stack: [
      { en: 'Any stack', ar: 'أي تقنية' },
      { en: 'Profilers', ar: 'محلّلات الأداء' },
      'Playwright',
      'Sentry',
    ],
    timeline: { en: '2 days – 3 weeks', ar: 'من يومين إلى 3 أسابيع' },
    accent: '#ff806f',
    art: {
      primary: '#ff806f',
      secondary: '#ffb055',
      primaryRgb: '255 128 111',
      secondaryRgb: '255 176 85',
    },
  },
  {
    id: 'solutions',
    icon: 'Compass',
    title: { en: 'Software Solutions', ar: 'حلول برمجية' },
    summary: {
      en: 'Not sure what to build yet? We scope it, cost it, and hand you a plan you could give to anyone.',
      ar: 'لم تحسم بعد ما الذي ستبنيه؟ نحدد النطاق والتكلفة، ونسلّمك خطة يمكنك تنفيذها مع أي فريق.',
    },
    description: {
      en: 'Technical discovery, architecture review and delivery planning for teams at a fork in the road — replatform or refactor, build or buy, hire or outsource.',
      ar: 'استكشاف تقني ومراجعة معمارية وتخطيط للتسليم، للفِرق الواقفة على مفترق طرق — تغيير المنصة أو إعادة الهيكلة، البناء أو الشراء، التوظيف أو الإسناد الخارجي.',
    },
    deliverables: [
      { en: 'Discovery & technical scoping', ar: 'استكشاف وتحديد النطاق التقني' },
      { en: 'Architecture review', ar: 'مراجعة البنية المعمارية' },
      { en: 'Build-vs-buy analysis', ar: 'تحليل البناء مقابل الشراء' },
      { en: 'Delivery roadmap & estimates', ar: 'خارطة طريق للتسليم وتقديرات زمنية' },
    ],
    stack: [
      { en: 'Workshops', ar: 'ورش عمل' },
      'ADRs',
      { en: 'Roadmaps', ar: 'خرائط طريق' },
      { en: 'Prototypes', ar: 'نماذج أولية' },
    ],
    timeline: { en: '1–3 weeks', ar: '1–3 أسابيع' },
    accent: '#5ce2bd',
    art: {
      primary: '#5ce2bd',
      secondary: '#35a9e8',
      primaryRgb: '92 226 189',
      secondaryRgb: '53 169 232',
    },
  },
]

export const SERVICE_OPTIONS = SERVICES.map((service) => ({
  value: service.id,
  label: service.title,
}))

export const getServiceById = (id) => SERVICES.find((service) => service.id === id) ?? null
