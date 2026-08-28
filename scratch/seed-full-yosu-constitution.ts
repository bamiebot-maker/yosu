import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📜 Seeding COMPLETE 17 Articles of YOSU Unification Constitution (2026 Edition)...');

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

  // 2. Clear old constitution versions or mark inactive
  await prisma.constitutionVersion.updateMany({ data: { isCurrent: false } });

  const pdfMedia = await prisma.media.findFirst({ where: { mimeType: 'application/pdf' } });

  // 3. Create Full Unification Constitution Version
  const constitution = await prisma.constitutionVersion.create({
    data: {
      versionName: 'Unification Constitution of YOSU',
      edition: 'As Amended by the 2025/2026 Legislative Session',
      sessionId: session.id,
      effectiveDate: new Date('2026-07-11'),
      adoptionDate: new Date('2026-07-10'),
      ratificationDate: new Date('2026-07-10'),
      assentDate: new Date('2026-07-11'),
      isCurrent: true,
      assentedBy: 'President Asiwaju Abdulsalam Abdulgafar Oluwagbenga',
      speakerCertBy: 'Rt. Hon. Ibrahim Sobur Bamidele (Speaker of the House)',
      pdfMediaId: pdfMedia?.id || null,
      articles: {
        create: [
          {
            articleNumber: 1,
            title: 'Name, Supremacy, Status, Motto, Address and Symbols',
            slug: 'article-1-name-supremacy-motto-address-symbols',
            overview: 'Establishes constitutional supremacy, official name, motto, autonomy, address, and symbols of YOSU.',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1',
                  title: 'Supremacy of the Constitution',
                  content: '1. This Constitution shall be the supreme law of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter, and its provisions shall be binding on all organs, officers and members of the Union.\n2. Any act, decision, regulation, policy or omission which is inconsistent with the provisions of this Constitution shall be null and void to the extent of its inconsistency.\n3. Where the implementation of any provision becomes temporarily impracticable due to exceptional circumstances, the Executive Council may make interim administrative regulations, subject to the approval of the House of Representatives.',
                  displayOrder: 1,
                },
                {
                  sectionNumber: 'Section 2',
                  title: 'Name',
                  content: 'The Union shall be known as the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter. The Union may also be referred to by the acronym "YOSU".',
                  displayOrder: 2,
                },
                {
                  sectionNumber: 'Section 3',
                  title: 'Motto',
                  content: 'The Motto of the Association shall be: "Ìpínlẹ̀ Ọmọ Oòduà: Ìfẹ̀ Sówapọ", which signifies unity, love, cooperation and collective progress among members.',
                  displayOrder: 3,
                },
                {
                  sectionNumber: 'Section 4',
                  title: 'Status and Autonomy',
                  content: '1. The Association shall be the recognized umbrella body representing the collective interests and welfare of all bona fide Yoruba students of the Federal University Dutse.\n2. The Association shall remain autonomous in its internal affairs, subject to the regulations of the Federal University Dutse and the provisions of this Constitution.',
                  displayOrder: 4,
                },
                {
                  sectionNumber: 'Section 5',
                  title: 'Official Address',
                  content: 'The official address of the Union shall be: Yoruba Students\' Union (YOSU), Federal University Dutse Chapter, Federal University Dutse, PMB 7156, Dutse, Jigawa State, Nigeria.',
                  displayOrder: 5,
                },
                {
                  sectionNumber: 'Section 6',
                  title: 'Official Symbols',
                  content: '1. The Association shall possess an Official Logo.\n2. The Association may adopt an Official Anthem, Flag, Seal or any other symbol approved by the House of Representatives.\n3. The official symbols shall remain the property of YOSU and shall not be altered or used without legislative approval.',
                  displayOrder: 6,
                },
              ],
            },
          },
          {
            articleNumber: 2,
            title: 'Membership',
            slug: 'article-2-membership',
            overview: 'Defines eligibility, rights, duties, and loss or suspension of membership.',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1',
                  title: 'Eligibility for Membership',
                  content: '1. Membership of the Union shall be open to all bona fide Yoruba students of the Federal University Dutse.\n2. An applicant shall provide evidence of studentship and Yoruba origin or affiliation as prescribed by the Union.\n3. Membership becomes effective upon registration procedures approved by the Executive Council and ratified by the House of Representatives.',
                  displayOrder: 1,
                },
                {
                  sectionNumber: 'Section 2',
                  title: 'Rights of Members',
                  content: 'Every member shall have the right to:\na. Participate in the activities and programmes of the Union;\nb. Attend meetings of the Union;\nc. Vote and be voted for, subject to this Constitution;\nd. Enjoy welfare benefits and privileges approved by the Union;\ne. Freedom of expression, fair hearing and equal treatment.',
                  displayOrder: 2,
                },
                {
                  sectionNumber: 'Section 3',
                  title: 'Duties of Members',
                  content: 'Every member shall:\na. Observe and uphold the provisions of this Constitution;\nb. Promote unity, progress and good image of the Union;\nc. Pay approved dues, levies and fees;\nd. Participate actively in Union affairs;\ne. Respect constituted authorities of the Union.',
                  displayOrder: 3,
                },
                {
                  sectionNumber: 'Section 4',
                  title: 'Suspension or Loss of Membership',
                  content: '1. A member shall not be suspended, sanctioned or expelled except in accordance with this Constitution after a fair hearing.\n2. Expulsion shall require recommendation of the Constitutional Review and Compliance Committee (CRC) and approval of the House of Representatives.',
                  displayOrder: 4,
                },
              ],
            },
          },
          {
            articleNumber: 3,
            title: 'Aims and Objectives',
            slug: 'article-3-aims-and-objectives',
            overview: 'Outlines the core mission and strategic objectives of YOSU FUD.',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1',
                  title: 'Aim',
                  content: 'The Union shall promote unity, welfare, cultural identity, academic excellence, leadership development and collective progress among Yoruba students of the Federal University Dutse.',
                  displayOrder: 1,
                },
                {
                  sectionNumber: 'Section 2',
                  title: 'Objectives',
                  content: 'The objectives shall be to:\na. Promote unity, cooperation and mutual understanding among Yoruba students;\nb. Protect and advance welfare, interests and legitimate aspirations;\nc. Encourage academic excellence, intellectual development and educational advancement;\nd. Foster peaceful coexistence with University authorities, SUG and other bodies;\ne. Preserve, promote and celebrate the cultural heritage and traditions of the Yoruba people;\nf. Organize educational, cultural, intellectual, social and recreational programmes;\ng. Encourage leadership development, innovation, entrepreneurship and self-reliance;\nh. Promote discipline, integrity and responsibility;\ni. Provide a platform for advocacy and representation;\nj. Encourage community development and volunteerism;\nk. Promote inclusiveness, mutual respect and non-discrimination;\nl. Undertake lawful activities necessary for achieving Union objectives;\nm. Uphold constitutionalism, accountability, transparency and democratic governance;\nn. Establish cordial relationships with Yoruba student associations and cultural bodies.',
                  displayOrder: 2,
                },
              ],
            },
          },
          {
            articleNumber: 4,
            title: 'Organs of the Association',
            slug: 'article-4-organs-of-the-association',
            overview: 'Defines the main governing organs and independent constitutional bodies.',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1',
                  title: 'Organs of the Union',
                  content: 'The Union shall consist of the following organs:\na. Congress;\nb. Executive Council;\nc. House of Representatives.',
                  displayOrder: 1,
                },
                {
                  sectionNumber: 'Section 2',
                  title: 'Independent Constitutional Bodies',
                  content: 'The following independent constitutional bodies are established:\na. Constitutional Review and Compliance Committee (CRC);\nb. Nomination and Screening Committee (NSC).',
                  displayOrder: 2,
                },
                {
                  sectionNumber: 'Section 3',
                  title: 'Supremacy of Constitutional Organs and Bodies',
                  content: 'All organs and constitutional bodies established under this Constitution shall exercise their powers and perform functions in accordance with and subject to the provisions of this Constitution.',
                  displayOrder: 3,
                },
              ],
            },
          },
          {
            articleNumber: 5,
            title: 'The Executive Council',
            slug: 'article-5-the-executive-council',
            overview: 'Establishment, composition, qualifications, tenure, oath, vacancy, and succession of EXCO.',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1',
                  title: 'Establishment',
                  content: 'There shall be an Executive Council responsible for the day-to-day administration and management of the affairs of the Union.',
                  displayOrder: 1,
                },
                {
                  sectionNumber: 'Section 2',
                  title: 'Composition',
                  content: 'The Executive Council shall consist of 17 offices: 1. President, 2. Vice President, 3. Secretary General, 4. Assistant Secretary General, 5. Financial Secretary, 6. Treasurer, 7. Auditor General, 8. Director of Membership Affairs, 9. Director of Education and Academic Affairs, 10. Director of Cultural Affairs, 11. Public Relations Officer, 12. Assistant Public Relations Officer, 13. Social Director, 14. Welfare Director, 15. Assistant Welfare Director, 16. Sports Director, 17. Disciplinary Officer.',
                  displayOrder: 2,
                },
                {
                  sectionNumber: 'Section 3',
                  title: 'Qualification for Office',
                  content: 'A person is qualified for nomination if they are a bona fide member of the Union, registered student of FUD, of good character, not found guilty of gross misconduct, meet academic requirements, and fulfilled financial obligations.',
                  displayOrder: 3,
                },
                {
                  sectionNumber: 'Section 4',
                  title: 'Tenure of Office',
                  content: 'Members of the Executive Council shall hold office for a term of one academic session until a successor is duly nominated, screened, sworn in, and assumes office.',
                  displayOrder: 4,
                },
                {
                  sectionNumber: 'Section 5',
                  title: 'Oath of Office',
                  content: 'No Executive Officer shall assume office unless subscribing to the prescribed Oath of Allegiance and Oath of Office.',
                  displayOrder: 5,
                },
                {
                  sectionNumber: 'Section 6',
                  title: 'Vacancy & Succession',
                  content: 'Where the office of President becomes vacant, the Vice President shall assume office as President for the unexpired tenure. Vacancies in other offices shall be filled by Executive Council nomination subject to House approval.',
                  displayOrder: 6,
                },
              ],
            },
          },
          {
            articleNumber: 6,
            title: 'Powers and Functions of Executive Officers',
            slug: 'article-6-powers-and-functions-of-executive-officers',
            overview: 'Detailed statutory duties for all 17 Executive Officers.',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1-3',
                  title: 'President, Vice President & Secretary General',
                  content: 'President: Chief Executive Officer, official spokesperson, presides over EXCO and Congress, bank signatory, presents Annual Budget.\nVice President: Assists President, acts in absence, coordinates delegated tasks.\nSecretary General: Chief Administrative Officer, keeps records and minutes, official correspondence, custody of documents.',
                  displayOrder: 1,
                },
                {
                  sectionNumber: 'Section 4-7',
                  title: 'Financial Officers (Fin Sec, Treasurer, Auditor General)',
                  content: 'Financial Secretary: Maintains financial records, receives monies, bank signatory, prepares financial statements.\nTreasurer: Safeguards monies, prompt banking, bank signatory, maintains custody records and Asset Register.\nAuditor General: Audits financial records at least once per semester, submits audit reports independently to House and Congress.',
                  displayOrder: 2,
                },
                {
                  sectionNumber: 'Section 8-17',
                  title: 'Directors, PRO & Disciplinary Officer',
                  content: 'Academic Director: Promotes academic excellence, tutorials, past questions, liaises on academic matters.\nCultural Director: Promotes Yoruba culture, heritage festivals, coordinates traditional court.\nPRO: Manages public image, press releases, publicity.\nSocial & Sports Directors: Organize recreational, social, and sporting events.\nWelfare Director: Promotes member welfare and handles relief complaints.\nDisciplinary Officer: Enforces meeting discipline, compliance, and works with CRC.',
                  displayOrder: 3,
                },
              ],
            },
          },
          {
            articleNumber: 7,
            title: 'House of Representatives',
            slug: 'article-7-house-of-representatives',
            overview: 'Legislative arm, state delegates, principal officers, powers, summons, and sittings.',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1-3',
                  title: 'Establishment, Composition & Principal Officers',
                  content: '1. Legislative and oversight arm consisting of two (2) representatives from each Constituent State.\n2. Nominated by respective States within 14 days of EXCO inauguration.\n3. Elects Speaker, Deputy Speaker, Clerk of the House, and Chief Whip at inaugural sitting by simple majority.',
                  displayOrder: 1,
                },
                {
                  sectionNumber: 'Section 4-9',
                  title: 'Functions, Powers, Sittings & Quorum',
                  content: '1. Makes rules, resolutions, approves EXCO policies, exercises oversight, approves Annual Budget and major expenditures.\n2. Power to summon any officer for information or clarification.\n3. Sits at least twice every semester. Quorum is one-third (1/3) of total membership.\n4. Principal officers removable by 2/3 majority resolution for misconduct or incompetence.',
                  displayOrder: 2,
                },
              ],
            },
          },
          {
            articleNumber: 8,
            title: 'Constitutional Review and Compliance Committee (CRC)',
            slug: 'article-8-crc-committee',
            overview: 'Independent 5-member judicial body for constitutional interpretation and dispute resolution.',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1-4',
                  title: 'Establishment, Composition & Functions',
                  content: '1. Independent 5-member body nominated by EXCO and confirmed by House. Elects Chairperson and Secretary.\n2. Interprets Constitution, resolves disputes, investigates misconduct, ensures compliance, conducts constitutional reviews, recommends sanctions.\n3. Holds office for 1 academic session (renewable once).',
                  displayOrder: 1,
                },
                {
                  sectionNumber: 'Section 5-11',
                  title: 'Powers, Fair Hearing & Appeals',
                  content: '1. Power to compel documents and witnesses.\n2. Enforces strict principles of Fair Hearing and natural justice.\n3. Decisions on major sanctions require House confirmation. Appeals go to the House within 7 days.',
                  displayOrder: 2,
                },
              ],
            },
          },
          {
            articleNumber: 9,
            title: 'Nomination, Screening and Electoral Committee (NSC)',
            slug: 'article-9-nsc-electoral-committee',
            overview: 'Independent committee for leadership nomination, screening, verification, and handover.',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1-5',
                  title: 'Establishment, Composition & Timetable',
                  content: '1. Independent 5-member committee nominated by House and confirmed by Congress.\n2. Conducts screening, verification, and recommendations for Executive offices.\n3. Formed 6 weeks before tenure expiration; publishes timetable 4 weeks prior.',
                  displayOrder: 1,
                },
                {
                  sectionNumber: 'Section 6-11',
                  title: 'Qualifications, Disqualification & Transition',
                  content: '1. Nominees must be bona fide members, registered FUD students, of proven integrity.\n2. Unopposed candidates subject to Congress confirmation.\n3. Supervises formal Handover Ceremony and Oath of Allegiance/Office.',
                  displayOrder: 2,
                },
              ],
            },
          },
          {
            articleNumber: 10,
            title: 'Finance',
            slug: 'article-10-finance',
            overview: 'Financial year, revenue sources, budget, banking, audit, and sanctions for financial misconduct.',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1-6',
                  title: 'Revenue, Budget & Banking Controls',
                  content: '1. Revenue derived from registration, dues, levies, grants, fundraising, and sponsorships.\n2. Annual Budget submitted by EXCO to House for approval before expenditure.\n3. Signatories: President, Financial Secretary, Treasurer (any 2 authorization required).\n4. Expenditure >10% over budget requires prior House approval.',
                  displayOrder: 1,
                },
                {
                  sectionNumber: 'Section 7-12',
                  title: 'Audit, Property & Financial Misconduct',
                  content: '1. Auditor General audits financial records at least once per semester.\n2. Treasurer maintains Asset Register containing all movable and immovable property.\n3. Financial misconduct (misappropriation, embezzlement, falsification) attracts refund, removal, disqualification, and reporting to authorities.',
                  displayOrder: 2,
                },
              ],
            },
          },
          {
            articleNumber: 11,
            title: 'Meetings',
            slug: 'article-11-meetings',
            overview: 'Types of meetings, Congress powers, House sittings, emergency meetings, quorum, and voting.',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1-3',
                  title: 'Types of Meetings & Congress Powers',
                  content: '1. Meetings: Congress, EXCO, House Sittings, Committee, Emergency.\n2. Congress is the supreme deliberative organ of the Union, held at least twice per semester. Quorum is 1/3 of registered members.\n3. EXCO meets at least twice every month.',
                  displayOrder: 1,
                },
                {
                  sectionNumber: 'Section 4-13',
                  title: 'House Sittings, Voting & Hybrid Meetings',
                  content: '1. House holds at least 2 regular sittings per semester.\n2. Decisions made by simple majority vote (presiding officer has casting vote in ties).\n3. Permits physical, virtual, and hybrid meetings with equal legal force.',
                  displayOrder: 2,
                },
              ],
            },
          },
          {
            articleNumber: 12,
            title: 'Leadership Rotation and Equitable Representation',
            slug: 'article-12-leadership-rotation',
            overview: 'Enforces Presidential rotation among the 8 Constituent States and equitable office distribution.',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1-3',
                  title: 'Principle of Equitable Representation & Rotation',
                  content: '1. Governing principle: Fairness, inclusiveness, equity, and balanced representation among all 8 member States.\n2. Presidency shall rotate among member States (Kwara, Kogi Okun, Oyo, Osun, Ondo, Ogun, Lagos, Ekiti).\n3. House maintains official record of presidential rotation order.',
                  displayOrder: 1,
                },
                {
                  sectionNumber: 'Section 4-8',
                  title: 'Nomination & Distribution Rules',
                  content: '1. Concerned State Association nominates candidate when presidency rotates to their state.\n2. If state fails to present candidate within deadline, 7-day extension granted, after which presidency rotates to next state.\n3. No single State shall hold an excessive concentration of principal offices at the same time.',
                  displayOrder: 2,
                },
              ],
            },
          },
          {
            articleNumber: 13,
            title: 'Patrons, Patronesses and Cultural Institutions',
            slug: 'article-13-patrons-and-cultural-institutions',
            overview: 'Appointment of Patrons, Grand Patron, and ceremonial traditional titles (Oba, Oloris).',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1-3',
                  title: 'Patrons and Patronesses',
                  content: '1. Advisers, mentors and supporters of proven integrity. At least one must be FUD staff member.\n2. One designated Grand Patron. Appointed by EXCO and confirmed by House.',
                  displayOrder: 1,
                },
                {
                  sectionNumber: 'Section 4-8',
                  title: 'Cultural Institutions & Traditional Titles',
                  content: '1. Ceremonial cultural titles: Oba, Bashorun, Bobagunwa, Afobaje, Otun, Osi, Iyalode, Olori I, Olori II.\n2. Purely honorary and cultural; politically neutral; tenure of 1 academic session.',
                  displayOrder: 2,
                },
              ],
            },
          },
          {
            articleNumber: 14,
            title: 'Discipline, Offences and Penalties',
            slug: 'article-14-discipline-offences-penalties',
            overview: 'Classifies offences (Minor, Serious, Gross), online conduct, disciplinary procedure, and sanctions.',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1-5',
                  title: 'Classification of Offences',
                  content: 'Offences classified as:\na. Minor Misconduct: Disrupting meetings, offensive language, failure to comply with lawful directives.\nb. Serious Misconduct: Repeated minor misconduct, deliberate constitutional violation, unauthorized use of Union name, dissemination of false information.\nc. Gross Misconduct: Financial misconduct, fraud, forgery, bribery, abuse of office, physical assault, acts causing severe disunity.',
                  displayOrder: 1,
                },
                {
                  sectionNumber: 'Section 5A-12',
                  title: 'Online Conduct, Sanctions & Protection',
                  content: '1. Responsible conduct on official digital platforms. Cyberbullying, hate speech, impersonation prohibited.\n2. Sanctions: Verbal/written warnings, public apology, restitution, suspension from office/activities, removal, disqualification.\n3. Accused entitled to fair hearing, reasonable time for defence, and protection against victimization.',
                  displayOrder: 2,
                },
              ],
            },
          },
          {
            articleNumber: 15,
            title: 'Constitutional Amendment, Oaths, Citation and Commencement',
            slug: 'article-15-amendments-transitional-oaths-citation',
            overview: 'Amendment procedures, 2/3 majority ratification, Oaths of Allegiance/Office, citation, and commencement.',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1-3',
                  title: 'Amendment Procedure & Transitional Provisions',
                  content: '1. Proposals originate from EXCO, House, CRC, or petition by 1/3 of registered members.\n2. Requires 2/3 majority in House and 2/3 ratification by Congress.\n3. Existing lawful actions, regulations, and offices continue until reconstituted.',
                  displayOrder: 1,
                },
                {
                  sectionNumber: 'Section 4-7',
                  title: 'Oaths, Citation & Commencement',
                  content: '1. Officers must subscribe to Schedule I (Oath of Allegiance) and Schedule II (Oath of Office).\n2. Cited as: "The Unification Constitution of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter."\n3. Effective immediately upon adoption by Congress and University approval.',
                  displayOrder: 2,
                },
              ],
            },
          },
          {
            articleNumber: 16,
            title: 'Vacancy, Removal, Resignation and Succession',
            slug: 'article-16-vacancy-removal-succession',
            overview: 'Grounds for vacancy, resignation procedures, removal process, and presidential succession line.',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1-4',
                  title: 'Vacancy, Resignation & Presidential Succession',
                  content: '1. Office becomes vacant upon resignation, death, removal, loss of studentship, or permanent incapacity.\n2. If President office is vacant, Vice President assumes office immediately. If both vacant, Speaker serves as Acting President for up to 30 days.',
                  displayOrder: 1,
                },
              ],
            },
          },
          {
            articleNumber: 17,
            title: 'Interpretation',
            slug: 'article-17-interpretation',
            overview: 'Defines constitutional terms: Union, Congress, House, EXCO, CRC, NECO, Member, Officer, State Association.',
            sections: {
              create: [
                {
                  sectionNumber: 'Section 1-3',
                  title: 'Interpretation & Supremacy of Interpretation',
                  content: '1. Key terms defined: Union = YOSU FUD Chapter; Congress = General Assembly; EXCO = Executive arm; House = Legislative arm; CRC = Compliance Committee.\n2. Masculine gender includes feminine and vice versa; singular includes plural.\n3. CRC issues advisory interpretations subject to House supervisory authority.',
                  displayOrder: 1,
                },
              ],
            },
          },
        ],
      },
      amendments: {
        create: [
          {
            proposedBy: 'House of Representatives (2025/2026 Session)',
            dateProposed: new Date('2026-06-15'),
            dateRatified: new Date('2026-07-10'),
            amendmentSummary: 'Name Harmonization & Unification Amendment',
            fullText: 'Replaced former name "National Association of Kwara, Kogi (Okun), Oyo, Osun, Ondo, Ogun, Lagos and Ekiti State Students (NAKOLES)" with "Yoruba Students\' Union (YOSU), Federal University Dutse Chapter" across all constitutional provisions.',
          },
        ],
      },
    },
  });

  console.log(`✅ Fully Seeded Complete 17-Article YOSU Constitution Version (ID: ${constitution.id})!`);
}

main()
  .catch((e) => {
    console.error('❌ Error during full constitution seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
