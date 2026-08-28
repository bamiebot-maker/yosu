import {
  PrismaClient,
  RoleCode,
  OfficeCategory,
  ArticleStatus,
  ProjectStatus,
} from '@prisma/client';
import { hashPassword } from '../lib/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting YOSU Official Database Seeding (Progress Era & Historical Archives)...');

  // 0. IDEMPOTENT SAFETY (PRESERVE LIVE DATA)
  console.log('  -> Safe seed mode: preserving live production database records...');

  // 1. ROLES & PERMISSIONS
  console.log('  -> Seeding System Roles...');
  const superAdminRole = await prisma.role.upsert({
    where: { code: RoleCode.SUPER_ADMIN },
    update: {},
    create: {
      code: RoleCode.SUPER_ADMIN,
      name: 'Super Administrator',
      description: 'Unrestricted system governance & security oversight',
      isSystem: true,
    },
  });

  const rolesToSeed = [
    { code: RoleCode.ADMIN, name: 'Administrator', description: 'Website content management & leadership publishing' },
    { code: RoleCode.PRESIDENT, name: 'Executive President', description: 'Chief Executive Officer of YOSU SUG FUD' },
    { code: RoleCode.VICE_PRESIDENT, name: 'Vice President', description: 'Deputy Executive Officer & Welfare Overseer' },
    { code: RoleCode.SECRETARY_GENERAL, name: 'Secretary General', description: 'Chief Administrative Secretariat Officer' },
    { code: RoleCode.PUBLISHER, name: 'Content Publisher', description: 'News creation, announcements & media uploader' },
    { code: RoleCode.EDITOR, name: 'Editorial Reviewer', description: 'Draft article editor and content reviewer' },
    { code: RoleCode.TREASURER, name: 'Treasurer', description: 'Fiscal officer managing financial records' },
    { code: RoleCode.AUDITOR, name: 'Auditor General', description: 'Independent auditor for union accounts' },
    { code: RoleCode.EXECUTIVE_MEMBER, name: 'Executive Council Member', description: 'Sworn Executive Council Officer' },
    { code: RoleCode.LEGISLATIVE_MEMBER, name: 'Legislative Representative', description: 'House of Representatives Delegate' },
    { code: RoleCode.MODERATOR, name: 'Community Moderator', description: 'Moderator for student forum & submissions' },
    { code: RoleCode.GUEST_ADMIN, name: 'Guest Admin (Read Only)', description: 'Read-only access to admin dashboards' },
    { code: RoleCode.MEMBER, name: 'Bona Fide Member', description: 'Registered student member of YOSU FUD' },
  ];

  for (const r of rolesToSeed) {
    await prisma.role.upsert({
      where: { code: r.code },
      update: { name: r.name, description: r.description },
      create: { code: r.code, name: r.name, description: r.description, isSystem: true },
    });
  }

  // 2. CENTRAL MEDIA LIBRARY ASSETS & REAL INAUGURATION PHOTOS
  console.log('  -> Seeding Real Inauguration & Leadership Media Assets...');
  const logoMedia = await prisma.media.create({
    data: {
      filename: 'yosu-official-logo.png',
      url: '/images/logo.png',
      mimeType: 'image/png',
      sizeBytes: 644995,
      altText: 'Official Logo of Yoruba Students Union (YOSU), Federal University Dutse Chapter',
    },
  });

  const heroBgMedia = await prisma.media.create({
    data: {
      filename: 'inauguration-handover.jpg',
      url: '/images/gallery/inauguration-handover.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 289967,
      altText: 'Official Swearing-in & Certificate Presentation of the 2026/2027 Comdr Sobur-Led Administration',
    },
  });

  const womenExecsMedia = await prisma.media.create({
    data: {
      filename: 'women-executives.jpg',
      url: '/images/gallery/women-executives.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 330020,
      altText: 'Female Executive Officers & Traditional Matrons of YOSU FUD',
    },
  });

  const presidentAddressMedia = await prisma.media.create({
    data: {
      filename: 'president-sobur-address.jpg',
      url: '/images/gallery/president-sobur-address.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 259714,
      altText: 'Cmrd. Ibrahim Sobur Bamidele Delivering Inaugural Address',
    },
  });

  const lineupMedia = await prisma.media.create({
    data: {
      filename: 'sobur-administration-lineup.jpg',
      url: '/images/gallery/sobur-administration-lineup.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 289800,
      altText: 'Complete Lineup of the 2026/2027 Executive Officers with Certificates of Office',
    },
  });

  const stageGroupMedia = await prisma.media.create({
    data: {
      filename: 'inauguration-stage-group.jpg',
      url: '/images/gallery/inauguration-stage-group.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 289195,
      altText: 'Executive Officers Assembly on Auditorium Stage',
    },
  });

  const celebrationMedia = await prisma.media.create({
    data: {
      filename: 'inauguration-celebration.png',
      url: '/images/gallery/inauguration-celebration.png',
      mimeType: 'image/png',
      sizeBytes: 1029689,
      altText: 'Student Union Officers Celebrating Victory and Swearing-In',
    },
  });

  const certServiceMedia = await prisma.media.create({
    data: {
      filename: 'certificate-service-presentation.jpg',
      url: '/images/gallery/certificate-service-presentation.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 273026,
      altText: 'Presentation of Certificate of Service to Executive Officer',
    },
  });

  const soburCertMedia = await prisma.media.create({
    data: {
      filename: 'sobur-certificate-presentation.jpg',
      url: '/images/gallery/sobur-certificate-presentation.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 291446,
      altText: 'Cmrd. Ibrahim Sobur Bamidele Receiving Official Certificate of Office as President',
    },
  });

  const culturalDanceMedia = await prisma.media.create({
    data: {
      filename: 'cultural-celebration-dance.jpg',
      url: '/images/gallery/cultural-celebration-dance.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 283448,
      altText: 'Traditional Yoruba Cultural Dance Performance & Celebration',
    },
  });

  const danceTroupeMedia = await prisma.media.create({
    data: {
      filename: 'cultural-dance-troupe.png',
      url: '/images/gallery/cultural-dance-troupe.png',
      mimeType: 'image/png',
      sizeBytes: 960091,
      altText: 'Yoruba Cultural Dance Troupe Performing at FUD Auditorium',
    },
  });

  const excoSpeechMedia = await prisma.media.create({
    data: {
      filename: 'executive-council-speech.jpg',
      url: '/images/gallery/executive-council-speech.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 293845,
      altText: 'Executive Council Address & Traditional Song Performance',
    },
  });

  const nairaSprayMedia = await prisma.media.create({
    data: {
      filename: 'naira-spray-celebration.jpg',
      url: '/images/gallery/naira-spray-celebration.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 283448,
      altText: 'Cultural Festivity & Traditional Celebration',
    },
  });

  const tradGroupMedia = await prisma.media.create({
    data: {
      filename: 'traditional-title-group.jpg',
      url: '/images/gallery/traditional-title-group.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 278095,
      altText: 'Group Presentation of Certificate to Traditional Title Officers',
    },
  });

  const choreoDanceMedia = await prisma.media.create({
    data: {
      filename: 'cultural-choreography-dance.png',
      url: '/images/gallery/cultural-choreography-dance.png',
      mimeType: 'image/png',
      sizeBytes: 1048516,
      altText: 'Yoruba Cultural Dance Choreography Performance in Pattern Attire',
    },
  });

  const singersMedia = await prisma.media.create({
    data: {
      filename: 'cultural-singers-performance.png',
      url: '/images/gallery/cultural-singers-performance.png',
      mimeType: 'image/png',
      sizeBytes: 939619,
      altText: 'Yoruba Cultural Choir & Microphones Performance',
    },
  });

  const execsSeatedMedia = await prisma.media.create({
    data: {
      filename: 'executives-seated-hall.jpg',
      url: '/images/gallery/executives-seated-hall.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 280661,
      altText: 'Executive Officers Seated in Inauguration Auditorium Hall',
    },
  });

  const outdoorDelegationMedia = await prisma.media.create({
    data: {
      filename: 'outdoor-executive-delegation.jpg',
      url: '/images/gallery/outdoor-executive-delegation.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 344049,
      altText: 'Outdoor Executive Officers Delegation Group Portrait on FUD Campus Grounds',
    },
  });

  // OFFICIAL LEADERSHIP HEADSHOTS (PUBLIC/IMAGES/LEADERSHIP/)
  const presidentPortraitMedia = await prisma.media.create({
    data: {
      filename: 'president-sobur.jpg',
      url: '/images/leadership/president-sobur.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 286879,
      altText: 'Official Portrait of Cmrd. Ibrahim Sobur Bamidele, Executive President of YOSU FUD',
    },
  });

  const vpPortraitMedia = await prisma.media.create({
    data: {
      filename: 'vp-latifat.jpg',
      url: '/images/leadership/vp-latifat.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 109753,
      altText: 'Official Portrait of Latifat Usman Gidado, Vice President of YOSU FUD',
    },
  });

  const secGenPortraitMedia = await prisma.media.create({
    data: {
      filename: 'secgen-olumide.jpg',
      url: '/images/leadership/secgen-olumide.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 63084,
      altText: 'Official Portrait of Olumide Oyerinde, Secretary General',
    },
  });

  const asstSecGenPortraitMedia = await prisma.media.create({
    data: {
      filename: 'asst-secgen-blessing.jpg',
      url: '/images/leadership/asst-secgen-blessing.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 69928,
      altText: 'Official Portrait of Awe Abosede Blessing, Assistant Secretary General',
    },
  });

  const treasurerPortraitMedia = await prisma.media.create({
    data: {
      filename: 'treasurer-trimiz.jpg',
      url: '/images/leadership/treasurer-trimiz.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 59167,
      altText: 'Official Portrait of Abdulsamad M. Trimiz, Treasurer',
    },
  });

  const finSecPortraitMedia = await prisma.media.create({
    data: {
      filename: 'finsec-arike.jpg',
      url: '/images/leadership/finsec-arike.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 215441,
      altText: 'Official Portrait of Oluwande Zynab Arike, Financial Secretary',
    },
  });

  const cultureDir1PortraitMedia = await prisma.media.create({
    data: {
      filename: 'culture-dir-moridiyat.jpg',
      url: '/images/leadership/culture-dir-moridiyat.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 93673,
      altText: 'Official Portrait of Moridiyat Olamide Abdulganiyu, Director of Cultural Affairs',
    },
  });

  const cultureDir2PortraitMedia = await prisma.media.create({
    data: {
      filename: 'culture-dir-aishat.jpg',
      url: '/images/leadership/culture-dir-aishat.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 289008,
      altText: 'Official Portrait of Hamzat Aishat Opeyemi, Director of Culture',
    },
  });

  const academicDirPortraitMedia = await prisma.media.create({
    data: {
      filename: 'academic-dir-habeebullah.jpg',
      url: '/images/leadership/academic-dir-habeebullah.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 50209,
      altText: 'Official Portrait of Oloyede Habeebullah Ademola, Academic Director',
    },
  });

  const welfare1PortraitMedia = await prisma.media.create({
    data: {
      filename: 'welfare1-mercy.jpg',
      url: '/images/leadership/welfare1-mercy.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 125478,
      altText: 'Official Portrait of Balogun Mercy Azeezat, Welfare Director 1',
    },
  });

  const welfare2PortraitMedia = await prisma.media.create({
    data: {
      filename: 'welfare2-sekinat.jpg',
      url: '/images/leadership/welfare2-sekinat.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 101095,
      altText: 'Official Portrait of Olatunbosun Sekinat M., Welfare Director',
    },
  });

  const sports1PortraitMedia = await prisma.media.create({
    data: {
      filename: 'sports-mubarak.jpg',
      url: '/images/leadership/sports-mubarak.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 141337,
      altText: 'Official Portrait of Abdulazeez Mubarak Abiola, Sport Director 1',
    },
  });

  const auditorPortraitMedia = await prisma.media.create({
    data: {
      filename: 'auditor-hameedat.jpg',
      url: '/images/leadership/auditor-hameedat.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 62444,
      altText: 'Official Portrait of Ibrahim Hameedat Abiodun, Auditor General',
    },
  });

  const social2PortraitMedia = await prisma.media.create({
    data: {
      filename: 'social2-mufeedat.jpg',
      url: '/images/leadership/social2-mufeedat.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 283834,
      altText: 'Official Portrait of Mufeedat Adeola Oyewo, Social Directress 2',
    },
  });

  const disciplinaryPortraitMedia = await prisma.media.create({
    data: {
      filename: 'disciplinary-abdulbaki.jpg',
      url: '/images/leadership/disciplinary-abdulbaki.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 58902,
      altText: 'Official Portrait of Alabi Abdulbaki, Disciplinary Officer',
    },
  });

  const obaPortraitMedia = await prisma.media.create({
    data: {
      filename: 'oba-fouad.jpg',
      url: '/images/leadership/oba-fouad.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 51981,
      altText: 'Official Royal Portrait of OBA Fouad Adegoke Adedotun',
    },
  });

  const olori1PortraitMedia = await prisma.media.create({
    data: {
      filename: 'olori1-mercy.jpg',
      url: '/images/leadership/olori1-mercy.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 63196,
      altText: 'Official Portrait of Olori 1 Mercy N. Jeremiah',
    },
  });

  const olori2PortraitMedia = await prisma.media.create({
    data: {
      filename: 'olori-karimat.jpg',
      url: '/images/leadership/olori-karimat.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 139391,
      altText: 'Official Portrait of Olori 2 Karimat Isyaku Abdulrasheed',
    },
  });

  const speakerPortraitMedia = await prisma.media.create({
    data: {
      filename: 'speaker-alabi.jpg',
      url: '/images/leadership/speaker-alabi.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 119635,
      altText: 'Official Portrait of Speaker Alabi Oyeniyi',
    },
  });

  // 3. MULTI-SESSION ADMINISTRATION SEEDING (2026/2027 PROGRESS ERA + 2025/2026 HISTORICAL)
  console.log('  -> Seeding Administration Sessions...');
  
  // Active Administration Session: 2026/2027 Progress Era
  const currentSession = await prisma.administrationSession.create({
    data: {
      title: '2026/2027 Session',
      slug: '2026-2027',
      theme: 'The Progress Era',
      startDate: new Date('2026-07-10'),
      isCurrent: true,
      achievements: {
        create: [
          {
            title: 'Ratification of 2026 Unification Constitution',
            description: 'Codified the 8 Yoruba Constituent States representation framework and established independent CRC.',
            category: 'LEGISLATION',
            displayOrder: 1,
          },
          {
            title: 'Digital Portal & Member Verification E-Infrastructure',
            description: 'Launched official web portal for transparent student governance and digital gazettes.',
            category: 'INFRASTRUCTURE',
            displayOrder: 2,
          },
          {
            title: 'Àṣà Day Cultural Heritage Festival 2026',
            description: 'Organized flagship cultural festival uniting over 1,200 Yoruba students across Federal University Dutse.',
            category: 'CULTURE',
            displayOrder: 3,
          },
        ],
      },
    },
  });

  // Historical Past Session
  const pastSession = await prisma.administrationSession.create({
    data: {
      title: '2025/2026 Session',
      slug: '2025-2026',
      theme: 'The Pioneer Unification Administration',
      startDate: new Date('2025-07-01'),
      endDate: new Date('2026-07-09'),
      isCurrent: false,
      achievements: {
        create: [
          {
            title: 'Establishment of FUD Yoruba Student Congress',
            description: 'Unified all 8 state student associations under a central institutional umbrella.',
            category: 'GOVERNANCE',
            displayOrder: 1,
          },
          {
            title: 'Pioneer Academic Tutorial Scheme',
            description: 'Delivered FREE exam preparatory tutorials for 100L and 200L freshmen.',
            category: 'ACADEMIC',
            displayOrder: 2,
          },
        ],
      },
    },
  });

  // Hash password for default Super Admin
  const hashedPassword = await hashPassword('AdminPassword2026!');
  const bamiebotPasswordHash = await hashPassword('Akidah22#');

  // Create User accounts
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@yosu.fud.edu.ng',
      passwordHash: hashedPassword,
      isActive: true,
      userRoles: {
        create: { roleId: superAdminRole.id },
      },
    },
  });

  const bamiebotPerson = await prisma.person.create({
    data: {
      fullName: 'Super Admin Secretariat',
      email: 'bamiebot@gmail.com',
      stateOfOrigin: 'Oyo',
    },
  });

  await prisma.user.create({
    data: {
      email: 'bamiebot@gmail.com',
      passwordHash: bamiebotPasswordHash,
      isActive: true,
      personId: bamiebotPerson.id,
      userRoles: {
        create: { roleId: superAdminRole.id },
      },
    },
  });

  // 4. PERSON REPOSITORIES & APPOINTMENTS (2026/2027 PROGRESS ERA OFFICERS WITH UPLOADED PORTRAITS)
  console.log('  -> Seeding Official 2026/2027 Leadership Officers with Uploaded Headshots...');

  // A. President
  const presidentPerson = await prisma.person.create({
    data: {
      fullName: 'Cmrd. Ibrahim Sobur Bamidele',
      email: 'president@yosu.fud.edu.ng',
      phoneNumber: '+2348012345678',
      matricNumber: 'FUD/2022/PA/1001',
      stateOfOrigin: 'Ekiti',
      department: 'Public Administration',
      level: '400 Level',
      bio: 'President of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter. Leading the historic 2026/2027 Progress Era Administration dedicated to academic excellence, transparent governance, and student welfare.',
      avatarMediaId: presidentPortraitMedia.id,
    },
  });

  await prisma.user.update({
    where: { id: adminUser.id },
    data: { personId: presidentPerson.id },
  });

  // B. Vice President
  const vpPerson = await prisma.person.create({
    data: {
      fullName: 'Latifat Usman Gidado',
      email: 'vp@yosu.fud.edu.ng',
      stateOfOrigin: 'Kwara',
      department: 'Microbiology',
      level: '400 Level',
      bio: 'Vice President of the 2026/2027 Progress Era Administration. Committed to student welfare and academic mentorship.',
      avatarMediaId: vpPortraitMedia.id,
    },
  });

  // C. Secretary General
  const secGenPerson = await prisma.person.create({
    data: {
      fullName: 'Olumide Oyerinde',
      email: 'secgen@yosu.fud.edu.ng',
      stateOfOrigin: 'Ogun',
      department: 'Political Science',
      level: '300 Level',
      bio: 'Secretary General of the Union. Chief Administrative Officer of the Executive Council.',
      avatarMediaId: secGenPortraitMedia.id,
    },
  });

  // D. Assistant Secretary General
  const asstSecGenPerson = await prisma.person.create({
    data: {
      fullName: 'Awe Abosede Blessing',
      stateOfOrigin: 'Ekiti',
      department: 'Sociology',
      level: '300 Level',
      bio: 'Assistant Secretary General in the 2026/2027 Administration.',
      avatarMediaId: asstSecGenPortraitMedia.id,
    },
  });

  // E. Treasurer
  const treasurerPerson = await prisma.person.create({
    data: {
      fullName: 'Abdulsamad M. Trimiz',
      stateOfOrigin: 'Oyo',
      department: 'Economics',
      level: '300 Level',
      bio: 'Treasurer of the Executive Council. Managing union funds with complete fiscal transparency.',
      avatarMediaId: treasurerPortraitMedia.id,
    },
  });

  // F. Financial Secretary
  const finSecPerson = await prisma.person.create({
    data: {
      fullName: 'Oluwande Zynab Arike',
      stateOfOrigin: 'Osun',
      department: 'Accounting',
      level: '300 Level',
      bio: 'Financial Secretary of the Executive Council.',
      avatarMediaId: finSecPortraitMedia.id,
    },
  });

  // G. Director of Cultural Affairs
  const cultureDir1Person = await prisma.person.create({
    data: {
      fullName: 'Moridiyat Olamide Abdulganiyu',
      stateOfOrigin: 'Osun',
      department: 'Linguistics',
      level: '300 Level',
      bio: 'Director of Cultural Affairs. Promoting Yoruba cultural heritage, festival arts, and linguistic unity.',
      avatarMediaId: cultureDir1PortraitMedia.id,
    },
  });

  // H. Director of Culture
  const cultureDir2Person = await prisma.person.create({
    data: {
      fullName: 'Hamzat Aishat Opeyemi',
      stateOfOrigin: 'Kwara',
      department: 'History & International Studies',
      level: '300 Level',
      bio: 'Director of Culture. Custodian of traditional celebrations and heritage projects.',
      avatarMediaId: cultureDir2PortraitMedia.id,
    },
  });

  // I. Academic Director
  const academicDirPerson = await prisma.person.create({
    data: {
      fullName: 'Oloyede Habeebullah Ademola',
      stateOfOrigin: 'Oyo',
      department: 'Computer Science',
      level: '400 Level',
      bio: 'Academic Director. Spearheading student tutorial networks and academic excellence awards.',
      avatarMediaId: academicDirPortraitMedia.id,
    },
  });

  // J. Welfare Directors
  const welfare1Person = await prisma.person.create({
    data: {
      fullName: 'Balogun Mercy Azeezat',
      stateOfOrigin: 'Ogun',
      department: 'Biochemistry',
      level: '300 Level',
      bio: 'Welfare Director 1. Dedicated to member accommodation and health support.',
      avatarMediaId: welfare1PortraitMedia.id,
    },
  });

  const welfare2Person = await prisma.person.create({
    data: {
      fullName: 'Olatunbosun Sekinat M.',
      stateOfOrigin: 'Lagos',
      department: 'Biology',
      level: '300 Level',
      bio: 'Welfare Director. Supporting student health and campus integration.',
      avatarMediaId: welfare2PortraitMedia.id,
    },
  });

  // K. Sports Directors
  const sports1Person = await prisma.person.create({
    data: {
      fullName: 'Abdulazeez Mubarak Abiola',
      stateOfOrigin: 'Oyo',
      department: 'Human Kinetics',
      level: '300 Level',
      bio: 'Sport Director 1. Organizing inter-state student leagues and athletics.',
      avatarMediaId: sports1PortraitMedia.id,
    },
  });

  const sports2Person = await prisma.person.create({
    data: {
      fullName: 'Oluwande Abdullahi Asda',
      stateOfOrigin: 'Osun',
      department: 'Physics',
      level: '300 Level',
      bio: 'Sport Director 2. Co-coordinating athletic competitions.',
    },
  });

  // L. Auditor General
  const auditorPerson = await prisma.person.create({
    data: {
      fullName: 'Ibrahim Hameedat Abiodun',
      stateOfOrigin: 'Kwara',
      department: 'Accounting',
      level: '400 Level',
      bio: 'Auditor General. Independent financial auditor for union accounts.',
      avatarMediaId: auditorPortraitMedia.id,
    },
  });

  // M. Social Directresses
  const social1Person = await prisma.person.create({
    data: {
      fullName: 'Khadijah Bolaji Tajudeen',
      stateOfOrigin: 'Ondo',
      department: 'Mass Communication',
      level: '300 Level',
      bio: 'Social Directress 1. Planning social gatherings and freshers welcome events.',
    },
  });

  const social2Person = await prisma.person.create({
    data: {
      fullName: 'Mufeedat Adeola Oyewo',
      stateOfOrigin: 'Kogi',
      department: 'Business Administration',
      level: '300 Level',
      bio: 'Social Directress 2. Co-coordinating student recreational events.',
      avatarMediaId: social2PortraitMedia.id,
    },
  });

  // N. Disciplinary Officer & PRO
  const disciplinaryPerson = await prisma.person.create({
    data: {
      fullName: 'Alabi Abdulbaki',
      stateOfOrigin: 'Osun',
      department: 'Criminology',
      level: '400 Level',
      bio: 'Disciplinary Officer. Overseeing compliance and constitutional conduct.',
      avatarMediaId: disciplinaryPortraitMedia.id,
    },
  });

  const pro1Person = await prisma.person.create({
    data: {
      fullName: 'Tijani Umar Adeola',
      stateOfOrigin: 'Ondo',
      department: 'Mass Communication',
      level: '300 Level',
      bio: 'Public Relations Officer 1. Chief Communications Officer of the Union.',
    },
  });

  // O. Traditional Title Holders
  const obaPerson = await prisma.person.create({
    data: {
      fullName: 'Fouad Adegoke Adedotun',
      stateOfOrigin: 'Oyo',
      department: 'Public Administration',
      bio: 'Oba of the Yoruba Students\' Union (YOSU FUD). Royal Custodian of Culture and Heritage.',
      avatarMediaId: obaPortraitMedia.id,
    },
  });

  const olori1Person = await prisma.person.create({
    data: {
      fullName: 'Mercy N. Jeremiah',
      stateOfOrigin: 'Ogun',
      department: 'Sociology',
      bio: 'Olori 1. Traditional Matron of Heritage.',
      avatarMediaId: olori1PortraitMedia.id,
    },
  });

  const olori2Person = await prisma.person.create({
    data: {
      fullName: 'Karimat Isyaku Abdulrasheed',
      stateOfOrigin: 'Kwara',
      department: 'Biochemistry',
      bio: 'Olori 2. Traditional Matron of Heritage.',
      avatarMediaId: olori2PortraitMedia.id,
    },
  });

  // P. House Principal Officers
  const speakerPerson = await prisma.person.create({
    data: {
      fullName: 'Alabi Oyeniyi',
      email: 'speaker@yosu.fud.edu.ng',
      stateOfOrigin: 'Osun',
      department: 'Law',
      level: '400 Level',
      bio: 'Speaker of the House of Representatives for the 2026/2027 Legislative Session.',
      avatarMediaId: speakerPortraitMedia.id,
    },
  });

  const deputySpeakerPerson = await prisma.person.create({
    data: {
      fullName: 'Maryam',
      stateOfOrigin: 'Kwara',
      department: 'Political Science',
      level: '300 Level',
      bio: 'Deputy Speaker of the House of Representatives.',
    },
  });

  const clerkPerson = await prisma.person.create({
    data: {
      fullName: 'Abdulrauf Jamiu',
      stateOfOrigin: 'Oyo',
      department: 'Public Administration',
      level: '300 Level',
      bio: 'Clerk of the House of Representatives. Chief Legislative Administrator.',
    },
  });

  // 6. OFFICES & APPOINTMENTS BINDING
  console.log('  -> Binding Offices & Appointments for Current and Past Sessions...');
  const officesList = [
    { title: 'President', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 1 },
    { title: 'Vice President', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 2 },
    { title: 'Secretary General', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 3 },
    { title: 'Assistant Secretary General', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 4 },
    { title: 'Treasurer', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 5 },
    { title: 'Financial Secretary', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 6 },
    { title: 'Director of Cultural Affairs', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 7 },
    { title: 'Director of Culture', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 8 },
    { title: 'Academic Director', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 9 },
    { title: 'Welfare Director 1', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 10 },
    { title: 'Welfare Director', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 11 },
    { title: 'Sport Director 1', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 12 },
    { title: 'Sport Director 2', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 13 },
    { title: 'Auditor General', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 14 },
    { title: 'Social Directress 1', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 15 },
    { title: 'Social Directress 2', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 16 },
    { title: 'Disciplinary Officer', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 17 },
    { title: 'Public Relations Officer 1', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 18 },

    // Traditional Titles
    { title: 'OBA', category: OfficeCategory.TRADITIONAL_TITLE, defaultOrder: 19 },
    { title: 'Olori 1', category: OfficeCategory.TRADITIONAL_TITLE, defaultOrder: 20 },
    { title: 'Olori 2', category: OfficeCategory.TRADITIONAL_TITLE, defaultOrder: 21 },

    // Legislative Officers
    { title: 'Speaker of the House', category: OfficeCategory.PRINCIPAL_OFFICER_HOUSE, defaultOrder: 22 },
    { title: 'Deputy Speaker', category: OfficeCategory.PRINCIPAL_OFFICER_HOUSE, defaultOrder: 23 },
    { title: 'Clerk of the House', category: OfficeCategory.PRINCIPAL_OFFICER_HOUSE, defaultOrder: 24 },
  ];

  const createdOffices: Record<string, string> = {};
  for (const item of officesList) {
    const o = await prisma.office.create({ data: item });
    createdOffices[item.title] = o.id;
  }

  // APPOINTMENTS - 2026/2027 ACTIVE SESSION
  await prisma.officeAppointment.createMany({
    data: [
      { personId: presidentPerson.id, officeId: createdOffices['President'], sessionId: currentSession.id, displayOrder: 1 },
      { personId: vpPerson.id, officeId: createdOffices['Vice President'], sessionId: currentSession.id, displayOrder: 2 },
      { personId: secGenPerson.id, officeId: createdOffices['Secretary General'], sessionId: currentSession.id, displayOrder: 3 },
      { personId: asstSecGenPerson.id, officeId: createdOffices['Assistant Secretary General'], sessionId: currentSession.id, displayOrder: 4 },
      { personId: treasurerPerson.id, officeId: createdOffices['Treasurer'], sessionId: currentSession.id, displayOrder: 5 },
      { personId: finSecPerson.id, officeId: createdOffices['Financial Secretary'], sessionId: currentSession.id, displayOrder: 6 },
      { personId: cultureDir1Person.id, officeId: createdOffices['Director of Cultural Affairs'], sessionId: currentSession.id, displayOrder: 7 },
      { personId: cultureDir2Person.id, officeId: createdOffices['Director of Culture'], sessionId: currentSession.id, displayOrder: 8 },
      { personId: academicDirPerson.id, officeId: createdOffices['Academic Director'], sessionId: currentSession.id, displayOrder: 9 },
      { personId: welfare1Person.id, officeId: createdOffices['Welfare Director 1'], sessionId: currentSession.id, displayOrder: 10 },
      { personId: welfare2Person.id, officeId: createdOffices['Welfare Director'], sessionId: currentSession.id, displayOrder: 11 },
      { personId: sports1Person.id, officeId: createdOffices['Sport Director 1'], sessionId: currentSession.id, displayOrder: 12 },
      { personId: sports2Person.id, officeId: createdOffices['Sport Director 2'], sessionId: currentSession.id, displayOrder: 13 },
      { personId: auditorPerson.id, officeId: createdOffices['Auditor General'], sessionId: currentSession.id, displayOrder: 14 },
      { personId: social1Person.id, officeId: createdOffices['Social Directress 1'], sessionId: currentSession.id, displayOrder: 15 },
      { personId: social2Person.id, officeId: createdOffices['Social Directress 2'], sessionId: currentSession.id, displayOrder: 16 },
      { personId: disciplinaryPerson.id, officeId: createdOffices['Disciplinary Officer'], sessionId: currentSession.id, displayOrder: 17 },
      { personId: pro1Person.id, officeId: createdOffices['Public Relations Officer 1'], sessionId: currentSession.id, displayOrder: 18 },

      { personId: obaPerson.id, officeId: createdOffices['OBA'], sessionId: currentSession.id, displayOrder: 19 },
      { personId: olori1Person.id, officeId: createdOffices['Olori 1'], sessionId: currentSession.id, displayOrder: 20 },
      { personId: olori2Person.id, officeId: createdOffices['Olori 2'], sessionId: currentSession.id, displayOrder: 21 },

      { personId: speakerPerson.id, officeId: createdOffices['Speaker of the House'], sessionId: currentSession.id, displayOrder: 22 },
      { personId: deputySpeakerPerson.id, officeId: createdOffices['Deputy Speaker'], sessionId: currentSession.id, displayOrder: 23 },
      { personId: clerkPerson.id, officeId: createdOffices['Clerk of the House'], sessionId: currentSession.id, displayOrder: 24 },
    ],
  });

  // 7. PHOTO ALBUMS & INAUGURATION GALLERY
  console.log('  -> Seeding Official Photo Albums...');
  const inaugurationAlbum = await prisma.album.create({
    data: {
      title: 'Official Swearing-In & Handing Over Ceremony',
      slug: 'inauguration-2026-2027-sobur-administration',
      description: 'Official photographic archive of the swearing-in ceremony, certificate presentations, traditional royal court, and executive inauguration at Federal University Dutse auditorium.',
      coverMediaId: heroBgMedia.id,
      sessionId: currentSession.id,
      isPublic: true,
      mediaItems: {
        create: [
          { mediaId: heroBgMedia.id, caption: 'President Cmrd. Ibrahim Sobur Bamidele receiving the official certificate of office.', displayOrder: 1 },
          { mediaId: soburCertMedia.id, caption: 'Cmrd. Ibrahim Sobur Bamidele receiving his Certificate of Office as President.', displayOrder: 2 },
          { mediaId: obaPortraitMedia.id, caption: 'Royal Court: OBA Fouad Adegoke Adedotun & Oloris seated in traditional royal dignity.', displayOrder: 3 },
          { mediaId: outdoorDelegationMedia.id, caption: 'Outdoor Executive Delegation Portrait on FUD campus grounds.', displayOrder: 4 },
          { mediaId: presidentAddressMedia.id, caption: 'President Cmrd. Ibrahim Sobur Bamidele delivering his inaugural address.', displayOrder: 5 },
          { mediaId: womenExecsMedia.id, caption: 'Female Executive Officers and Traditional Title Holders at the swearing-in ceremony.', displayOrder: 6 },
          { mediaId: lineupMedia.id, caption: 'The 2026/2027 Executive Officers standing together with certificates of office.', displayOrder: 7 },
          { mediaId: execsSeatedMedia.id, caption: 'Executive Officers seated in inauguration auditorium hall.', displayOrder: 8 },
          { mediaId: stageGroupMedia.id, caption: 'Executive Officers assembly on stage at the FUD campus auditorium.', displayOrder: 9 },
          { mediaId: celebrationMedia.id, caption: 'Joyful celebration and cheer during the swearing-in ceremony.', displayOrder: 10 },
          { mediaId: certServiceMedia.id, caption: 'Presentation of Certificate of Service to Executive Officer.', displayOrder: 11 },
          { mediaId: tradGroupMedia.id, caption: 'Presentation of Certificate of Office to Traditional Title Officers.', displayOrder: 12 },
        ],
      },
    },
  });

  const asaDayAlbum = await prisma.album.create({
    data: {
      title: 'Àṣà Day & Cultural Heritage Festival (2026)',
      slug: 'asa-day-cultural-heritage-festival',
      description: 'Comprehensive photographic archive of the annual Yoruba Cultural Heritage Festival (Àṣà Day), showcasing traditional dance troupes, coral bead regalia, choir singing, and cultural festivity.',
      coverMediaId: culturalDanceMedia.id,
      sessionId: currentSession.id,
      isPublic: true,
      mediaItems: {
        create: [
          { mediaId: culturalDanceMedia.id, caption: 'Traditional Yoruba cultural dance performance & heritage celebration.', displayOrder: 1 },
          { mediaId: danceTroupeMedia.id, caption: 'Yoruba Cultural Dance Troupe performing at the FUD Auditorium.', displayOrder: 2 },
          { mediaId: choreoDanceMedia.id, caption: 'Yoruba Cultural Dance Choreography performance in traditional pattern attire.', displayOrder: 3 },
          { mediaId: singersMedia.id, caption: 'Yoruba Cultural Choir & Microphones live performance.', displayOrder: 4 },
          { mediaId: excoSpeechMedia.id, caption: 'Executive Council address & traditional anthem presentation.', displayOrder: 5 },
          { mediaId: nairaSprayMedia.id, caption: 'Cultural festivity and traditional naira spraying celebration.', displayOrder: 6 },
        ],
      },
    },
  });

  // 8. EVENTS SYSTEM SEEDING
  console.log('  -> Seeding Featured Events & Programs...');
  const handoverEvent = await prisma.event.create({
    data: {
      title: 'Swearing-In & Handing Over Ceremony to the Cmrd. Sobur-Led Administration',
      slug: 'handover-swearing-in-sobur-administration',
      description: 'The official inauguration and swearing-in ceremony of the 2026/2027 Yoruba Students\' Union (YOSU) administration led by Cmrd. Ibrahim Sobur Bamidele at the Federal University Dutse campus auditorium.',
      location: 'FUD Campus Auditorium, Federal University Dutse',
      startDate: new Date('2026-07-15T10:00:00Z'),
      endDate: new Date('2026-07-15T16:00:00Z'),
      isFeatured: true,
      organizer: 'Executive Council',
      bannerMediaId: heroBgMedia.id,
    },
  });

  const asaDayEvent = await prisma.event.create({
    data: {
      title: 'Àṣà Day & Cultural Heritage Festival (2026)',
      slug: 'asa-day-cultural-festival',
      description: 'Annual flagship cultural festival of YOSU FUD celebrating Yoruba heritage, traditional dance performances, royal court sittings, and linguistic unity across all 8 constituent states.',
      location: 'Student Union Complex Grounds & Auditorium',
      startDate: new Date('2026-08-20T09:00:00Z'),
      endDate: new Date('2026-08-20T18:00:00Z'),
      isFeatured: true,
      organizer: 'Director of Cultural Affairs',
      bannerMediaId: culturalDanceMedia.id,
    },
  });

  // Connect events to their respective albums
  await prisma.album.update({
    where: { id: inaugurationAlbum.id },
    data: { eventId: handoverEvent.id },
  });

  await prisma.album.update({
    where: { id: asaDayAlbum.id },
    data: { eventId: asaDayEvent.id },
  });

  // 9. DEPARTMENTS & NEWS & PROJECTS
  console.log('  -> Seeding Newsroom & Projects...');
  const newsCategory = await prisma.newsCategory.create({
    data: {
      name: 'Governance & Gazettes',
      slug: 'governance-gazettes',
      description: 'Official announcements from the Executive Council & House of Representatives',
    },
  });

  await prisma.newsArticle.create({
    data: {
      title: 'Official Swearing-In of the 2026/2027 Comdr Sobur-Led Administration',
      slug: 'inauguration-2026-2027-sobur-administration',
      summary: 'Official inauguration ceremony of Cmrd. Ibrahim Sobur Bamidele as President, alongside Executive Officers, Traditional Title Holders, and House Principal Officers.',
      content: 'The official inauguration and swearing-in ceremony of the 2026/2027 Yoruba Students\' Union (YOSU) administration led by Cmrd. Ibrahim Sobur Bamidele was successfully conducted at the Federal University Dutse campus.',
      isFeatured: true,
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date('2026-07-15'),
      authorId: adminUser.id,
      categoryId: newsCategory.id,
      featuredMediaId: heroBgMedia.id,
    },
  });

  await prisma.project.create({
    data: {
      title: 'Student Welfare & E-Portal Integration Project',
      slug: 'student-welfare-e-portal',
      summary: 'Digital constitutional directory, student welfare portal, and academic resource bank.',
      description: 'Comprehensive digital infrastructure project enhancing student welfare and transparent administration.',
      status: ProjectStatus.IN_PROGRESS,
      progressPercentage: 85,
      sessionId: currentSession.id,
    },
  });

  // 10. STUDENT REGISTRATIONS & MEMBER DOWNLOAD RESOURCES
  console.log('  -> Seeding Student Registrations & Download Resources...');
  await prisma.studentRegistration.deleteMany();

  await prisma.studentRegistration.create({
    data: {
      regNumber: 'YOSU-2026-00001',
      fullName: 'Ibrahim Sobur Bamidele',
      gender: 'MALE',
      passportUrl: '/images/gallery/inauguration-handover.jpg',
      matricNumber: 'FUD/2023/CS/0001',
      faculty: 'Faculty of Computing',
      department: 'Computer Science',
      programme: 'B.Sc. Computer Science',
      level: '300L',
      phone: '08012345678',
      whatsapp: '08012345678',
      email: 'sobur@student.fud.edu.ng',
      stateOfOrigin: 'Ogun',
      lga: 'Abeokuta South',
      homeTown: 'Abeokuta',
      emergencyContactName: 'Bamidele Senior',
      emergencyContactRelationship: 'Father',
      emergencyContactPhone: '08099887766',
      status: 'VERIFIED',
    },
  });

  await prisma.studentRegistration.create({
    data: {
      regNumber: 'YOSU-2026-00002',
      fullName: 'Oladipupo Mercy Adewale',
      gender: 'FEMALE',
      passportUrl: null,
      matricNumber: 'FUD/2024/BCH/0045',
      faculty: 'Faculty of Basic Medical Sciences',
      department: 'Biochemistry',
      programme: 'B.Sc. Biochemistry',
      level: '200L',
      phone: '08023456789',
      whatsapp: '08023456789',
      email: 'mercy@student.fud.edu.ng',
      stateOfOrigin: 'Oyo',
      lga: 'Ibadan North',
      homeTown: 'Ibadan',
      emergencyContactName: 'Adewale Senior',
      emergencyContactRelationship: 'Mother',
      emergencyContactPhone: '08033221100',
      status: 'VERIFIED',
    },
  });

  // Seed Download Resources for Members
  const pdfMedia1 = await prisma.media.create({
    data: {
      filename: 'YOSU_Official_Constitution_1st_Edition.pdf',
      url: '/documents/yosu-constitution-2026.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 2450000,
      altText: 'YOSU Official Constitution Harmonized Edition',
    },
  });

  const pdfMedia2 = await prisma.media.create({
    data: {
      filename: 'YOSU_Member_Handbook_2026.pdf',
      url: '/documents/yosu-member-handbook.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 1850000,
      altText: 'YOSU Membership Guide and Code of Conduct',
    },
  });

  await prisma.downloadResource.create({
    data: {
      title: 'YOSU Supreme Constitution (1st Harmonized Edition)',
      description: 'Official governing document of Yoruba Students\' Union, Federal University Dutse Chapter.',
      category: 'Constitution',
      fileMediaId: pdfMedia1.id,
      downloadsCount: 142,
      isPublic: true,
    },
  });

  await prisma.downloadResource.create({
    data: {
      title: 'YOSU Official Membership Handbook & Code of Conduct',
      description: 'Comprehensive guide covering member rights, executive directory, congress rules, and welfare benefits.',
      category: 'Gazette',
      fileMediaId: pdfMedia2.id,
      downloadsCount: 98,
      isPublic: true,
    },
  });

  // Seed Constitution Version & Articles if missing
  console.log('  -> Seeding Constitution Supreme Gazette (2026 Edition)...');
  const constVerCount = await prisma.constitutionVersion.count();
  if (constVerCount === 0) {
    await prisma.constitutionVersion.create({
      data: {
        versionName: '2026 Unification Constitution',
        edition: '1st Harmonized Edition',
        sessionId: currentSession.id,
        effectiveDate: new Date('2026-01-01'),
        isCurrent: true,
        assentedBy: 'Cmrd. Ibrahim Sobur Bamidele (Executive President)',
        speakerCertBy: 'Rt. Hon. Alabi Oyeniyi (Speaker of the House)',
        pdfMediaId: pdfMedia1.id,
        articles: {
          create: [
            {
              articleNumber: 1,
              title: 'Name, Emblem, Supremacy & Motto',
              slug: 'article-1-name-supremacy',
              overview: 'Establishment of the Yoruba Students Union (YOSU), FUD Chapter as the supreme umbrella body.',
              sections: {
                create: [
                  { sectionNumber: '1(1)', title: 'Official Title', content: 'The union shall be known and styled as the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter.' },
                  { sectionNumber: '1(2)', title: 'Motto & Heritage', content: 'The motto of the Union shall be: "Ìpínlẹ̀ Ọmọ Odùdúwà: Ìfẹ́ Sówapọ̀".' },
                  { sectionNumber: '1(3)', title: 'Constitutional Supremacy', content: 'This Constitution is supreme and binding on all bona fide Yoruba student members, Executive Officers, and Legislative Delegates.' },
                ],
              },
            },
            {
              articleNumber: 2,
              title: 'Membership & Rights',
              slug: 'article-2-membership-rights',
              overview: 'Qualifications, rights, privileges, and duties of student members.',
              sections: {
                create: [
                  { sectionNumber: '2(1)', title: 'Bona Fide Qualification', content: 'Membership is open to all registered students of Yoruba heritage or origin at Federal University Dutse.' },
                  { sectionNumber: '2(2)', title: 'Rights & Privileges', content: 'Every verified member has the right to vote in congress elections, access welfare benefits, and participate in union programs.' },
                ],
              },
            },
            {
              articleNumber: 3,
              title: 'Executive Council Architecture',
              slug: 'article-3-executive-council',
              overview: 'Composition, powers, and duties of the 17 Executive Offices.',
              sections: {
                create: [
                  { sectionNumber: '3(1)', title: 'Executive Power', content: 'Executive authority is vested in the Executive Council led by the Executive President.' },
                  { sectionNumber: '3(2)', title: 'Duties of President', content: 'The President shall be the Chief Executive Officer and Head of Delegation.' },
                ],
              },
            },
            {
              articleNumber: 4,
              title: 'House of Representatives Assembly',
              slug: 'article-4-house-of-representatives',
              overview: 'Legislative representation across all 8 Constituent Yoruba States.',
              sections: {
                create: [
                  { sectionNumber: '4(1)', title: 'State Representation', content: 'Each of the 8 Constituent Yoruba States shall be represented by elected legislative delegates.' },
                ],
              },
            },
          ],
        },
      },
    });
  }

  // Seed House Representatives Delegates for 8 Constituent States if missing
  console.log('  -> Seeding House of Representatives Delegates (8 Constituent States)...');
  const existingRepsCount = await prisma.houseRepresentative.count();
  if (existingRepsCount === 0) {
    await prisma.houseRepresentative.createMany({
      data: [
        { fullName: 'Hon. Adebayo Sunkanmi', stateOfOrigin: 'Ekiti', positionTitle: 'Chief Whip & Representative', sessionId: currentSession.id, displayOrder: 1 },
        { fullName: 'Hon. Folashade Adeleke', stateOfOrigin: 'Lagos', positionTitle: 'Representative Delegate', sessionId: currentSession.id, displayOrder: 2 },
        { fullName: 'Hon. Babatunde Ogunyemi', stateOfOrigin: 'Ogun', positionTitle: 'Representative Delegate', sessionId: currentSession.id, displayOrder: 3 },
        { fullName: 'Hon. Temitope Akindele', stateOfOrigin: 'Ondo', positionTitle: 'Representative Delegate', sessionId: currentSession.id, displayOrder: 4 },
        { fullName: 'Hon. Olamide Aderibigbe', stateOfOrigin: 'Osun', positionTitle: 'House Majority Leader', sessionId: currentSession.id, displayOrder: 5 },
        { fullName: 'Hon. Kehinde Popoola', stateOfOrigin: 'Oyo', positionTitle: 'Representative Delegate', sessionId: currentSession.id, displayOrder: 6 },
        { fullName: 'Hon. Zainab Abiola', stateOfOrigin: 'Kwara', positionTitle: 'Representative Delegate', sessionId: currentSession.id, displayOrder: 7 },
        { fullName: 'Hon. Emmanuel Olorunfemi', stateOfOrigin: 'Kogi', positionTitle: 'Okun Cultural Representative', sessionId: currentSession.id, displayOrder: 8 },
      ],
    });
  }

  console.log('✅ YOSU Official Multi-Session Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
