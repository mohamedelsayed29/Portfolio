import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const TMP_DIR = process.env.TMP_DIR;
const FINAL_PPTX = process.env.FINAL_PPTX;
if (!TMP_DIR || !FINAL_PPTX) {
  throw new Error("TMP_DIR and FINAL_PPTX are required.");
}

const W = 1280;
const H = 720;
const logoPath = "/Users/test/Downloads/HammerLoad Logo-selection (1).png";
const screenshotPath = "/var/folders/_l/4gk4r9ys1g12gz_0p2149qtc0000gn/T/TemporaryItems/NSIRD_screencaptureui_c97L48/Screenshot 2026-09-03 at 4.11.38 PM.png";

const C = {
  navy: "#0F1D33",
  gold: "#D98A05",
  green: "#006C35",
  green2: "#0B8F52",
  text: "#142033",
  muted: "#5B6678",
  soft: "#F6F8FA",
  line: "#DDE3EA",
  paleGreen: "#EAF6EF",
};

const presentation = Presentation.create({
  slideSize: { width: W, height: H },
});

const logoBytes = await fs.readFile(logoPath);
const screenshotBytes = await fs.readFile(screenshotPath);
await fs.mkdir(TMP_DIR, { recursive: true });

function addText(slide, text, position, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = typeof text === "string" ? text.replace(/\./g, "") : text;
  shape.text.style = {
    typeface: "Arial",
    fontSize: style.fontSize ?? 24,
    bold: style.bold ?? false,
    color: style.color ?? C.text,
    alignment: style.alignment ?? "right",
    verticalAlignment: style.verticalAlignment ?? "top",
    wrap: "square",
    insets: style.insets ?? { top: 0, right: 0, bottom: 0, left: 0 },
  };
  return shape;
}

function addBullets(slide, items, x, y, width, options = {}) {
  const lineH = options.lineH ?? 50;
  const fontSize = options.fontSize ?? 22;
  items.forEach((item, i) => {
    const top = y + i * lineH;
    addText(slide, item, { left: x, top, width: width - 34, height: lineH - 6 }, {
      fontSize,
      color: options.color ?? C.text,
      bold: options.bold ?? false,
    });
    const dot = slide.shapes.add({
      geometry: "ellipse",
      position: { left: x + width - 18, top: top + 11, width: 10, height: 10 },
      fill: options.dotColor ?? C.green,
      line: { style: "solid", fill: "none", width: 0 },
    });
    dot.sendToBack();
  });
}

function addRule(slide, x, y, width, color = C.line, size = 2) {
  slide.shapes.add({
    geometry: "line",
    position: { left: x, top: y, width, height: 0 },
    fill: "none",
    line: { style: "solid", fill: color, width: size },
  });
}

function addLogo(slide, variant = "regular") {
  slide.images.add({
    blob: logoBytes,
    contentType: "image/png",
    alt: "HammerLoad logo",
    fit: "contain",
    position: variant === "cover"
      ? { left: 92, top: 78, width: 140, height: 140 }
      : { left: 76, top: 42, width: 82, height: 82 },
  });
}

function addFooter(slide, index) {
  addRule(slide, 72, 666, 1136, C.line, 1);
  addText(slide, "HammerLoad", { left: 72, top: 678, width: 180, height: 24 }, {
    fontSize: 13,
    bold: true,
    color: C.navy,
    alignment: "left",
  });
  addText(slide, `${String(index).padStart(2, "0")}`, { left: 1116, top: 676, width: 92, height: 28 }, {
    fontSize: 14,
    color: C.muted,
    alignment: "right",
  });
}

function addHeader(slide, index, section = "نظام علاقات عملاء ذكي للفروع") {
  addLogo(slide);
  addText(slide, section, { left: 860, top: 48, width: 348, height: 28 }, {
    fontSize: 15,
    color: C.muted,
    alignment: "right",
  });
  addFooter(slide, index);
}

function addTitle(slide, title, subtitle = "") {
  addText(slide, title, { left: 546, top: 112, width: 662, height: 92 }, {
    fontSize: 40,
    bold: true,
    color: C.navy,
    alignment: "right",
  });
  if (subtitle) {
    addText(slide, subtitle, { left: 590, top: 210, width: 618, height: 72 }, {
      fontSize: 22,
      color: C.muted,
      alignment: "right",
    });
  }
}

function addChip(slide, text, x, y, w, fill = C.paleGreen, color = C.green) {
  const chip = slide.shapes.add({
    geometry: "roundRect",
    position: { left: x, top: y, width: w, height: 38 },
    fill,
    line: { style: "solid", fill: fill, width: 1 },
    borderRadius: "rounded-full",
  });
  chip.text = text;
  chip.text.style = {
    typeface: "Arial",
    fontSize: 16,
    bold: true,
    color,
    alignment: "center",
    verticalAlignment: "middle",
    insets: { top: 0, right: 8, bottom: 0, left: 8 },
  };
}

function addCard(slide, x, y, w, h, title, body, accent = C.green) {
  slide.shapes.add({
    geometry: "roundRect",
    position: { left: x, top: y, width: w, height: h },
    fill: "#FFFFFF",
    line: { style: "solid", fill: C.line, width: 1 },
    borderRadius: 8,
  });
  slide.shapes.add({
    geometry: "rect",
    position: { left: x + w - 7, top: y, width: 7, height: h },
    fill: accent,
    line: { style: "solid", fill: "none", width: 0 },
  });
  addText(slide, title, { left: x + 18, top: y + 18, width: w - 38, height: 36 }, {
    fontSize: 22,
    bold: true,
    color: C.navy,
  });
  addText(slide, body, { left: x + 18, top: y + 62, width: w - 38, height: h - 74 }, {
    fontSize: 17,
    color: C.muted,
  });
}

function addSources(slide, extra = "") {
  slide.speakerNotes.textFrame.setText(`[Sources]\n- User-provided brief in this Codex task, dated 2026-09-03.\n- User-provided WhatsApp screenshot: ${screenshotPath}.\n- User-provided HammerLoad logo image: ${logoPath}.${extra ? `\n${extra}` : ""}`);
}

function addCover() {
  const slide = presentation.slides.add();
  slide.background.fill = "#FFFFFF";
  slide.shapes.add({
    geometry: "rect",
    position: { left: 0, top: 0, width: 12, height: H },
    fill: C.green,
    line: { style: "solid", fill: "none", width: 0 },
  });
  slide.shapes.add({
    geometry: "rect",
    position: { left: 12, top: 478, width: 10, height: 122 },
    fill: C.gold,
    line: { style: "solid", fill: "none", width: 0 },
  });
  addLogo(slide, "cover");
  addText(slide, "نظام ذكي لإدارة العملاء\nوزيادة إغلاق الصفقات للفروع", { left: 536, top: 186, width: 592, height: 150 }, {
    fontSize: 46,
    bold: true,
    color: C.navy,
  });
  addText(slide, "منصة واحدة تجمع العملاء، مصادرهم، تصنيفهم، وتوجيههم تلقائيًا لمدير مبيعات الفرع الأنسب عبر واتساب أو الإيميل", { left: 514, top: 362, width: 614, height: 92 }, {
    fontSize: 23,
    color: C.muted,
  });
  addChip(slide, "توجيه العملاء", 798, 506, 150, "#F8F3E8", C.gold);
  addChip(slide, "تصنيف ذكي", 628, 506, 150, C.paleGreen, C.green);
  addChip(slide, "إدارة الفروع", 458, 506, 150, "#EEF2F7", C.navy);
  addFooter(slide, 2);
  addSources(slide);
}

function addWelcome() {
  const slide = presentation.slides.add();
  slide.background.fill = "#FFFFFF";
  slide.shapes.add({
    geometry: "rect",
    position: { left: 0, top: 0, width: 12, height: H },
    fill: C.green,
    line: { style: "solid", fill: "none", width: 0 },
  });
  slide.shapes.add({
    geometry: "rect",
    position: { left: 12, top: 118, width: 10, height: 110 },
    fill: C.gold,
    line: { style: "solid", fill: "none", width: 0 },
  });
  slide.images.add({
    blob: logoBytes,
    contentType: "image/png",
    alt: "HammerLoad logo",
    fit: "contain",
    position: { left: 520, top: 112, width: 240, height: 240 },
  });
  addText(slide, "مرحبًا", { left: 290, top: 374, width: 700, height: 70 }, {
    fontSize: 54,
    bold: true,
    color: C.navy,
    alignment: "center",
  });
  addText(slide, "عرض نظام علاقات عملاء ذكي للفروع", { left: 310, top: 456, width: 660, height: 44 }, {
    fontSize: 28,
    bold: true,
    color: C.green,
    alignment: "center",
  });
  addText(slide, "مقدم بواسطة هامرلود", { left: 390, top: 516, width: 500, height: 34 }, {
    fontSize: 20,
    color: C.muted,
    alignment: "center",
  });
  addFooter(slide, 1);
  addSources(slide);
}

function slide2() {
  const slide = presentation.slides.add();
  slide.background.fill = "#FFFFFF";
  addHeader(slide, 3);
  addTitle(slide, "التحدي ليس في جلب العملاء فقط", "التحدي الحقيقي أن يصل العميل المناسب للشخص المناسب في الوقت المناسب");
  addCard(slide, 812, 334, 326, 164, "فروع متعددة", "كل فرع يحتاج رؤية واضحة للعملاء والفرص وحالة المتابعة", C.green);
  addCard(slide, 476, 334, 326, 164, "مصادر متفرقة", "واتساب، إعلانات، موقع، اتصالات، إنستغرام، ومعارض بدون توحيد كامل", C.gold);
  addCard(slide, 140, 334, 326, 164, "فرص تضيع", "تأخر الرد أو سوء التوزيع يقلل احتمالية إغلاق الصفقة", C.navy);
  addSources(slide);
}

function slide3() {
  const slide = presentation.slides.add();
  slide.background.fill = "#FFFFFF";
  addHeader(slide, 4);
  addTitle(slide, "الحل المقترح: غرفة قيادة ذكية للمبيعات", "النظام لا يحفظ بيانات العملاء فقط، بل يساعد الفريق على ترتيب الأولويات والتحرك بسرعة");
  addBullets(slide, [
    "تجميع كل العملاء المحتملين في مكان واحد",
    "تصنيف العميل تلقائيًا حسب الجدية والفرع والمصدر",
    "إرسال بيانات العميل فورًا لمدير مبيعات الفرع المناسب",
    "متابعة مراحل الصفقة حتى الإغلاق أو الفقد",
    "تقارير واضحة للإدارة عن الأداء والمصادر الأكثر ربحية"
  ], 464, 332, 674, { fontSize: 22, lineH: 52 });
  slide.shapes.add({
    geometry: "roundRect",
    position: { left: 132, top: 316, width: 260, height: 210 },
    fill: C.paleGreen,
    line: { style: "solid", fill: "#CFE8D9", width: 1 },
    borderRadius: 8,
  });
  addText(slide, "هدف النظام", { left: 164, top: 350, width: 198, height: 38 }, { fontSize: 24, bold: true, color: C.green, alignment: "center" });
  addText(slide, "تقليل وقت الاستجابة\nوزيادة نسبة الإغلاق\nورفع وضوح الإدارة", { left: 156, top: 408, width: 214, height: 104 }, { fontSize: 22, bold: true, color: C.navy, alignment: "center" });
  addSources(slide);
}

function slide4() {
  const slide = presentation.slides.add();
  slide.background.fill = "#FFFFFF";
  addHeader(slide, 5);
  addTitle(slide, "رحلة العميل داخل النظام تبدأ من أول رسالة", "أي عميل جديد يدخل من قناة مبيعات يتم تسجيله وتصنيفه وتوجيهه بدون انتظار يدوي");
  const y = 334;
  const steps = [
    ["مصدر العميل", "إعلان، واتساب، موقع، اتصال، معرض"],
    ["تسجيل تلقائي", "بيانات العميل والفرع والاهتمام"],
    ["تصنيف ذكي", "درجة الجدية واحتمالية الإغلاق"],
    ["توجيه سريع", "إرسال لمدير مبيعات الفرع"],
    ["متابعة وإغلاق", "مهام، تنبيهات، وتقارير"]
  ];
  steps.forEach(([title, body], i) => {
    const x = 940 - i * 212;
    addCard(slide, x, y, 180, 166, title, body, i % 2 ? C.gold : C.green);
    if (i < steps.length - 1) {
      addText(slide, "←", { left: x - 34, top: y + 56, width: 28, height: 44 }, { fontSize: 32, bold: true, color: C.line, alignment: "center" });
    }
  });
  addSources(slide);
}

function slide5() {
  const slide = presentation.slides.add();
  slide.background.fill = "#FFFFFF";
  addHeader(slide, 6);
  addTitle(slide, "تصنيف العملاء يحول الزحمة إلى أولويات واضحة", "كل عميل يحصل على درجة تساعد فريق المبيعات يقرر من يبدأ به الآن ومن يحتاج متابعة لاحقة");
  const rows = [
    ["عميل ساخن", "طلب سعر أو تواصل متكرر أو جاهز للزيارة", "اتصال فوري + إرسال للمدير"],
    ["عميل دافئ", "مهتم لكن يحتاج مقارنة أو معلومات إضافية", "متابعة مجدولة خلال 24 ساعة"],
    ["عميل بارد", "استفسار عام أو اهتمام غير واضح", "رعاية تسويقية ومتابعة لاحقة"]
  ];
  rows.forEach((r, i) => {
    const top = 322 + i * 92;
    slide.shapes.add({
      geometry: "roundRect",
      position: { left: 138, top, width: 1000, height: 68 },
      fill: i === 0 ? "#EAF6EF" : i === 1 ? "#FFF6E6" : "#F4F6F8",
      line: { style: "solid", fill: C.line, width: 1 },
      borderRadius: 8,
    });
    addText(slide, r[0], { left: 928, top: top + 15, width: 176, height: 36 }, { fontSize: 23, bold: true, color: i === 0 ? C.green : i === 1 ? C.gold : C.navy });
    addText(slide, r[1], { left: 510, top: top + 18, width: 372, height: 32 }, { fontSize: 18, color: C.text });
    addText(slide, r[2], { left: 172, top: top + 18, width: 292, height: 32 }, { fontSize: 18, color: C.muted });
  });
  addSources(slide);
}

function slide6() {
  const slide = presentation.slides.add();
  slide.background.fill = "#FFFFFF";
  addHeader(slide, 7);
  addTitle(slide, "مصادر العملاء تصبح قابلة للقياس لا مجرد انطباعات", "الإدارة تعرف أي قناة تجيب عملاء جادين، وأي قناة تحتاج تحسين أو تقليل ميزانية");
  const bars = [
    ["واتساب", 360, C.green],
    ["إعلانات مدفوعة", 300, C.gold],
    ["الموقع الإلكتروني", 240, C.navy],
    ["إنستغرام", 190, C.green2],
    ["اتصال مباشر", 145, "#7A8595"]
  ];
  bars.forEach(([label, width, color], i) => {
    const top = 316 + i * 54;
    addText(slide, label, { left: 910, top, width: 210, height: 30 }, { fontSize: 19, bold: true, color: C.text });
    slide.shapes.add({
      geometry: "roundRect",
      position: { left: 382, top: top + 4, width, height: 22 },
      fill: color,
      line: { style: "solid", fill: "none", width: 0 },
      borderRadius: "rounded-full",
    });
  });
  addCard(slide, 110, 332, 220, 162, "قرار أوضح", "ربط المصدر بعدد الصفقات وقيمتها يساعد في توجيه الميزانية للقنوات الأعلى عائدًا", C.green);
  addSources(slide);
}

function slide7() {
  const slide = presentation.slides.add();
  slide.background.fill = "#FFFFFF";
  addHeader(slide, 8);
  addTitle(slide, "التوزيع الذكي يرسل العميل للفرع الصحيح مباشرة", "بدل التحويل اليدوي، النظام يحدد الفرع أو المدير الأنسب ويرسل بيانات العميل خلال ثواني");
  addCard(slide, 824, 324, 300, 176, "قواعد التوجيه", "حسب المدينة والفرع ونوع الخدمة ووقت الدوام وضغط العمل على الفريق", C.green);
  addCard(slide, 490, 324, 300, 176, "إشعار فوري", "رسالة واتساب أو إيميل تحتوي بيانات العميل واهتمامه ومصدره", C.gold);
  addCard(slide, 156, 324, 300, 176, "متابعة تلقائية", "إن لم يتم الرد خلال مدة محددة، يتم التصعيد أو إعادة توزيع الفرصة", C.navy);
  addSources(slide);
}

function slide8() {
  const slide = presentation.slides.add();
  slide.background.fill = "#FFFFFF";
  addHeader(slide, 9);
  addTitle(slide, "الذكاء الاصطناعي يرفع جودة قرار فريق المبيعات", "ليس المطلوب أن يستبدل الفريق، بل أن يعطيهم إشارات تساعدهم يقفلون بشكل أسرع");
  addBullets(slide, [
    "اقتراح درجة احتمالية الإغلاق لكل عميل",
    "تلخيص محادثات العميل ونقاط اهتمامه قبل التواصل",
    "اقتراح الرد المناسب حسب حالة العميل والمنتج المطلوب",
    "تنبيه الإدارة عند وجود عميل مهم لم تتم متابعته",
    "اكتشاف القنوات أو الفروع التي تحتاج تحسين"
  ], 468, 316, 666, { fontSize: 22, lineH: 52, dotColor: C.gold });
  slide.shapes.add({
    geometry: "roundRect",
    position: { left: 126, top: 330, width: 276, height: 188 },
    fill: "#F8F3E8",
    line: { style: "solid", fill: "#EFD9B3", width: 1 },
    borderRadius: 8,
  });
  addText(slide, "AI", { left: 162, top: 356, width: 204, height: 70 }, { fontSize: 50, bold: true, color: C.gold, alignment: "center" });
  addText(slide, "توصيات عملية\nوليست تعقيد تقني", { left: 154, top: 436, width: 220, height: 60 }, { fontSize: 22, bold: true, color: C.navy, alignment: "center" });
  addSources(slide);
}

function slide9() {
  const slide = presentation.slides.add();
  slide.background.fill = "#FFFFFF";
  addHeader(slide, 10);
  addTitle(slide, "لوحة الإدارة تعطي صورة مباشرة عن كل الفروع", "المالك أو الإدارة العليا يشوفون أين تأتي الفرص، أين تتعطل، ومن الفريق الأعلى أداء");
  addCard(slide, 838, 320, 286, 142, "مراحل الصفقات", "جديد، تواصل، عرض سعر، تفاوض، مغلق", C.green);
  addCard(slide, 496, 320, 286, 142, "أداء الفروع", "عدد العملاء وسرعة الرد والصفقات المغلقة والعملاء المفقودين", C.gold);
  addCard(slide, 154, 320, 286, 142, "تقارير المصادر", "أي مصدر يجيب عملاء أكثر وأي مصدر يحقق إغلاق أعلى", C.navy);
  addText(slide, "كل تقرير مصمم عشان يجاوب سؤال إداري واضح، مو مجرد أرقام كثيرة", { left: 202, top: 514, width: 878, height: 50 }, {
    fontSize: 24,
    bold: true,
    color: C.green,
    alignment: "center",
  });
  addSources(slide);
}

function slide10() {
  const slide = presentation.slides.add();
  slide.background.fill = "#FFFFFF";
  addHeader(slide, 11);
  addTitle(slide, "النظام قابل للتوسع مع نمو الفروع والفريق", "نبدأ بالاحتياج الأساسي، ثم نضيف الخصائص حسب الأولوية التجارية");
  const items = [
    ["إدارة العملاء والصفقات", "سجل موحد لكل عميل وفرصة ومتابعة"],
    ["صلاحيات حسب الفرع", "كل مدير يشوف فريقه، والإدارة تشوف الصورة الكاملة"],
    ["تكاملات متعددة", "واتساب وإيميل ونماذج الموقع والإعلانات وربط API"],
    ["أتمتة المهام", "تذكيرات، تصعيد، توزيع، وسيناريوهات متابعة"],
    ["تحليلات ذكية", "درجات العملاء وتوقعات وتنبيهات للإدارة"]
  ];
  items.forEach(([a, b], i) => {
    const x = i % 2 === 0 ? 682 : 160;
    const y = 296 + Math.floor(i / 2) * 112;
    addCard(slide, x, y, 438, 102, a, b, i % 2 === 0 ? C.green : C.gold);
  });
  addSources(slide);
}

function slide11() {
  const slide = presentation.slides.add();
  slide.background.fill = "#FFFFFF";
  addHeader(slide, 12);
  addTitle(slide, "خطة تنفيذ عملية تقلل المخاطر وتسرع أول قيمة", "نقترح تنفيذ النظام على مراحل حتى يرى العميل نتيجة مبكرة قبل التوسع الكامل");
  const phases = [
    ["1", "تحليل وتجربة المستخدم", "تثبيت الفروع والمصادر ومراحل البيع"],
    ["2", "النواة الأساسية", "العملاء والصفقات والصلاحيات"],
    ["3", "التوزيع والتنبيهات", "واتساب، إيميل، قواعد الفروع"],
    ["4", "الذكاء والتقارير", "تصنيف العملاء ولوحات الإدارة"],
    ["5", "الإطلاق والتدريب", "تسليم، تدريب، دعم وتحسينات"]
  ];
  phases.forEach(([n, title, body], i) => {
    const x = 926 - i * 198;
    slide.shapes.add({
      geometry: "ellipse",
      position: { left: x + 52, top: 318, width: 54, height: 54 },
      fill: i === 0 ? C.green : "#FFFFFF",
      line: { style: "solid", fill: i === 0 ? C.green : C.line, width: 2 },
    });
    addText(slide, n, { left: x + 52, top: 329, width: 54, height: 36 }, {
      fontSize: 21,
      bold: true,
      color: i === 0 ? "#FFFFFF" : C.navy,
      alignment: "center",
    });
    addText(slide, title, { left: x - 14, top: 392, width: 186, height: 42 }, { fontSize: 20, bold: true, color: C.navy, alignment: "center" });
    addText(slide, body, { left: x - 16, top: 440, width: 190, height: 68 }, { fontSize: 16, color: C.muted, alignment: "center" });
    if (i < phases.length - 1) addRule(slide, x - 88, 345, 80, C.line, 2);
  });
  addSources(slide);
}

function slide12() {
  const slide = presentation.slides.add();
  slide.background.fill = "#FFFFFF";
  addHeader(slide, 13);
  addTitle(slide, "النتيجة المتوقعة: مبيعات أسرع وإدارة أوضح", "نظام علاقات عملاء ذكي يحول كل عميل جديد إلى فرصة منظمة ومتابعة قابلة للقياس");
  addBullets(slide, [
    "استجابة أسرع للعملاء المحتملين",
    "تقليل ضياع الفرص بين الفروع والقنوات",
    "رفع وضوح الإدارة على مصادر العملاء ونسبة الإغلاق",
    "توحيد طريقة عمل فريق المبيعات",
    "قابلية تطوير النظام لاحقًا حسب نمو الشركة"
  ], 526, 316, 602, { fontSize: 23, lineH: 54, dotColor: C.green });
  slide.shapes.add({
    geometry: "roundRect",
    position: { left: 126, top: 348, width: 318, height: 142 },
    fill: C.navy,
    line: { style: "solid", fill: C.navy, width: 1 },
    borderRadius: 8,
  });
  addText(slide, "الخطوة التالية", { left: 160, top: 378, width: 250, height: 38 }, { fontSize: 24, bold: true, color: "#FFFFFF", alignment: "center" });
  addText(slide, "جلسة قصيرة لتثبيت الفروع ومصادر العملاء ومراحل البيع قبل عرض التكلفة النهائية", { left: 154, top: 430, width: 262, height: 64 }, { fontSize: 18, color: "#FFFFFF", alignment: "center" });
  addSources(slide);
}

addWelcome();
addCover();
slide2();
slide3();
slide4();
slide5();
slide6();
slide7();
slide8();
slide9();
slide10();
slide11();
slide12();

const montage = await presentation.export({ format: "webp", montage: true, scale: 1 });
await fs.writeFile(path.join(TMP_DIR, "crm-deck-montage.webp"), new Uint8Array(await montage.arrayBuffer()));

for (const [i, slide] of presentation.slides.items.entries()) {
  const png = await presentation.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(TMP_DIR, `slide-${String(i + 1).padStart(2, "0")}.png`), new Uint8Array(await png.arrayBuffer()));
  const layout = await slide.export({ format: "layout" });
  await fs.writeFile(path.join(TMP_DIR, `slide-${String(i + 1).padStart(2, "0")}.layout.json`), await layout.text());
}

const inspect = await presentation.inspect({ kind: "slide,textbox,shape,image,notes", maxChars: 12000 });
await fs.writeFile(path.join(TMP_DIR, "inspect.ndjson"), inspect.ndjson);

const pptx = await PresentationFile.exportPptx(presentation);
await pptx.save(FINAL_PPTX);
console.log(FINAL_PPTX);
