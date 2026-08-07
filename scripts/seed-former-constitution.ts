import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedFormerConstitution() {
  console.log('📜 Seeding Version 1 — Former NAKOLES-FUD Constitution (October 2025)...');

  // 1. Get or create the 2025/2026 Administration Session
  let pastSession = await prisma.administrationSession.findFirst({
    where: { slug: '2025-2026' },
  });

  if (!pastSession) {
    pastSession = await prisma.administrationSession.create({
      data: {
        title: '2025/2026 Session',
        slug: '2025-2026',
        theme: 'The Pioneer Unification Administration',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2026-07-09'),
        isCurrent: false,
      },
    });
  }

  // 2. Check if Version 1 already exists or create/update it
  let v1 = await prisma.constitutionVersion.findFirst({
    where: { versionName: { contains: 'v1.0' } },
  });

  if (v1) {
    console.log('  -> Cleaning previous Version 1 articles/sections...');
    await prisma.constitutionSection.deleteMany({
      where: { article: { versionId: v1.id } },
    });
    await prisma.constitutionArticle.deleteMany({
      where: { versionId: v1.id },
    });
    await prisma.constitutionAmendment.deleteMany({
      where: { versionId: v1.id },
    });

    v1 = await prisma.constitutionVersion.update({
      where: { id: v1.id },
      data: {
        versionName: 'v1.0 (Former NAKOLES-FUD Constitution)',
        edition: 'As Amended by the 2025/2026 Legislative Session',
        sessionId: pastSession.id,
        effectiveDate: new Date('2025-10-01'),
        adoptionDate: new Date('2025-10-15'),
        ratificationDate: new Date('2025-10-20'),
        isCurrent: false, // Ensure version 2 remains current!
        assentedBy: 'President, NAKOLES FUD Chapter',
        speakerCertBy: 'Rt. Hon. Ibrahim Sobur Bamidele (Speaker, 2025/2026 Session)',
      },
    });
  } else {
    v1 = await prisma.constitutionVersion.create({
      data: {
        versionName: 'v1.0 (Former NAKOLES-FUD Constitution)',
        edition: 'As Amended by the 2025/2026 Legislative Session',
        sessionId: pastSession.id,
        effectiveDate: new Date('2025-10-01'),
        adoptionDate: new Date('2025-10-15'),
        ratificationDate: new Date('2025-10-20'),
        isCurrent: false, // Ensure version 2 remains current!
        assentedBy: 'President, NAKOLES FUD Chapter',
        speakerCertBy: 'Rt. Hon. Ibrahim Sobur Bamidele (Speaker, 2025/2026 Session)',
      },
    });
  }

  // 3. Articles & Sections Data
  const articlesData = [
    {
      articleNumber: 1,
      title: 'NAME, MOTTO, AND SYMBOLS',
      slug: 'v1-article-1-name-motto-symbols',
      overview: 'Establishes official association identity, name, motto, and emblems under NAKOLES FUD Chapter.',
      sections: [
        {
          sectionNumber: 'Section 1',
          title: 'Name',
          content: 'The name of the Association shall be: "National Association of Kwara, Kogi (Okun), Oyo, Osun, Ondo, Ogun, Lagos, and Ekiti State Students (NAKOLES), Federal University Dutse Chapter."',
          displayOrder: 1,
        },
        {
          sectionNumber: 'Section 2',
          title: 'Motto',
          content: '"Ìpínlẹ̀ Ọmọ Oòduà: Ìfẹ̀ Sówapọ" (Meaning: Unity and Love Among Oodua States).',
          displayOrder: 2,
        },
        {
          sectionNumber: 'Section 3',
          title: 'Symbols',
          content: '● The Association shall have one official logo representing NAKOLES FUD Chapter.\n● The House of Representatives may adopt a distinct logo for legislative purposes.\n● Both logos shall be appended to this Constitution as official emblems of the Association.',
          displayOrder: 3,
        },
        {
          sectionNumber: 'Section 4',
          title: 'Address',
          content: 'Federal University Dutse, P.M.B. 7156, Dutse, Jigawa State, Nigeria.',
          displayOrder: 4,
        },
      ],
    },
    {
      articleNumber: 2,
      title: 'AIMS AND OBJECTIVES',
      slug: 'v1-article-2-aims-and-objectives',
      overview: 'Outlines the primary objectives, welfare mandates, and community initiatives of the Association.',
      sections: [
        {
          sectionNumber: 'Section 1',
          title: 'Primary Objectives',
          content: '● To promote unity, welfare, and academic excellence among members.\n● To serve as a platform for cultural, intellectual, and social development.\n● To encourage discipline, leadership, and mutual understanding.\n● To foster collaboration with the University management, SUG, and other recognized student bodies.\n● To engage in community development programs such as the Keep Dutse Clean Initiative.\n● To uphold and promote the ideals of fairness, service, and unity among member states.',
          displayOrder: 1,
        },
      ],
    },
    {
      articleNumber: 3,
      title: 'MEMBERSHIP',
      slug: 'v1-article-3-membership',
      overview: 'Defines membership eligibility, rights, privileges, and obligations for all member students.',
      sections: [
        {
          sectionNumber: 'Section 1',
          title: 'Eligibility',
          content: 'Membership shall be open to all bona fide students of Federal University Dutse who are indigenes of Kwara, Kogi (Okun), Oyo, Osun, Ondo, Ogun, Lagos, and Ekiti States.',
          displayOrder: 1,
        },
        {
          sectionNumber: 'Section 2',
          title: 'Rights and Privileges',
          content: 'Members shall have the right to:\n● Vote and be voted for.\n● Participate in Association programs and deliberations.\n● Freedom of expression and fair hearing.',
          displayOrder: 2,
        },
        {
          sectionNumber: 'Section 3',
          title: 'Duties and Obligations',
          content: 'Members shall:\n● Uphold the Constitution and promote unity.\n● Pay dues and levies as approved by the House.\n● Attend meetings and actively participate in activities.\n● Protect and promote the good image of the Association.',
          displayOrder: 3,
        },
      ],
    },
    {
      articleNumber: 4,
      title: 'ORGANS OF THE ASSOCIATION',
      slug: 'v1-article-4-organs-of-association',
      overview: 'Details Executive, Legislative (House of Representatives), and Judicial/CRC organs of NAKOLES.',
      sections: [
        {
          sectionNumber: 'Section 1',
          title: 'The Executive Arm',
          content: 'Headed by the President and responsible for the day-to-day administration of the Association and implementation of resolutions of the House.',
          displayOrder: 1,
        },
        {
          sectionNumber: 'Section 2',
          title: 'The Legislative Arm (House of Representatives)',
          content: '● The Legislative Arm shall consist of elected State Representatives and principal officers.\n● Each state shall nominate three (3) candidates, from which two (2) shall be screened and appointed as Representatives.\n● Faculty Representatives may be co-opted, subject to amendment.\n● The House shall make laws, deliberate, and perform oversight functions.',
          displayOrder: 2,
        },
        {
          sectionNumber: 'Section 3',
          title: 'The Judicial/CRC Committee',
          content: '● The Constitutional Review and Compliance (CRC) Committee shall interpret and recommend amendments.\n● It shall ensure constitutional compliance by all arms.\n● The Committee shall be chaired by the Clerk or any member appointed by the Speaker.',
          displayOrder: 3,
        },
      ],
    },
    {
      articleNumber: 5,
      title: 'OFFICERS OF THE HOUSE OF REPRESENTATIVES',
      slug: 'v1-article-5-officers-house-representatives',
      overview: 'Composition, election procedures, and leadership of the House of Representatives.',
      sections: [
        {
          sectionNumber: 'Section 1',
          title: 'Composition',
          content: '● The Speaker\n● The Clerk\n● The Whip\n● State Representatives',
          displayOrder: 1,
        },
        {
          sectionNumber: 'Section 2',
          title: 'Election',
          content: '● Each State shall nominate two (2) members for screening.\n● The House shall elect its officers (Speaker, Clerk, Whip) from among confirmed Representatives.\n● Vacant positions shall be filled through a bye-election.',
          displayOrder: 2,
        },
      ],
    },
    {
      articleNumber: 6,
      title: 'MEETINGS AND PROCEEDINGS',
      slug: 'v1-article-6-meetings-and-proceedings',
      overview: 'Monthly meeting schedules, emergency sessions, quorum rules (1/3), and voting procedures.',
      sections: [
        {
          sectionNumber: 'Section 1',
          title: 'Proceedings & Quorum',
          content: '● The House shall meet at least once every month or as directed by the Speaker.\n● Emergency meetings may be called when necessary.\n● Quorum shall be one-third (1/3) of members.\n● Decisions shall be by a simple majority vote.',
          displayOrder: 1,
        },
      ],
    },
    {
      articleNumber: 7,
      title: 'OATH OF OFFICE',
      slug: 'v1-article-7-oath-of-office',
      overview: 'Official text of the solemn Oath of Office sworn by all elected and appointed officers.',
      sections: [
        {
          sectionNumber: 'Section 1',
          title: 'Official Oath Text',
          content: '"I, [Name], having been duly elected as [Position], do solemnly swear/affirm to uphold the Constitution of NAKOLES FUD Chapter, to discharge my duties faithfully, honestly, and selflessly, and to place the interest of the Association and its members above personal gain. So help me God."',
          displayOrder: 1,
        },
      ],
    },
    {
      articleNumber: 8,
      title: 'FINANCE',
      slug: 'v1-article-8-finance',
      overview: 'Revenue sources, joint account management, and mandatory semester audit rules.',
      sections: [
        {
          sectionNumber: 'Section 1',
          title: 'Sources of Fund',
          content: '● Membership dues.\n● Levies approved by the House.\n● Donations, sponsorships, and grants.\n● Fundraising activities.',
          displayOrder: 1,
        },
        {
          sectionNumber: 'Section 2',
          title: 'Financial Management',
          content: 'Funds shall be kept in the Association’s bank account, jointly managed by the President, Financial Secretary, and Treasurer.',
          displayOrder: 2,
        },
        {
          sectionNumber: 'Section 3',
          title: 'Audit',
          content: 'The House shall audit the Association’s financial records once per semester.',
          displayOrder: 3,
        },
      ],
    },
    {
      articleNumber: 9,
      title: 'DISCIPLINE',
      slug: 'v1-article-9-discipline',
      overview: 'Procedures for handling gross misconduct, corruption, and constitutional breaches.',
      sections: [
        {
          sectionNumber: 'Section 1',
          title: 'Misconduct & Sanctions',
          content: '● Any member guilty of gross misconduct, corruption, or constitutional breach shall face sanctions.\n● Sanctions may include warning, suspension, removal from office, or referral to higher authorities.',
          displayOrder: 1,
        },
      ],
    },
    {
      articleNumber: 10,
      title: 'AMENDMENT AND INTERPRETATION',
      slug: 'v1-article-10-amendment-interpretation',
      overview: 'Two-thirds majority requirement for amendments and CRC Committee interpretation.',
      sections: [
        {
          sectionNumber: 'Section 1',
          title: 'Amendment & Interpretation Guidelines',
          content: '● Any member may propose an amendment in writing.\n● The CRC Committee shall review and present recommendations.\n● A two-thirds (2/3) majority of the House shall be required for adoption.\n● The CRC Committee shall interpret the Constitution when ambiguity arises.',
          displayOrder: 1,
        },
      ],
    },
    {
      articleNumber: 11,
      title: 'TENURE AND TRANSITION',
      slug: 'v1-article-11-tenure-and-transition',
      overview: 'One academic session tenure limit and annual Cultural/Handover Day protocol.',
      sections: [
        {
          sectionNumber: 'Section 1',
          title: 'Tenure & Handover',
          content: '● Tenure of office for all elected officers shall be one (1) academic session.\n● Handing-over shall take place during the annual Cultural/Handing Over Day.',
          displayOrder: 1,
        },
      ],
    },
    {
      articleNumber: 12,
      title: 'ASSOCIATION ANTHEM',
      slug: 'v1-article-12-association-anthem',
      overview: 'Official anthem title and recital requirements during official gatherings.',
      sections: [
        {
          sectionNumber: 'Section 1',
          title: 'Title',
          content: '"Ìpínlẹ̀ Ọmọ Oòduà Anthem"',
          displayOrder: 1,
        },
        {
          sectionNumber: 'Section 2',
          title: 'Lyrics (Yoruba Version)',
          content: 'Stanza 1:\nTo be prepared.....!\n\n(Anthem shall be recited at official gatherings and ceremonies.)',
          displayOrder: 2,
        },
      ],
    },
    {
      articleNumber: 13,
      title: 'MEMBERSHIP DUES AND LEVIES',
      slug: 'v1-article-13-membership-dues-levies',
      overview: 'Annual dues regulation, payment receipting by Financial Secretary, and review rules.',
      sections: [
        {
          sectionNumber: 'Section 1',
          title: 'Dues & Levies Regulation',
          content: '● Every member shall pay an annual due as determined by the House.\n● Failure to pay dues within the stipulated period shall result in suspension of privileges.\n● All payments shall be receipted and properly documented by the Financial Secretary.\n● Review of dues may be proposed by the Executive and approved by the House.',
          displayOrder: 1,
        },
      ],
    },
    {
      articleNumber: 14,
      title: 'ADVISORY AND SUPPORT OFFICES',
      slug: 'v1-article-14-advisory-support-offices',
      overview: 'Special Advisers (SAs) and Personal Assistants (PAs) appointment and House confirmation.',
      sections: [
        {
          sectionNumber: 'Section 1',
          title: 'Special Advisers (SAs) & Personal Assistants',
          content: '● The President, in consultation with the Speaker and House, may appoint Special Advisers (SAs) to assist in specific areas such as:\n  1. Intergovernmental Affairs\n  2. Media and Publicity\n  3. Student Welfare\n  4. Cultural Affairs\n  5. Logistics and Strategy\n● A Personal Assistant (PA) may be appointed to support the administrative work of the Executive.\n● SAs and PAs shall serve at the pleasure of the President but remain accountable to the Association.\n● Appointments shall be confirmed by the House before inauguration.',
          displayOrder: 1,
        },
      ],
    },
    {
      articleNumber: 15,
      title: 'MISCELLANEOUS AND SUPREMACY CLAUSE',
      slug: 'v1-article-15-miscellaneous-supremacy',
      overview: 'Supremacy of the Constitution over all association rules and immediate enactment clause.',
      sections: [
        {
          sectionNumber: 'Section 1',
          title: 'Supremacy Clause',
          content: '● This Constitution shall be the supreme law of NAKOLES FUD Chapter, and all other rules or policies shall be subject to it.\n● Any provision inconsistent with this Constitution shall be null and void to the extent of its inconsistency.\n● This Constitution shall take effect immediately upon ratification by a two-thirds (2/3) majority of the General Congress.',
          displayOrder: 1,
        },
      ],
    },
    {
      articleNumber: 16,
      title: 'ZONING AND ROTATIONAL LEADERSHIP',
      slug: 'v1-article-16-zoning-rotational-leadership',
      overview: 'Zoning structure across Zone A, Zone B, Zone C and presidential rotation principles.',
      sections: [
        {
          sectionNumber: 'Section 1',
          title: 'Purpose',
          content: 'The principle of zoning and rotation shall guide the selection and election of the Association’s principal officers to ensure equity, inclusiveness, and fair representation among all member states.',
          displayOrder: 1,
        },
        {
          sectionNumber: 'Section 2',
          title: 'Zoning Structure',
          content: 'The Association shall recognize eight (8) member states divided into three (3) zones for leadership rotation:\n● Zone A: Ekiti, Ondo, Osun\n● Zone B: Oyo, Ogun, Lagos\n● Zone C: Kwara, Kogi (Okun)',
          displayOrder: 2,
        },
        {
          sectionNumber: 'Section 3',
          title: 'Rotation Principle',
          content: '1. The Office of the President shall rotate among the zones in alphabetical order — A → B → C → A.\n2. The Office of the Vice President shall come from a different zone than the President.\n3. The Office of the Speaker shall not come from the same zone as the President or Vice President.\n4. Other executive positions shall be distributed to ensure balanced representation.',
          displayOrder: 3,
        },
        {
          sectionNumber: 'Section 4',
          title: 'Implementation Guide',
          content: '1. The outgoing executive shall announce the zone eligible for the next presidency.\n2. States within that zone shall produce qualified aspirants.\n3. If no candidate emerges from the designated zone, the House may temporarily suspend zoning by a two-thirds (2/3) vote.',
          displayOrder: 4,
        },
        {
          sectionNumber: 'Section 5',
          title: 'Review',
          content: 'Zoning arrangements shall be reviewed every five (5) years or as determined by the House.',
          displayOrder: 5,
        },
        {
          sectionNumber: 'Section 6',
          title: 'Compliance',
          content: 'Any election or appointment conducted in violation of this zoning arrangement shall be declared null and void by the CRC Committee.',
          displayOrder: 6,
        },
      ],
    },
  ];

  for (const artData of articlesData) {
    const article = await prisma.constitutionArticle.create({
      data: {
        versionId: v1.id,
        articleNumber: artData.articleNumber,
        title: artData.title,
        slug: artData.slug,
        overview: artData.overview,
      },
    });

    for (const secData of artData.sections) {
      await prisma.constitutionSection.create({
        data: {
          articleId: article.id,
          sectionNumber: secData.sectionNumber,
          title: secData.title,
          content: secData.content,
          displayOrder: secData.displayOrder,
        },
      });
    }
  }

  // Add Amendments if applicable
  await prisma.constitutionAmendment.create({
    data: {
      versionId: v1.id,
      proposedBy: 'NAKOLES House of Representatives (2025/2026 Session)',
      dateProposed: new Date('2025-09-15'),
      dateRatified: new Date('2025-10-15'),
      amendmentSummary: 'Harmonization of 8 Constituent States zoning structure & Speaker leadership oversight.',
      fullText: 'Ratified by the NAKOLES-FUD House of Representatives under the Leadership of Rt. Hon. Ibrahim Sobur Bamidele (Speaker, 2025/2026 Legislative Session). Adopted: October 2025.',
    },
  });

  console.log('✅ Version 1 — Former NAKOLES-FUD Constitution (October 2025) successfully seeded with 16 Articles!');
}

seedFormerConstitution()
  .catch((e) => {
    console.error('❌ Error seeding former constitution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
