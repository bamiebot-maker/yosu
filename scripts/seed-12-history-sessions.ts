import 'dotenv/config';
import { PrismaClient, AppointmentStatus, OfficeCategory } from '@prisma/client';

const prisma = new PrismaClient();

const SESSIONS_12 = [
  {
    order: 1,
    title: '2014/2015 Session',
    slug: '2014-2015',
    theme: '1st Administration: Pioneer Foundation Era',
    motto: 'The Genesis of Omoluabi Solidarity at FUD',
    startDate: new Date('2014-09-01'),
    endDate: new Date('2015-08-31'),
    isCurrent: false,
    presidentName: 'Cmrd. Adebayo Lagbaja',
    presidentBio: 'Pioneer Executive President of YOSU FUD. Mobilized founding South-Western undergraduates under neem trees to build the union.',
    historicalNarrative: `In 2013-2014, when Federal University Dutse opened its doors, pioneer Yoruba undergraduates established the first student collective. Facing harmonic cultural transitions in Jigawa State, pioneer leaders banded together to provide welfare, tutorial circles, and hostel settlement guidance.`,
    achievements: [
      { title: 'Founding Charter of YOSU FUD', description: 'Established the official student association representing all 8 Yoruba constituent states.', category: 'GOVERNANCE' },
      { title: 'Pioneer Freshers Transit & Reception Pool', description: 'Organized interstate transit guides and hostel allocations for pioneer students arriving from the South-West.', category: 'WELFARE' },
      { title: 'Pioneer Cultural Night', description: 'Staged the first Yoruba cultural evening and traditional music presentation on campus.', category: 'CULTURE' }
    ]
  },
  {
    order: 2,
    title: '2015/2016 Session',
    slug: '2015-2016',
    theme: '2nd Administration: Institutional Consolidation Era',
    motto: 'Codifying Student Governance & Welfare',
    startDate: new Date('2015-09-01'),
    endDate: new Date('2016-08-31'),
    isCurrent: false,
    presidentName: 'Cmrd. Babatunde Tamedo',
    presidentBio: 'Second Executive President. Spearheaded constitutional codification and official University Management recognition.',
    historicalNarrative: `The second administration focused on codifying administrative standards, securing union recognition from the Dean of Student Affairs, and standardizing presidential cabinet appointments.`,
    achievements: [
      { title: 'University Management Recognition', description: 'Formally secured institutional recognition from the Directorate of Student Affairs.', category: 'GOVERNANCE' },
      { title: 'First Constitutional Drafting Convention', description: 'Convened student delegates from all 8 constituent states to establish foundational rules.', category: 'CONSTITUTION' },
      { title: 'Emergency Welfare Support Fund', description: 'Initiated a student assistance pool to help members facing academic or medical emergencies.', category: 'WELFARE' }
    ]
  },
  {
    order: 3,
    title: '2016/2017 Session',
    slug: '2016-2017',
    theme: '3rd Administration: Unification & Regional Charter Era',
    motto: 'Consolidating Brotherhood Across All 8 States',
    startDate: new Date('2016-09-01'),
    endDate: new Date('2017-08-31'),
    isCurrent: false,
    presidentName: 'Cmrd. Olawale Adeleke',
    presidentBio: 'Third Executive President. Established equal legislative delegation for each of the 8 constituent states.',
    historicalNarrative: `During the third administration, YOSU strengthened ties between state student caucuses. Equal voting delegation was enshrined in the legislative council, guaranteeing fair representation for every student regardless of home state.`,
    achievements: [
      { title: 'Equal State Representation Resolution', description: 'Enshrined equal voting delegation in the union legislative body for all 8 states.', category: 'GOVERNANCE' },
      { title: 'YOSU Inter-Faculty Tutorial Reserve', description: 'Created student-led exam tutorial groups across Science, Agriculture, and Arts faculties.', category: 'ACADEMIC' },
      { title: 'Host Community Relations Outreach', description: 'Fostered friendly cultural exchanges with local Dutse community elders and traders.', category: 'CULTURE' }
    ]
  },
  {
    order: 4,
    title: '2017/2018 Session',
    slug: '2017-2018',
    theme: '4th Administration: Cultural Heritage & Arts Era',
    motto: 'Àṣà Ìbílẹ̀: Dignity and Cultural Preservation',
    startDate: new Date('2017-09-01'),
    endDate: new Date('2018-08-31'),
    isCurrent: false,
    presidentName: 'Cmrd. Kayode Olatunji',
    presidentBio: 'Fourth Executive President. Renowned for reviving traditional cultural arts, choral performances, and Yoruba heritage festivals.',
    historicalNarrative: `The fourth administration brought a major cultural renaissance. Traditional royal titles (Oba, Olori, Balogun) were established to celebrate Yoruba history, and the union organized its first major inter-ethnic cultural exhibition.`,
    achievements: [
      { title: 'First Annual Àṣà Heritage Exhibition', description: 'Showcased traditional Yoruba attire, culinary heritage, and poetry recitation at the university convocation square.', category: 'CULTURE' },
      { title: 'Freshers Off-Campus Safety Network', description: 'Established designated student liaison reps across popular student housing zones in Dutse.', category: 'WELFARE' }
    ]
  },
  {
    order: 5,
    title: '2018/2019 Session',
    slug: '2018-2019',
    theme: '5th Administration: Academic Renaissance Era',
    motto: 'Intellectual Mastery as the True Spirit of Omoluabi',
    startDate: new Date('2018-09-01'),
    endDate: new Date('2019-08-31'),
    isCurrent: false,
    presidentName: 'Cmrd. Damilola Ojo',
    presidentBio: 'Fifth Executive President. Championed student CGPA improvement, free textbook exchanges, and academic mentorship.',
    historicalNarrative: `Under the fifth administration, student scholarship was placed at the absolute forefront. The union organized faculty tutoring pools, book donations, and study circles that drastically reduced academic probation rates.`,
    achievements: [
      { title: 'Union Lending Library & Book Bank', description: 'Curated over 300 donated textbooks and past question packs available for loan to members.', category: 'ACADEMIC' },
      { title: 'Academic CGPA Excellence Awards', description: 'Honored first-class and second-class upper Yoruba scholars across all university faculties.', category: 'ACADEMIC' }
    ]
  },
  {
    order: 6,
    title: '2019/2020 Session',
    slug: '2019-2020',
    theme: '6th Administration: Bicameral Reform Era',
    motto: 'Strengthening Legislative Oversight & Accountability',
    startDate: new Date('2019-09-01'),
    endDate: new Date('2020-08-31'),
    isCurrent: false,
    presidentName: 'Cmrd. Samuel Adeleke',
    presidentBio: 'Sixth Executive President. Reformed union budgetary hearings and established the House of Representatives standing rules.',
    historicalNarrative: `The sixth administration reformed union governance by strengthening the House of Representatives. Financial audit protocols were introduced to guarantee transparency in the handling of union dues.`,
    achievements: [
      { title: 'Standardized Standing Legislative Rules', description: 'Enacted parliamentary proceedings for the YOSU House of Representatives.', category: 'GOVERNANCE' },
      { title: 'Transparent Financial Audit Mandate', description: 'Introduced termly fiscal reports published to student noticeboards across campus.', category: 'FINANCE' }
    ]
  },
  {
    order: 7,
    title: '2020/2021 Session',
    slug: '2020-2021',
    theme: '7th Administration: Resilience & Solidarity Era',
    motto: 'Standing Firm Through Disruption and Hardship',
    startDate: new Date('2020-09-01'),
    endDate: new Date('2021-08-31'),
    isCurrent: false,
    presidentName: 'Cmrd. Taofeek Adewale',
    presidentBio: 'Seventh Executive President. Guided the union through academic calendar halts and post-lockdown resumption challenges.',
    historicalNarrative: `Navigating unprecedented academic halts and sudden calendar changes, the seventh administration provided vital food relief, hostel renegotiations, and transit coordination for stranded students.`,
    achievements: [
      { title: 'COVID-19 Student Relief Intervention', description: 'Distributed basic food items and sanitary supplies to stranded off-campus students.', category: 'WELFARE' },
      { title: 'Hostel Rent Mediation Initiative', description: 'Successfully mediated with local Dutse landlords to freeze penalties for missed tenancy months.', category: 'WELFARE' }
    ]
  },
  {
    order: 8,
    title: '2021/2022 Session',
    slug: '2021-2022',
    theme: '8th Administration: Digital Genesis Era',
    motto: 'Modernizing Records and Secretariat Communications',
    startDate: new Date('2021-09-01'),
    endDate: new Date('2022-08-31'),
    isCurrent: false,
    presidentName: 'Cmrd. Ayomide Bakare',
    presidentBio: 'Eighth Executive President. Initiated electronic student records, WhatsApp broadcast networks, and digital archive preservation.',
    historicalNarrative: `The eighth administration modernized communications by transitioning physical registries into electronic spreadsheets and launching the official YOSU social channels.`,
    achievements: [
      { title: 'First Electronic Membership Directory', description: 'Digitized student registries to streamline union verification and election accreditation.', category: 'GOVERNANCE' },
      { title: 'Official YOSU Broadcast Channel', description: 'Established central news broadcasts ensuring timely dissemination of university memos.', category: 'COMMUNICATIONS' }
    ]
  },
  {
    order: 9,
    title: '2022/2023 Session',
    slug: '2022-2023',
    theme: '9th Administration: Student Welfare Vanguard Era',
    motto: 'Dignity, Campus Safety and Rapid Welfare Response',
    startDate: new Date('2022-09-01'),
    endDate: new Date('2023-08-31'),
    isCurrent: false,
    presidentName: 'Cmrd. Lateef Sanusi',
    presidentBio: 'Ninth Executive President. Expanded emergency transit subsidies and medical assistance for hospitalised members.',
    historicalNarrative: `Faced with soaring interstate transportation fares, the ninth administration partnered with inter-city bus unions to negotiate discounted student transit tickets for semester vacations.`,
    achievements: [
      { title: 'Interstate Vacation Travel Rebate Scheme', description: 'Negotiated subsidized bus transit routes connecting Dutse to Ibadan, Lagos, and Akure.', category: 'WELFARE' },
      { title: 'Hospital Emergency Health Coverage', description: 'Covered emergency clinic fees and medical prescriptions for underprivileged students.', category: 'WELFARE' }
    ]
  },
  {
    order: 10,
    title: '2023/2024 Session',
    slug: '2023-2024',
    theme: '10th Administration: Decennial Jubilee Era',
    motto: 'Celebrating 10 Years of Omoluabi Excellence at FUD',
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-08-31'),
    isCurrent: false,
    presidentName: 'Cmrd. Folarin Ajayi',
    presidentBio: 'Tenth Executive President. Presided over the historic 10-year jubilee celebration, uniting pioneer alumni and undergraduates.',
    historicalNarrative: `Marking a decade of union existence, the tenth administration convened pioneer alumni, staged the grand Decennial Jubilee Dinner, and published a retrospective historical gazette.`,
    achievements: [
      { title: '10th Anniversary Decennial Symposium', description: 'Hosted university dignitaries, royal fathers, and pioneer alumni to celebrate 10 years of YOSU.', category: 'CULTURE' },
      { title: 'Decennial Archival Gazette Publication', description: 'Produced the first printed commemorative gazette detailing ten years of leadership records.', category: 'PUBLICATIONS' }
    ]
  },
  {
    order: 11,
    title: '2024/2025 Session',
    slug: '2024-2025',
    theme: '11th Administration: Progressive Governance Era',
    motto: 'Laying the Foundation for Complete Digitalization',
    startDate: new Date('2024-09-01'),
    endDate: new Date('2025-08-31'),
    isCurrent: false,
    presidentName: 'Executive Administration',
    presidentBio: 'Eleventh Executive Council. Advanced constitutional modernization, expanded departmental tutorial circles, and fortified state delegate assemblies.',
    historicalNarrative: `The eleventh administration established the groundwork for digital dues collection, audited union constitutions, and expanded the executive council portfolio.`,
    achievements: [
      { title: 'Comprehensive Constitutional Audit', description: 'Convened the Constitutional Review Commission (CRC) to draft modernized governance provisions.', category: 'CONSTITUTION' },
      { title: 'Expansion of Tutorial Hubs to New Faculties', description: 'Extended free tutorial schemes to the newly established Faculty of Allied Health Sciences.', category: 'ACADEMIC' }
    ]
  },
  {
    order: 12,
    title: '2026/2027 Session',
    slug: '2026-2027',
    theme: '12th Administration: The Sovereign Progress Era',
    motto: 'Technological Excellence, Omoluabi Integrity & Unbroken Solidarity',
    startDate: new Date('2026-07-10'),
    endDate: null,
    isCurrent: true,
    presidentName: 'Cmrd. Ibrahim Sobur Bamidele',
    presidentBio: '12th Executive President. Leading the historic Progress Era Administration dedicated to digital membership, Omoluabi dignity, and transparent governance.',
    historicalNarrative: `The active 12th executive administration led by Comdr. Ibrahim Sobur Bamidele. Spearheaded the enterprise digital web portal, online member registration, secure dues management, and the digital history gazette.`,
    achievements: [
      { title: 'Enterprise Digital Union Platform & Web Portal', description: 'Launched official web portal featuring digital student IDs, constitution tracking, and archive libraries.', category: 'TECHNOLOGY' },
      { title: 'Àṣà Day Cultural Heritage Festival 2026', description: 'Organized flagship cultural festival uniting over 1,200 Yoruba students across Federal University Dutse.', category: 'CULTURE' },
      { title: 'Tamper-Proof Digital Membership System', description: 'Instituted verifiable digital membership credentials with QR codes and secure member profiles.', category: 'GOVERNANCE' }
    ]
  }
];

async function main() {
  console.log('🚀 Starting safe non-destructive seeding of 12 historical sessions...');

  // Ensure Offices exist (President, Vice President, Secretary General, Treasurer, PRO)
  const defaultOffices = [
    { title: 'Executive President', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 1 },
    { title: 'Vice President', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 2 },
    { title: 'Secretary General', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 3 },
    { title: 'Financial Secretary / Treasurer', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 4 },
    { title: 'Public Relations Officer (PRO)', category: OfficeCategory.EXECUTIVE_COUNCIL, defaultOrder: 5 },
  ];

  const officeMap = new Map<string, string>();
  for (const o of defaultOffices) {
    let office = await prisma.office.findFirst({ where: { title: o.title } });
    if (!office) {
      office = await prisma.office.create({ data: o });
    }
    officeMap.set(o.title, office.id);
  }

  for (const s of SESSIONS_12) {
    // Check if session exists by slug or title
    const existing = await prisma.administrationSession.findFirst({
      where: {
        OR: [{ slug: s.slug }, { title: s.title }],
      },
    });

    let sessionId = existing?.id;

    if (!existing) {
      console.log(`  ➕ Creating Session ${s.order} of 12: ${s.title}...`);
      const created = await prisma.administrationSession.create({
        data: {
          title: s.title,
          slug: s.slug,
          theme: s.theme,
          motto: s.motto,
          startDate: s.startDate,
          endDate: s.endDate,
          isCurrent: s.isCurrent,
          presidentName: s.presidentName,
          presidentBio: s.presidentBio,
          historicalNarrative: s.historicalNarrative,
          displayOrder: s.order,
          isPublished: true,
        },
      });
      sessionId = created.id;
    } else {
      console.log(`  ℹ️ Session ${s.order} of 12: ${s.title} already exists. Updating order & details safely...`);
      await prisma.administrationSession.update({
        where: { id: existing.id },
        data: {
          displayOrder: s.order,
          theme: existing.theme || s.theme,
          motto: existing.motto || s.motto,
          presidentName: existing.presidentName || s.presidentName,
          presidentBio: existing.presidentBio || s.presidentBio,
          historicalNarrative: existing.historicalNarrative || s.historicalNarrative,
          isCurrent: s.isCurrent,
          isPublished: true,
        },
      });
    }

    // Check if president Person and Appointment exist for this session
    if (sessionId) {
      const presOfficeId = officeMap.get('Executive President');
      const existingPresApp = await prisma.officeAppointment.findFirst({
        where: {
          sessionId,
          office: { title: { contains: 'President', mode: 'insensitive' } },
        },
      });

      if (!existingPresApp && presOfficeId && s.presidentName) {
        // Create or find person
        let person = await prisma.person.findFirst({ where: { fullName: s.presidentName } });
        if (!person) {
          person = await prisma.person.create({
            data: {
              fullName: s.presidentName,
              stateOfOrigin: 'Oyo',
              department: 'Political Science',
              bio: s.presidentBio,
            },
          });
        }

        await prisma.officeAppointment.create({
          data: {
            sessionId,
            officeId: presOfficeId,
            personId: person.id,
            status: s.isCurrent ? AppointmentStatus.ACTIVE : AppointmentStatus.COMPLETED,
            displayOrder: 1,
          },
        });
      }

      // Add achievements if none exist
      const achCount = await prisma.sessionAchievement.count({ where: { sessionId } });
      if (achCount === 0 && s.achievements) {
        for (let i = 0; i < s.achievements.length; i++) {
          const a = s.achievements[i];
          await prisma.sessionAchievement.create({
            data: {
              sessionId,
              title: a.title,
              description: a.description,
              category: a.category,
              displayOrder: i + 1,
            },
          });
        }
      }
    }
  }

  console.log('✅ Successfully synced all 12 historical sessions!');
  const finalCount = await prisma.administrationSession.count();
  console.log(`Total sessions now in database: ${finalCount}`);
}

main()
  .catch((e) => {
    console.error('Error seeding sessions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
