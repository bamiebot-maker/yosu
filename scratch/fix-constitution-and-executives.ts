import { PrismaClient, OfficeCategory } from '@prisma/client';

const prisma = new PrismaClient();

const EXECUTIVE_DIRECTORY = [
  { fullName: 'Cmrd. Ibrahim Sobur Bamidele', state: 'Ekiti', department: 'Software Engineering', position: 'President', phone: '09129324801, 09136447931, 07072741726', order: 1 },
  { fullName: 'Latifat Usman Gidado', state: 'Kwara', department: 'Business Administration', position: 'Vice President', phone: '07082022496, 08134385652', order: 2 },
  { fullName: 'Capat Olumide Oyerinde', state: 'Osun', department: 'Nursing Science', position: 'Secretary-General', phone: '08139531637', order: 3 },
  { fullName: 'Awe Abosede Blessing', state: 'Kogi', department: 'Business Administration', position: 'Assistant Secretary-General', phone: '08082666837, 07070739872', order: 4 },
  { fullName: 'Abdulsamad Muhammad-Tirimiz', state: 'Oyo', department: 'Business Administration', position: 'Treasurer', phone: '08124093204, 09132264464', order: 5 },
  { fullName: 'Oluwande Zynab Arike', state: 'Osun', department: 'Chemistry', position: 'Financial Secretary', phone: '09012705947', order: 6 },
  { fullName: 'Ibrahim Hameedat Abiodun', state: 'Kwara', department: 'English Language', position: 'Auditor-General', phone: '07045325352', order: 7 },
  { fullName: 'Oloyede Habeebullah Ademola', state: 'Ogun', department: 'English and Linguistics', position: 'Academic Director', phone: '09161155259, 08169417416', order: 8 },
  { fullName: 'Mercy Nenadi Jeremiah', state: 'Ekiti', department: 'English Language', position: 'Olori I', phone: '08059989953, 07079991368', order: 9, category: OfficeCategory.TRADITIONAL_TITLE },
  { fullName: 'Abdulrashid Ishaku Karimat', state: 'Oyo', department: 'Human Physiology', position: 'Olori II', phone: '09025091406', order: 10, category: OfficeCategory.TRADITIONAL_TITLE },
  { fullName: 'Fouad Adegoke Adedotun', state: 'Oyo', department: 'Agric Economics', position: 'Oba', phone: '09023196391', order: 11, category: OfficeCategory.TRADITIONAL_TITLE },
  { fullName: 'AbdulAzeez Mubarak Abiola', state: 'Oyo', department: 'Forestry and Wildlife Management', position: 'Sport Director I', phone: '09155667641, 09046005496', order: 12 },
  { fullName: 'Oluwande Abdulahi Asafa', state: 'Osun', department: 'Linguistics/English', position: 'Sport Director II', phone: '07014744727', order: 13 },
  { fullName: 'Moridiyat Olamide Abdulganiyu', state: 'Kwara', department: 'Biochemistry', position: 'Director of Cultural Affairs I', phone: '08064526566, 09116487485', order: 14 },
  { fullName: 'Hamzat Aishat', state: 'Osun', department: 'Forestry and Wildlife Management', position: 'Director of Cultural Affairs II', phone: '08140453715, 09036355993', order: 15 },
  { fullName: 'Khadijah Bolaji Tajudeen', state: 'Ekiti', department: 'Nursing Science', position: 'Social Director I', phone: '08068746628', order: 16 },
  { fullName: 'Oyewo Mupheedarh Adeola', state: 'Kwara', department: 'Biological Sciences', position: 'Social Director II', phone: '09160588740, 09015256701', order: 17 },
  { fullName: 'Tijani Umar Adeola', state: 'Oyo', department: 'Microbiology', position: 'PRO I', phone: '08158667205, 08058877726', order: 18 },
  { fullName: 'Balogun Azeezat', state: 'Kogi', department: 'Chemistry', position: 'Welfare Director I', phone: '09055676641', order: 19 },
  { fullName: 'Olatunbosun Sekinat', state: 'Ogun', department: 'MBBS', position: 'Welfare Director II', phone: '08101528975', order: 20 },
  { fullName: 'Alabi Abdulbaaki Inaolaji', state: 'Osun', department: 'English and Linguistics', position: 'Disciplinary Officer', phone: '08072036509', order: 21 },
];

async function main() {
  console.log('🚀 Running Direct Constitution & Executive Directory Synchronizer...');

  // 1. Get or create active session
  let session = await prisma.administrationSession.findFirst({ where: { isCurrent: true } });
  if (!session) {
    session = await prisma.administrationSession.findFirst();
  }
  if (!session) {
    session = await prisma.administrationSession.create({
      data: {
        title: '2026/2027 Progress Era Administration',
        slug: '2026-2027-progress-era',
        startDate: new Date('2026-07-15'),
        endDate: new Date('2027-07-15'),
        isCurrent: true,
        theme: 'Progress, Unity & Student Welfare',
      },
    });
  }

  // 2. Force seed Constitution
  console.log('📜 Ensuring Supreme Constitution Version is active in database...');
  await prisma.constitutionVersion.updateMany({ data: { isCurrent: false } });

  const pdfMedia = await prisma.media.findFirst({ where: { mimeType: 'application/pdf' } });

  const constitution = await prisma.constitutionVersion.create({
    data: {
      versionName: '2026 Supreme Unification Constitution',
      edition: '1st Harmonized Edition',
      sessionId: session.id,
      effectiveDate: new Date('2026-01-01'),
      isCurrent: true,
      assentedBy: 'Cmrd. Ibrahim Sobur Bamidele (Executive President)',
      speakerCertBy: 'Rt. Hon. Alabi Oyeniyi (Speaker of the House)',
      pdfMediaId: pdfMedia?.id || null,
      articles: {
        create: [
          {
            articleNumber: 1,
            title: 'Name, Supremacy & Motto of the Union',
            slug: 'article-1-name-supremacy',
            overview: 'Establishment of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter.',
            sections: {
              create: [
                { sectionNumber: '1(1)', title: 'Official Name & Style', content: 'The Union shall be known, named, and styled as the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter.' },
                { sectionNumber: '1(2)', title: 'Motto & Heritage', content: 'The motto of the Union shall be: "Ìpínlẹ̀ Ọmọ Odùdúwà: Ìfẹ́ Sówapọ̀" (Unity, Welfare & Cultural Progress).' },
                { sectionNumber: '1(3)', title: 'Constitutional Supremacy', content: 'This Constitution is supreme and binding on all bona fide Yoruba student members, Executive Officers, and Representatives.' },
              ],
            },
          },
          {
            articleNumber: 2,
            title: 'Membership Rights, Qualifications & Duties',
            slug: 'article-2-membership-rights',
            overview: 'Qualifications, rights, privileges, and duties of all student members.',
            sections: {
              create: [
                { sectionNumber: '2(1)', title: 'Qualification for Membership', content: 'Membership is open to all registered students of Yoruba origin or heritage at Federal University Dutse.' },
                { sectionNumber: '2(2)', title: 'Rights & Benefits', content: 'Every verified member has the right to vote, participate in congresses, access welfare assistance, and hold official ID passes.' },
              ],
            },
          },
          {
            articleNumber: 3,
            title: 'The Executive Council',
            slug: 'article-3-executive-council',
            overview: 'Composition, executive authority, and operational duties of the Executive Cabinet.',
            sections: {
              create: [
                { sectionNumber: '3(1)', title: 'Executive Cabinet Powers', content: 'Executive authority is vested in the Executive Council headed by the Executive President.' },
                { sectionNumber: '3(2)', title: 'Duties of Executive Officers', content: 'The President, Vice President, Secretary General, and Cabinet Directors shall carry out administrative affairs in alignment with Congress resolutions.' },
              ],
            },
          },
          {
            articleNumber: 4,
            title: 'House of Representatives Assembly',
            slug: 'article-4-house-of-representatives',
            overview: 'Legislative representation across the 8 Constituent Yoruba States.',
            sections: {
              create: [
                { sectionNumber: '4(1)', title: 'State Delegations', content: 'Each of the 8 Constituent Yoruba States (Ekiti, Lagos, Ogun, Ondo, Osun, Oyo, Kwara, Kogi) shall be represented in the Legislative Assembly.' },
              ],
            },
          },
          {
            articleNumber: 5,
            title: 'Traditional Royal Court',
            slug: 'article-5-traditional-royal-court',
            overview: 'Custodianship of Yoruba culture, traditional titles of OBA and Oloris.',
            sections: {
              create: [
                { sectionNumber: '5(1)', title: 'Royal Court Dignity', content: 'The Oba of YOSU and Oloris shall serve as traditional custodians of cultural heritage, royal court sittings, and Àṣà Day festivals.' },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Seeded Constitution Version: ${constitution.versionName} (${constitution.id})`);

  // 3. Update Executive Directory with Exact State, Department & Phone Numbers
  console.log('👑 Synchronizing Executive Officers & Royal Court with exact records...');

  for (const exec of EXECUTIVE_DIRECTORY) {
    // Check if person exists by full name
    let person = await prisma.person.findFirst({
      where: { fullName: { contains: exec.fullName.split(' ')[1] || exec.fullName } },
    });

    if (!person) {
      person = await prisma.person.create({
        data: {
          fullName: exec.fullName,
          stateOfOrigin: exec.state,
          department: exec.department,
          phoneNumber: exec.phone,
          bio: `${exec.position} of the Yoruba Students' Union (YOSU), FUD Chapter.`,
        },
      });
    } else {
      await prisma.person.update({
        where: { id: person.id },
        data: {
          fullName: exec.fullName,
          stateOfOrigin: exec.state,
          department: exec.department,
          phoneNumber: exec.phone,
        },
      });
    }

    // Ensure Office exists
    let office = await prisma.office.findFirst({
      where: { title: exec.position },
    });

    if (!office) {
      office = await prisma.office.create({
        data: {
          title: exec.position,
          category: exec.category || OfficeCategory.EXECUTIVE_COUNCIL,
          defaultOrder: exec.order,
        },
      });
    }

    // Ensure Appointment exists
    const existingAppt = await prisma.officeAppointment.findFirst({
      where: { personId: person.id, officeId: office.id, sessionId: session.id },
    });

    if (!existingAppt) {
      await prisma.officeAppointment.create({
        data: {
          personId: person.id,
          officeId: office.id,
          sessionId: session.id,
          stateRepresented: exec.state,
          displayOrder: exec.order,
        },
      });
    } else {
      await prisma.officeAppointment.update({
        where: { id: existingAppt.id },
        data: {
          stateRepresented: exec.state,
          displayOrder: exec.order,
        },
      });
    }
  }

  console.log('✅ Synchronized all 21 Executive Officers and Traditional Title Holders with live database!');
}

main()
  .catch((e) => {
    console.error('❌ Error during script execution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
