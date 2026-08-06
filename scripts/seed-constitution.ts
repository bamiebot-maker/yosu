import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📜 Seeding Complete 17 Articles of YOSU Unification Constitution 2026...');

  const currentSession = await prisma.administrationSession.findFirst({
    where: { isCurrent: true },
  });

  if (!currentSession) {
    console.error('❌ Active administration session not found. Please run main seed script first.');
    process.exit(1);
  }

  // 1. Create or Update Constitution Version
  let version = await prisma.constitutionVersion.findFirst({
    where: { isCurrent: true },
  });

  if (!version) {
    version = await prisma.constitutionVersion.create({
      data: {
        versionName: '2026 Unification Constitution',
        edition: '1st Harmonized Edition',
        sessionId: currentSession.id,
        effectiveDate: new Date('2026-07-11'),
        adoptionDate: new Date('2026-07-10'),
        ratificationDate: new Date('2026-07-10'),
        isCurrent: true,
        assentDate: new Date('2026-07-11'),
        assentedBy: 'Asiwaju Abdulsalam Abdulgafar Oluwagbenga',
        speakerCertBy: 'Rt. Hon. Ibrahim Sobur Bamidele',
        viewsCount: 142,
        downloadsCount: 38,
      },
    });
  } else {
    version = await prisma.constitutionVersion.update({
      where: { id: version.id },
      data: {
        versionName: '2026 Unification Constitution',
        edition: '1st Harmonized Edition',
        effectiveDate: new Date('2026-07-11'),
        adoptionDate: new Date('2026-07-10'),
        ratificationDate: new Date('2026-07-10'),
        isCurrent: true,
        assentDate: new Date('2026-07-11'),
        assentedBy: 'Asiwaju Abdulsalam Abdulgafar Oluwagbenga',
        speakerCertBy: 'Rt. Hon. Ibrahim Sobur Bamidele',
      },
    });
  }

  // Delete existing articles for clean idempotent seed
  await prisma.constitutionArticle.deleteMany({
    where: { versionId: version.id },
  });

  await prisma.constitutionAmendment.deleteMany({
    where: { versionId: version.id },
  });

  // 2. Data of 17 Articles with all Sections
  const articlesData = [
    {
      articleNumber: 1,
      title: 'NAME, SUPREMACY, STATUS, MOTTO, ADDRESS AND SYMBOLS',
      slug: 'article-1-name-supremacy-status-motto-address-symbols',
      overview: 'Preamble and foundational definitions of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter as the supreme governing law.',
      sections: [
        { sectionNumber: '1', title: 'Supremacy of the Constitution', content: '1. This Constitution shall be the supreme law of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter, and its provisions shall be binding on all organs, officers and members of the Union.\n2. Any act, decision, regulation, policy or omission which is inconsistent with the provisions of this Constitution shall be null and void to the extent of its inconsistency.\n3. Where the implementation of any provision becomes temporarily impracticable due to exceptional circumstances, interim regulations may be enacted subject to House approval.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Name', content: 'The Union shall be known as the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter. The Union may also be referred to by the acronym "YOSU".', displayOrder: 2 },
        { sectionNumber: '3', title: 'Motto', content: 'The Motto of the Association shall be: "Ìpínlẹ̀ Ọmọ Oòduà: Ìfẹ̀ Sówapọ", which signifies unity, love, cooperation and collective progress among members.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Status and Autonomy', content: '1. The Association shall be the recognized umbrella body representing the collective interests and welfare of all bona fide Yoruba students of the Federal University Dutse.\n2. The Association shall remain autonomous in its internal affairs, subject to University regulations and this Constitution.', displayOrder: 4 },
        { sectionNumber: '5', title: 'Official Address', content: 'The official address of the Union shall be: Yoruba Students\' Union (YOSU), Federal University Dutse Chapter, Federal University Dutse, PMB 7156, Dutse, Jigawa State, Nigeria.', displayOrder: 5 },
        { sectionNumber: '6', title: 'Official Symbols', content: '1. The Association shall possess an Official Logo, Anthem, Flag and Seal.\n2. The official symbols remain the exclusive intellectual property of YOSU and shall not be altered without House approval.', displayOrder: 6 },
      ],
    },
    {
      articleNumber: 2,
      title: 'MEMBERSHIP',
      slug: 'article-2-membership',
      overview: 'Eligibility criteria, rights, duties, and conditions for suspension or loss of membership in the Union.',
      sections: [
        { sectionNumber: '1', title: 'Eligibility for Membership', content: '1. Membership shall be open to all bona fide Yoruba students of the Federal University Dutse.\n2. Applicants shall provide valid evidence of studentship and Yoruba state origin or affiliation.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Rights of Members', content: 'Every member shall have the right to participate in activities, vote and be voted for, enjoy welfare benefits, and enjoy fair hearing and freedom of expression.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Duties of Members', content: 'Every member shall uphold this Constitution, promote unity and academic excellence, pay approved dues, and respect constituted authorities.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Suspension or Loss of Membership', content: 'No member shall be sanctioned except in accordance with fair hearing provisions and upon recommendation by the Constitutional Review and Compliance Committee (CRC).', displayOrder: 4 },
      ],
    },
    {
      articleNumber: 3,
      title: 'AIM AND OBJECTIVES',
      slug: 'article-3-aim-and-objectives',
      overview: 'Core mission, vision, and strategic goals of the Union.',
      sections: [
        { sectionNumber: '1', title: 'Aim', content: 'The Union shall promote unity, welfare, cultural identity, academic excellence, leadership development and collective progress among Yoruba students of the Federal University Dutse.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Objectives', content: 'a. Promote unity and mutual understanding.\nb. Protect member welfare and legitimate aspirations.\nc. Encourage academic excellence and mentorship.\nd. Celebrate Yoruba cultural heritage and traditions.\ne. Maintain cordial relations with University management and Student Union Government.', displayOrder: 2 },
      ],
    },
    {
      articleNumber: 4,
      title: 'ORGANS OF THE ASSOCIATION',
      slug: 'article-4-organs-of-the-association',
      overview: 'Structure of governing organs: Congress, Executive Council, House of Representatives, and Independent Committees.',
      sections: [
        { sectionNumber: '1', title: 'Organs of the Union', content: 'The Union shall consist of the following primary organs:\na. Congress (General Assembly)\nb. Executive Council (EXCO)\nc. House of Representatives (Legislative Arm)', displayOrder: 1 },
        { sectionNumber: '2', title: 'Independent Constitutional Bodies', content: 'The following independent bodies are established:\na. Constitutional Review and Compliance Committee (CRC)\nb. Nomination and Screening Committee (NSC)', displayOrder: 2 },
        { sectionNumber: '3', title: 'Supremacy of Constitutional Organs', content: 'All organs shall exercise their powers subject to the provisions of this Constitution.', displayOrder: 3 },
      ],
    },
    {
      articleNumber: 5,
      title: 'THE EXECUTIVE COUNCIL',
      slug: 'article-5-the-executive-council',
      overview: 'Establishment, composition, qualification, tenure, oath of office, and succession framework for EXCO.',
      sections: [
        { sectionNumber: '1', title: 'Establishment', content: 'There shall be an Executive Council responsible for the day-to-day administration and management of Union affairs.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Composition', content: 'The Executive Council consists of 17 sworn officers including President, Vice President, Secretary General, Financial Secretary, Treasurer, Auditor General, Directors, PRO, and Disciplinary Officer.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Qualification for Office', content: 'Nominees must be bona fide registered students of good academic standing, moral character, and financial clearance.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Tenure of Office', content: 'Executive Officers hold office for one academic session until successors are duly sworn in.', displayOrder: 4 },
        { sectionNumber: '5', title: 'Succession', content: 'Where the office of President becomes vacant, the Vice President shall immediately assume office as President for the unexpired tenure.', displayOrder: 5 },
      ],
    },
    {
      articleNumber: 6,
      title: 'POWERS AND FUNCTIONS OF EXECUTIVE OFFICERS',
      slug: 'article-6-powers-and-functions-of-executive-officers',
      overview: 'Specific constitutional powers, duties, and portfolios assigned to each Executive Officer.',
      sections: [
        { sectionNumber: '1', title: 'President', content: 'The President shall be the Chief Executive Officer, official spokesperson, bank signatory, and head of Executive Council.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Vice President', content: 'The Vice President shall assist the President, oversee student welfare, and succeed the President in event of vacancy.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Secretary General', content: 'Chief Administrative Officer responsible for official secretariat records, minutes, correspondence, and notices.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Financial Secretary & Treasurer', content: 'Responsible for maintaining financial records, banking operations, revenue collection, asset registers, and fiscal reports.', displayOrder: 4 },
        { sectionNumber: '5', title: 'Director of Cultural Affairs', content: 'Promotes Yoruba cultural heritage, festival arts, Àṣà Day celebrations, and traditional institutions.', displayOrder: 5 },
      ],
    },
    {
      articleNumber: 7,
      title: 'HOUSE OF REPRESENTATIVES',
      slug: 'article-7-house-of-representatives',
      overview: 'Legislative and oversight arm of the Union representing the 8 Yoruba Constituent States.',
      sections: [
        { sectionNumber: '1', title: 'Establishment & Oversight', content: 'The House of Representatives is the legislative and oversight arm of the Union.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Composition & State Equality', content: 'Each of the 8 Constituent States (Oyo, Osun, Ogun, Ondo, Ekiti, Lagos, Kwara, Kogi) is entitled to two (2) delegates in assembly.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Principal Officers of the House', content: 'The House shall elect Speaker, Deputy Speaker, Clerk, and Chief Whip at its inaugural sitting.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Powers of Legislation & Budget', content: 'The House approves annual budgets, considers constitutional amendments, ratifies appointments, and exercises financial oversight.', displayOrder: 4 },
      ],
    },
    {
      articleNumber: 8,
      title: 'CONSTITUTIONAL REVIEW AND COMPLIANCE COMMITTEE (CRC)',
      slug: 'article-8-constitutional-review-and-compliance-committee',
      overview: 'Independent judicial and compliance committee enforcing constitutional adherence and resolving disputes.',
      sections: [
        { sectionNumber: '1', title: 'Establishment & Autonomy', content: 'Independent constitutional body responsible for constitutional compliance, dispute resolution, and disciplinary review.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Composition', content: 'Consists of 5 non-executive members nominated by Executive Council and confirmed by the House of Representatives.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Powers of Investigation & Fair Hearing', content: 'Investigates allegations of constitutional breach and guarantees right to fair hearing for all accused members.', displayOrder: 3 },
      ],
    },
    {
      articleNumber: 9,
      title: 'NOMINATION AND SCREENING COMMITTEE (NSC)',
      slug: 'article-9-nomination-and-screening-committee',
      overview: 'Electoral and screening committee managing transition timetables and candidate verification.',
      sections: [
        { sectionNumber: '1', title: 'Establishment', content: 'Responsible for receiving, verifying, screening, and recommending candidates for elective offices.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Screening Timetable & Transition', content: 'Publishes nomination guidelines 4 weeks prior to screening and conducts transition and handing over proceedings.', displayOrder: 2 },
      ],
    },
    {
      articleNumber: 10,
      title: 'FINANCE',
      slug: 'article-10-finance',
      overview: 'Financial management, banking operations, annual budget, audit, and sanctions for financial misconduct.',
      sections: [
        { sectionNumber: '1', title: 'Sources of Revenue', content: 'Funds derived from membership registration, annual dues, lawful donations, grants, and fundraising activities.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Budget & Expenditure Controls', content: 'No expenditure shall be incurred outside approved Annual Budget without House authorization.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Banking & Audit', content: 'Mandatory semester financial audits by Auditor General and maintenance of official Asset Register.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Sanctions for Misconduct', content: 'Embezzlement, falsification, or unauthorized expenditure attracts restitution, removal from office, and disqualification.', displayOrder: 4 },
      ],
    },
    {
      articleNumber: 11,
      title: 'MEETINGS',
      slug: 'article-11-meetings',
      overview: 'Classification of meetings: Congress, EXCO, House Sittings, Committees, Emergency, Physical, Virtual and Hybrid meetings.',
      sections: [
        { sectionNumber: '1', title: 'Types of Meetings', content: 'Congress Meetings, EXCO Meetings, House Sittings, Committee Meetings, Emergency Meetings, and Hybrid Sessions.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Quorum & Decision Voting', content: 'Quorum for Congress is 1/3 of registered members. Decisions made by simple majority vote.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Physical, Virtual and Hybrid Meetings', content: 'Virtual or hybrid attendance on approved platforms constitutes valid legal presence.', displayOrder: 3 },
      ],
    },
    {
      articleNumber: 12,
      title: 'LEADERSHIP ROTATION AND EQUITABLE REPRESENTATION',
      slug: 'article-12-leadership-rotation-and-equitable-representation',
      overview: 'Constitutional principle ensuring equitable rotation of Executive Presidency among all 8 Yoruba Constituent States.',
      sections: [
        { sectionNumber: '1', title: 'Principle of Equitable Representation', content: 'No single constituent state shall dominate Union leadership to the exclusion of others.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Presidency Rotation', content: 'The office of Executive President shall rotate equitably among Kwara, Kogi (Okun), Oyo, Osun, Ondo, Ogun, Lagos, and Ekiti States.', displayOrder: 2 },
      ],
    },
    {
      articleNumber: 13,
      title: 'PATRONS, PATRONESSES AND CULTURAL INSTITUTIONS',
      slug: 'article-13-patrons-patronesses-and-cultural-institutions',
      overview: 'Advisory patrons, royal court of traditional title holders (OBA, Oloris), and cultural preservation.',
      sections: [
        { sectionNumber: '1', title: 'Patrons and Mentors', content: 'Advisers and staff mentors appointed to guide the Union without interfering in day-to-day administration.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Traditional Titles & Royal Court', content: 'Confers ceremonial cultural titles including OBA, Bashorun, Bobagunwa, Otun, Iyalode, and Olori.', displayOrder: 2 },
      ],
    },
    {
      articleNumber: 14,
      title: 'DISCIPLINE, OFFENCES AND PENALTIES',
      slug: 'article-14-discipline-offences-and-penalties',
      overview: 'Classification of offences (Minor, Serious, Gross Misconduct), online conduct regulations, and disciplinary procedures.',
      sections: [
        { sectionNumber: '1', title: 'Classification of Misconduct', content: 'Offences classified as Minor Misconduct, Serious Misconduct, and Gross Misconduct.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Online Platform Conduct', content: 'Prohibits cyberbullying, hate speech, false information dissemination, and impersonation on official digital platforms.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Sanctions & Right to Appeal', content: 'Sanctions range from warnings to removal from office. Accused members retain right to appeal within 7 days.', displayOrder: 3 },
      ],
    },
    {
      articleNumber: 15,
      title: 'CONSTITUTIONAL AMENDMENT, TRANSITIONAL PROVISIONS, OATHS, CITATION AND COMMENCEMENT',
      slug: 'article-15-amendment-transitional-provisions-oaths-citation-commencement',
      overview: 'Amendment procedures (2/3 House & Congress ratification), transitional provisions, Oaths of Allegiance & Office, citation, and commencement.',
      sections: [
        { sectionNumber: '1', title: 'Amendment Procedure', content: 'Proposals require 2/3 majority approval in the House of Representatives and 2/3 ratification by Congress.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Oaths of Allegiance & Office', content: 'Prescribes mandatory Schedule I (Oath of Allegiance) and Schedule II (Oath of Office) prior to assuming duties.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Citation & Commencement', content: 'This Constitution shall be cited as "The Unification Constitution of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter" and takes effect upon Presidential Assent.', displayOrder: 3 },
      ],
    },
    {
      articleNumber: 16,
      title: 'VACANCY, REMOVAL, RESIGNATION AND SUCCESSION',
      slug: 'article-16-vacancy-removal-resignation-and-succession',
      overview: 'Procedures for handling vacancies, resignation, impeachment removal, and temporary absence.',
      sections: [
        { sectionNumber: '1', title: 'Vacancy & Resignation', content: 'An office becomes vacant upon written resignation, loss of student status, permanent incapacity, or removal.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Removal from Office', content: 'Requires investigation by CRC and 2/3 majority vote of the House of Representatives.', displayOrder: 2 },
      ],
    },
    {
      articleNumber: 17,
      title: 'INTERPRETATION AND RATIFICATION SCHEDULES',
      slug: 'article-17-interpretation-schedules-assent-certificates',
      overview: 'Legal definitions, Schedules, Presidential Assent, Speaker Certificate, and House Ratification Record.',
      sections: [
        { sectionNumber: '1', title: 'Interpretation', content: 'Defines Union, Congress, EXCO, House of Representatives, CRC, NSC, Member, Officer, Session, and Constitution.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Presidential Assent', content: 'Given by President Asiwaju Abdulsalam Abdulgafar Oluwagbenga on Saturday, 11 July 2026.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Speaker\'s Certificate', content: 'Certified and transmitted by Speaker Rt. Hon. Ibrahim Sobur Bamidele on Saturday, 11 July 2026.', displayOrder: 3 },
        { sectionNumber: '4', title: 'House Ratification', content: 'Unanimously adopted and ratified on Friday, 10 July 2026 following motion moved by Osun State and seconded by Ondo State.', displayOrder: 4 },
      ],
    },
  ];

  for (const artData of articlesData) {
    const article = await prisma.constitutionArticle.create({
      data: {
        versionId: version.id,
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

  // 3. Seed Constitutional Amendments History
  await prisma.constitutionAmendment.createMany({
    data: [
      {
        versionId: version.id,
        proposedBy: 'Executive Council & House of Representatives',
        dateProposed: new Date('2026-06-15'),
        dateRatified: new Date('2026-07-10'),
        amendmentSummary: 'Historic Institutional Approval & Name Change from NAKOLES to Yoruba Students\' Union (YOSU)',
        fullText: 'Official approval granted by the Federal University Dutse Students\' Affairs Division changing the Association name from NAKOLES to YOSU. Harmonized across all constitutional articles.',
      },
      {
        versionId: version.id,
        proposedBy: 'Constitutional Review Committee (CRC)',
        dateProposed: new Date('2026-06-20'),
        dateRatified: new Date('2026-07-10'),
        amendmentSummary: 'Equal 8 Constituent States Legislative Representation Framework',
        fullText: 'Codified Article Seven Section 2 establishing two (2) Honourable Representatives per state across all 8 Yoruba Constituent States (Kwara, Kogi, Oyo, Osun, Ondo, Ogun, Lagos, Ekiti).',
      },
    ],
  });

  console.log('✅ Successfully seeded all 17 Articles of the YOSU Unification Constitution 2026!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding constitution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
