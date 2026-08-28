import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

async function generateMemberHandbookPDF() {
  console.log('📄 Generating YOSU Official Member Handbook PDF (2026/2027 Edition)...');

  const outputDir = path.join(process.cwd(), 'public', 'documents');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'yosu-member-handbook.pdf');
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 40, bottom: 40, left: 45, right: 45 },
    bufferPages: true,
  });

  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  // Palette
  const EMERALD = '#064e3b';
  const GOLD = '#d97706';
  const DARK_SLATE = '#0f172a';
  const MUTED_TEXT = '#475569';
  const LIGHT_BG = '#f8fafc';
  const BORDER_COLOR = '#cbd5e1';

  // Helper Functions
  const drawHeader = (title: string) => {
    doc.rect(45, doc.y, 505, 24).fill(EMERALD);
    doc
      .fillColor('#ffffff')
      .fontSize(11)
      .font('Helvetica-Bold')
      .text(title.toUpperCase(), 55, doc.y - 18);
    doc.moveDown(0.8);
  };

  const drawSubHeader = (title: string) => {
    doc
      .fillColor(GOLD)
      .fontSize(11)
      .font('Helvetica-Bold')
      .text(title);
    doc.moveDown(0.3);
  };

  const drawParagraph = (text: string) => {
    doc
      .fillColor(DARK_SLATE)
      .fontSize(9.5)
      .font('Helvetica')
      .text(text, { align: 'justify', lineGap: 3 });
    doc.moveDown(0.5);
  };

  const drawBullet = (boldTitle: string, description: string) => {
    doc
      .fillColor(EMERALD)
      .fontSize(9.5)
      .font('Helvetica-Bold')
      .text(`• ${boldTitle}: `, { continued: true })
      .fillColor(DARK_SLATE)
      .font('Helvetica')
      .text(description, { lineGap: 2 });
    doc.moveDown(0.3);
  };

  // ==========================================
  // COVER / HEADER BANNER
  // ==========================================
  doc.rect(45, 40, 505, 80).fill(EMERALD);

  doc
    .fillColor('#ffffff')
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('YORUBA STUDENTS\' UNION (YOSU)', 55, 52, { align: 'center' });

  doc
    .fillColor('#fef08a')
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('FEDERAL UNIVERSITY DUTSE CHAPTER', { align: 'center' });

  doc
    .fillColor('#ffffff')
    .fontSize(10)
    .font('Helvetica')
    .text('OFFICIAL MEMBER HANDBOOK & CODE OF CONDUCT (2026/2027)', { align: 'center' });

  doc
    .fillColor(GOLD)
    .fontSize(9)
    .font('Helvetica-Oblique')
    .text('Theme: Progress Era, Academic Excellence & Cultural Integrity', { align: 'center' });

  doc.y = 135;

  // ==========================================
  // SECTION 1: PRESIDENTIAL CHARGE
  // ==========================================
  drawHeader('1. Presidential Charge & Welcome Message');

  doc
    .rect(45, doc.y, 505, 80)
    .fillAndStroke('#f0fdf4', '#bbf7d0');

  const quoteStartY = doc.y - 72;
  doc
    .fillColor(EMERALD)
    .fontSize(9.5)
    .font('Helvetica-BoldOblique')
    .text('"On behalf of the Executive Council, I extend a warm fraternal welcome to all freshmen and returning scholars of Yoruba origin at FUD. Our 2026/2027 Progress Era administration is anchored on three non-negotiable pillars: Academic Excellence, Transparent Student Welfare, and Cultural Heritage Preservation. Remember, your primary purpose in Dutse is your degree; your secondary duty is building an unblemished character."', 55, quoteStartY, { width: 485, align: 'center', lineGap: 2 });

  doc
    .fillColor(DARK_SLATE)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('— Cmrd. Ibrahim Sobur Bamidele (Executive President, YOSU FUD)', { align: 'center' });

  doc.y = quoteStartY + 90;

  // ==========================================
  // SECTION 2: THE OMOLUWABI MORAL CODE
  // ==========================================
  drawHeader('2. The Ọmọlúwàbí Moral & Character Blueprint');

  drawParagraph(
    'At the heart of Yoruba heritage is the philosophy of Ọmọlúwàbí—an individual of flawless character, intellectual humility, and moral discipline. Every YOSU member must exemplify these 6 core tenets:'
  );

  drawBullet('Ìwà (Moral Character)', 'Absolute honesty in academic work, examination conduct, financial dealings, and personal relationships.');
  drawBullet('Ọ̀wọ̀ (Respect & Courtesy)', 'Profound deference and polite speech towards University Management, Lecturers, Staff, Elders, and Student Leaders.');
  drawBullet('Ìtìjú & Ìwọ̀ntúnwọ̀nsì (Modesty & Dignity)', 'Self-control in speech and appearance. Abstaining from public brawling, drunkenness, vulgarity, or disreputable acts.');
  drawBullet('Ọ̀rọ̀ Aiyé (Refined Speech)', 'Guarding speech against slander, cyber-bullying, false gossip, or hate speech on and off-campus.');
  drawBullet('Ìrànlọ́wọ́ (Communal Solidarity)', 'Serving as your brother’s and sister’s keeper by assisting colleagues in academic or personal distress.');
  drawBullet('Dídáńgájíá (Hard Work & Rigor)', 'Pursuing genuine academic merit through diligent study without seeking dishonest shortcuts.');

  doc.moveDown(0.5);

  // ==========================================
  // SECTION 3: ACADEMIC ADVISORY
  // ==========================================
  drawHeader('3. Academic Success & Study Counsel');

  drawSubHeader('A. The 75% Attendance & Classroom Discipline Rule');
  drawParagraph(
    'Federal University Dutse strictly enforces mandatory 75% lecture attendance for exam qualification. Arrive 10 minutes early for lectures, sit in the front rows, and take active personal notes during classes.'
  );

  drawSubHeader('B. Continuous Assessment (CA) & Past Questions Bank');
  drawParagraph(
    'Continuous Assessment accounts for 30% to 40% of your total course grade. Treat all tests, practicals, and term papers with maximum seriousness. Take advantage of the YOSU Free Past Question Bank & Academic Tutorials led by the Academic Directorate.'
  );

  drawSubHeader('C. Library & Research Engagement');
  drawParagraph(
    'Dedicate a minimum of 10 to 15 hours weekly to private study at the FUD Main Library or Faculty E-Libraries.'
  );

  // Add Page break for clean layout
  doc.addPage();

  // ==========================================
  // SECTION 4: MORAL CONDUCT & ZERO-TOLERANCE
  // ==========================================
  drawHeader('4. Campus Ethics & Zero-Tolerance Policies');

  doc
    .rect(45, doc.y, 505, 45)
    .fillAndStroke('#fef2f2', '#fecaca');

  const alertY = doc.y - 38;
  doc
    .fillColor('#991b1b')
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('CRITICAL WARNING ON CAMPUS VICES', 55, alertY, { align: 'center' });

  doc
    .fillColor('#7f1d1d')
    .fontSize(8.5)
    .font('Helvetica')
    .text('Examination Malpractice, Secret Cultism, Illicit Substance Abuse, and Cybercrime (Yahoo-Yahoo) carry immediate EXPULSION from Federal University Dutse and criminal prosecution by law enforcement agencies.', { align: 'center', lineGap: 1 });

  doc.y = alertY + 55;

  drawBullet('Examination Malpractice', 'Bringing unauthorized materials, phones, smartwatches, or "expo" into exam halls results in expulsion. Defend your degree with integrity.');
  drawBullet('Secret Cultism', 'Cultism is illegal and life-threatening. YOSU maintains zero tolerance. Solicitation or threat must be reported to the Disciplinary Officer or University Security immediately.');
  drawBullet('Substance Abuse', 'Avoid illicit drugs, codeine, or addiction. Protect your mental health and academic future.');
  drawBullet('Dress Code Compliance', 'Adhere strictly to FUD Senate guidelines on decent attire in lecture halls, offices, and library premises.');

  doc.moveDown(0.5);

  // ==========================================
  // SECTION 5: LIVING IN DUTSE & HOST COMMUNITY
  // ==========================================
  drawHeader('5. Living in Dutse: Community Respect & Safety');

  drawParagraph(
    'Jigawa State is a serene, hospitable host environment. Show high respect to the Hausa/Fulani host community, Islamic traditions, and local customs in Dutse township, Garki, Rasheed Shekoni quarters, and off-campus residences. Resolve disputes peacefully through the Executive Council or Disciplinary Officer.'
  );

  doc.moveDown(0.5);

  // ==========================================
  // SECTION 6: EXECUTIVE COUNCIL DIRECTORY (2026/2027)
  // ==========================================
  drawHeader('6. Executive Council Directory (2026/2027)');

  const execs = [
    { title: 'President', name: 'Cmrd. Ibrahim Sobur Bamidele', dept: 'Software Eng.', state: 'Ekiti', phone: '09129324801' },
    { title: 'Vice President', name: 'Latifat Usman Gidado', dept: 'Business Admin.', state: 'Kwara', phone: '07082022496' },
    { title: 'Secretary-General', name: 'Capat Olumide Oyerinde', dept: 'Nursing Science', state: 'Osun', phone: '08139531637' },
    { title: 'Asst. Sec-General', name: 'Awe Abosede Blessing', dept: 'Business Admin.', state: 'Kogi', phone: '08082666837' },
    { title: 'Treasurer', name: 'Abdulsamad Muhammad-Tirimiz', dept: 'Business Admin.', state: 'Oyo', phone: '08124093204' },
    { title: 'Financial Secretary', name: 'Oluwande Zynab Arike', dept: 'Chemistry', state: 'Osun', phone: '09012705947' },
    { title: 'Auditor-General', name: 'Ibrahim Hameedat Abiodun', dept: 'English Lang.', state: 'Kwara', phone: '07045325352' },
    { title: 'Academic Director', name: 'Oloyede Habeebullah Ademola', dept: 'English & Ling.', state: 'Ogun', phone: '09161155259' },
    { title: 'Disciplinary Officer', name: 'Alabi Abdulbaaki Inaolaji', dept: 'English & Ling.', state: 'Osun', phone: '08072036509' },
    { title: 'OBA of YOSU', name: 'Fouad Adegoke Adedotun', dept: 'Agric Economics', state: 'Oyo', phone: '09023196391' },
    { title: 'Olori I', name: 'Mercy Nenadi Jeremiah', dept: 'English Lang.', state: 'Ekiti', phone: '08059989953' },
    { title: 'Olori II', name: 'Abdulrashid Ishaku Karimat', dept: 'Human Phys.', state: 'Oyo', phone: '09025091406' },
  ];

  // Draw Table
  const startY = doc.y;
  doc.rect(45, startY, 505, 18).fill(EMERALD);

  doc
    .fillColor('#ffffff')
    .fontSize(8.5)
    .font('Helvetica-Bold');

  doc.text('OFFICE TITLE', 50, startY + 4, { width: 110 });
  doc.text('OFFICER NAME', 165, startY + 4, { width: 150 });
  doc.text('STATE', 320, startY + 4, { width: 60 });
  doc.text('DEPARTMENT', 385, startY + 4, { width: 90 });
  doc.text('PHONE', 480, startY + 4, { width: 65 });

  let rowY = startY + 18;
  execs.forEach((ex, idx) => {
    const bg = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
    doc.rect(45, rowY, 505, 15).fill(bg);

    doc.fillColor(DARK_SLATE).fontSize(8).font('Helvetica');
    doc.text(ex.title, 50, rowY + 3, { width: 110 });
    doc.text(ex.name, 165, rowY + 3, { width: 150 });
    doc.text(ex.state, 320, rowY + 3, { width: 60 });
    doc.text(ex.dept, 385, rowY + 3, { width: 90 });
    doc.text(ex.phone, 480, rowY + 3, { width: 65 });

    rowY += 15;
  });

  doc.y = rowY + 15;

  // ==========================================
  // SECTION 7: SECRETARIAT & PORTAL ACCESS
  // ==========================================
  drawHeader('7. Digital Portal Access & Official Secretariat');

  drawParagraph(
    '1. Access member portal: https://yosufud.org.ng/register\n2. Verify matriculation number, department, and constituent state.\n3. Download your official digital YOSU Member Pass & Registration Slip.'
  );

  doc
    .rect(45, doc.y, 505, 35)
    .fillAndStroke('#f1f5f9', BORDER_COLOR);

  const secY = doc.y - 30;
  doc
    .fillColor(DARK_SLATE)
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .text('YOSU OFFICIAL HEADQUARTERS & SECRETARIAT DIRECTORY', 55, secY, { align: 'center' });

  doc
    .fillColor(MUTED_TEXT)
    .fontSize(8)
    .font('Helvetica')
    .text('Student Union Complex, Federal University Dutse, PMB 7156, Dutse, Jigawa State.\nEmail: info@yosu.fud.edu.ng | Phone: +234 912 932 4801, +234 913 644 7931', { align: 'center', lineGap: 1 });

  // Add Page Numbers
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc
      .fillColor(MUTED_TEXT)
      .fontSize(8)
      .font('Helvetica')
      .text(
        `YORUBA STUDENTS' UNION (YOSU) OFFICIAL MEMBER HANDBOOK — Page ${i + 1} of ${range.count}`,
        45,
        doc.page.height - 30,
        { align: 'center', width: 505 }
      );
  }

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      console.log(`✅ YOSU Official Member Handbook PDF generated successfully at: ${outputPath}`);
      resolve(outputPath);
    });
    writeStream.on('error', reject);
  });
}

generateMemberHandbookPDF()
  .catch((e) => {
    console.error('❌ Error generating PDF:', e);
    process.exit(1);
  });
