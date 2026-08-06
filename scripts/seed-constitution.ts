import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📜 Seeding COMPLETE UNABRIDGED 17 Articles of YOSU Unification Constitution 2026 & Historical 2025 Version...');

  const currentSession = await prisma.administrationSession.findFirst({
    where: { isCurrent: true },
  });

  const pastSession = await prisma.administrationSession.findFirst({
    where: { isCurrent: false },
  });

  if (!currentSession) {
    console.error('❌ Active administration session not found.');
    process.exit(1);
  }

  // 1. ACTIVE VERSION: 2026 SUPREME UNIFICATION CONSTITUTION
  let version2026 = await prisma.constitutionVersion.findFirst({
    where: { isCurrent: true },
  });

  if (!version2026) {
    version2026 = await prisma.constitutionVersion.create({
      data: {
        versionName: '2026 Unification Constitution',
        edition: '1st Harmonized Edition',
        sessionId: currentSession.id,
        effectiveDate: new Date('2026-07-11'),
        adoptionDate: new Date('2026-07-10'),
        ratificationDate: new Date('2026-07-10'),
        isCurrent: true,
        assentDate: new Date('2026-07-11'),
        assentedBy: 'Asiwaju Abdulsalam Abdulgafar Oluwagbenga (President)',
        speakerCertBy: 'Rt. Hon. Ibrahim Sobur Bamidele (Speaker)',
        viewsCount: 284,
        downloadsCount: 76,
      },
    });
  } else {
    version2026 = await prisma.constitutionVersion.update({
      where: { id: version2026.id },
      data: {
        versionName: '2026 Unification Constitution',
        edition: '1st Harmonized Edition',
        effectiveDate: new Date('2026-07-11'),
        adoptionDate: new Date('2026-07-10'),
        ratificationDate: new Date('2026-07-10'),
        isCurrent: true,
        assentDate: new Date('2026-07-11'),
        assentedBy: 'Asiwaju Abdulsalam Abdulgafar Oluwagbenga (President)',
        speakerCertBy: 'Rt. Hon. Ibrahim Sobur Bamidele (Speaker)',
      },
    });
  }

  // 2. FORMER / ARCHIVED VERSION: 2025 PIONEER NAKOLES CONSTITUTION
  let version2025 = await prisma.constitutionVersion.findFirst({
    where: { versionName: { contains: '2025' } },
  });

  if (!version2025 && pastSession) {
    version2025 = await prisma.constitutionVersion.create({
      data: {
        versionName: '2025 Pioneer NAKOLES Constitution',
        edition: 'Pre-Unification Draft Edition',
        sessionId: pastSession.id,
        effectiveDate: new Date('2025-07-01'),
        adoptionDate: new Date('2025-06-25'),
        ratificationDate: new Date('2025-06-25'),
        isCurrent: false,
        assentedBy: 'President Asiwaju Abdulsalam Abdulgafar Oluwagbenga',
        speakerCertBy: 'Rt. Hon. Ibrahim Sobur Bamidele',
        viewsCount: 112,
        downloadsCount: 29,
      },
    });
  }

  // Clean existing articles for both versions to re-seed verbatim text
  await prisma.constitutionArticle.deleteMany({
    where: { versionId: { in: [version2026.id, ...(version2025 ? [version2025.id] : [])] } },
  });

  await prisma.constitutionAmendment.deleteMany({
    where: { versionId: { in: [version2026.id, ...(version2025 ? [version2025.id] : [])] } },
  });

  // VERBATIM UNABRIDGED DATA FOR 2026 CONSTITUTION
  const articles2026 = [
    {
      articleNumber: 1,
      title: 'NAME, SUPREMACY, STATUS, MOTTO, ADDRESS AND SYMBOLS',
      slug: 'article-1-name-supremacy-status-motto-address-symbols',
      overview: 'Preamble, Supreme Legal Binding Status, Union Name, Official Motto, Address and Symbols of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter.',
      sections: [
        { sectionNumber: '1', title: 'Supremacy of the Constitution', content: '1. This Constitution shall be the supreme law of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter, and its provisions shall be binding on all organs, officers and members of the Union.\n2. Any act, decision, regulation, policy or omission which is inconsistent with the provisions of this Constitution shall be null and void to the extent of its inconsistency.\n3. Where the implementation of any provision of this Constitution becomes temporarily impracticable due to exceptional circumstances, the Executive Council may make interim administrative regulations, subject to the approval of the House of Representatives, provided that such regulations shall not conflict with the provisions, spirit or objectives of this Constitution.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Name', content: 'The Union shall be known as the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter. The Union may also be referred to by the acronym "YOSU".', displayOrder: 2 },
        { sectionNumber: '3', title: 'Motto', content: 'The Motto of the Association shall be:\n"Ìpínlẹ̀ Ọmọ Oòduà: Ìfẹ̀ Sówapọ"\nwhich signifies unity, love, cooperation and collective progress among members.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Status and Autonomy', content: '1. The Association shall be the recognized umbrella body representing the collective interests and welfare of all bona fide Yoruba students of the Federal University Dutse.\n2. The Association shall remain autonomous in its internal affairs, subject to the regulations of the Federal University Dutse and the provisions of this Constitution.', displayOrder: 4 },
        { sectionNumber: '5', title: 'Official Address', content: 'The official address of the Union shall be:\nYoruba Students\' Union (YOSU)\nFederal University Dutse Chapter\nFederal University Dutse\nPMB 7156\nDutse, Jigawa State, Nigeria.\nThe Executive Council may maintain such correspondence address as may be approved by the House of Representatives.', displayOrder: 5 },
        { sectionNumber: '6', title: 'Official Symbols', content: '1. The Association shall possess an Official Logo.\n2. The Association may adopt an Official Anthem, Flag, Seal or any other symbol approved by the House of Representatives.\n3. The official symbols of the Association shall remain the property of "YOSU" and shall not be altered, reproduced or used for unauthorized purposes without the approval of the House of Representatives.\n4. It gives the House institutional identity without threatening the Association\'s logo, provided that such logo, seal or emblem shall not supersede the official logo of the Association.', displayOrder: 6 },
      ],
    },
    {
      articleNumber: 2,
      title: 'MEMBERSHIP',
      slug: 'article-2-membership',
      overview: 'Eligibility for membership, fundamental member rights, duties of members, and provisions governing suspension or loss of membership.',
      sections: [
        { sectionNumber: '1', title: 'Eligibility for Membership', content: '1. Membership of the Union shall be open to all bona fide Yoruba students of the Federal University Dutse.\n2. An applicant shall provide such evidence of studentship and Yoruba origin or affiliation as may be prescribed by the Union.\n3. Membership shall become effective upon registration in accordance with procedures approved by the Executive Council and ratified by the House of Representatives.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Rights of Members', content: 'Every member of the Union shall have the right to:\na. Participate in the activities and programmes of the Union;\nb. Attend meetings of the Union;\nc. Vote and be voted for, subject to the provisions of this Constitution;\nd. Enjoy welfare benefits and other privileges approved by the Union;\ne. Freedom of expression, fair hearing and equal treatment in matters affecting the Union, subject to the provisions of this Constitution.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Duties of Members', content: 'Every member shall:\na. Observe and uphold the provisions of this Constitution;\nb. Promote the unity, progress and good image of the Union;\nc. Pay dues, levies and fees duly approved in accordance with this Constitution;\nd. Participate actively in the affairs and programmes of the Union;\ne. Respect the constituted authorities of the Union.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Suspension or Loss of Membership', content: '1. A member shall not be suspended, sanctioned or expelled except in accordance with the provisions of this Constitution and after being afforded the right to fair hearing.\n2. Expulsion from the Union shall require the recommendation of the Constitutional Review and Compliance Committee (CRC) and the approval of the House of Representatives.', displayOrder: 4 },
      ],
    },
    {
      articleNumber: 3,
      title: 'AIM AND OBJECTIVES',
      slug: 'article-3-aim-and-objectives',
      overview: 'Strategic aim and comprehensive statutory objectives of the Union.',
      sections: [
        { sectionNumber: '1', title: 'Aim', content: 'The Union shall promote unity, welfare, cultural identity, academic excellence, leadership development and collective progress among Yoruba students of the Federal University Dutse.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Objectives', content: 'The objectives of the Union shall be to:\na. Promote unity, cooperation and mutual understanding among Yoruba students within the University;\nb. Protect and advance the welfare, interests and legitimate aspirations of members;\nc. Encourage academic excellence, intellectual development and educational advancement among members;\nd. Foster peaceful coexistence and cordial relations between the Union, the University authorities, the Students\' Union Government and other recognized bodies;\ne. Preserve, promote and celebrate the cultural heritage, values and traditions of the Yoruba people;\nf. Organize educational, cultural, intellectual, social and recreational programmes for the benefit of members;\ng. Encourage leadership development, innovation, entrepreneurship and self-reliance among members;\nh. Promote discipline, integrity, responsibility and good conduct in accordance with the regulations of the University and the provisions of this Constitution;\ni. Provide a platform for advocacy, representation and constructive engagement on matters affecting members;\nj. Encourage community development, volunteerism and service to humanity;\nk. Promote inclusiveness, mutual respect and non-discrimination among members;\nl. Undertake such lawful activities as may be necessary for the attainment of the aims and objectives of the Union;\nm. Uphold constitutionalism, accountability, transparency and democratic governance within the Union;\nn. Establish and maintain cordial relationships with Yoruba student associations, cultural organizations and other lawful bodies within and outside the University in furtherance of the objectives of the Union.', displayOrder: 2 },
      ],
    },
    {
      articleNumber: 4,
      title: 'ORGANS OF THE ASSOCIATION',
      slug: 'article-4-organs-of-the-association',
      overview: 'Primary governing organs and independent constitutional bodies of the Union.',
      sections: [
        { sectionNumber: '1', title: 'Organs of the Union', content: 'The Union shall consist of the following organs:\na. Congress;\nb. Executive Council;\nc. House of Representatives.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Independent Constitutional Bodies', content: 'The following bodies shall be established as independent constitutional bodies of the Union:\na. Constitutional Review and Compliance Committee (CRC);\nb. Nomination and Screening Committee (NSC).', displayOrder: 2 },
        { sectionNumber: '3', title: 'Supremacy of Constitutional Organs and Bodies', content: 'All organs and constitutional bodies established under this Constitution shall exercise their powers and perform their functions in accordance with, and subject to, the provisions of this Constitution.', displayOrder: 3 },
      ],
    },
    {
      articleNumber: 5,
      title: 'THE EXECUTIVE COUNCIL',
      slug: 'article-5-the-executive-council',
      overview: 'Establishment, 17-member composition, qualification for office, tenure, oath, vacancy, succession, and collective responsibility of EXCO.',
      sections: [
        { sectionNumber: '1', title: 'Establishment', content: 'There shall be an Executive Council which shall be responsible for the day-to-day administration and management of the affairs of the Union.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Composition', content: 'The Executive Council shall consist of:\n1. President\n2. Vice President\n3. Secretary General\n4. Assistant Secretary General\n5. Financial Secretary\n6. Treasurer\n7. Auditor General\n8. Director of Membership Affairs\n9. Director of Education and Academic Affairs\n10. Director of Cultural Affairs\n11. Public Relations Officer\n12. Assistant Public Relations Officer\n13. Social Director\n14. Welfare Director\n15. Assistant Welfare Director\n16. Sports Director\n17. Disciplinary Officer', displayOrder: 2 },
        { sectionNumber: '3', title: 'Qualification for Office', content: 'A person shall be qualified to be nominated for any Executive Office if he or she:\na. Is a bona fide member of the Union;\nb. Is a registered student of the Federal University Dutse;\nc. Is of good character and conduct;\nd. Has not been found guilty of gross misconduct by any competent disciplinary body within the preceding academic session;\ne. Meets the academic requirements prescribed by the University and the Nomination and Screening Committee;\nf. Has fulfilled all financial obligations owed to the Union.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Tenure of Office', content: 'Members of the Executive Council shall hold office for a term of one academic session.\nAn Executive Officer shall remain in office until a successor is duly nominated, screened, sworn in and assumes office in accordance with this Constitution.', displayOrder: 4 },
        { sectionNumber: '5', title: 'Oath of Office', content: 'No Executive Officer shall assume office unless he or she has subscribed to the prescribed Oath of Allegiance and Oath of Office contained in this Constitution.', displayOrder: 5 },
        { sectionNumber: '6', title: 'Vacancy in Office', content: 'An Executive Office shall become vacant where the holder:\na. Resigns in writing;\nb. Ceases to be a student of the University;\nc. Is removed from office in accordance with this Constitution;\nd. Is declared incapable of performing the functions of the office;\ne. Dies.', displayOrder: 6 },
        { sectionNumber: '7', title: 'Succession', content: '1. Where the office of President becomes vacant, the Vice President shall assume office as President for the remainder of the tenure.\n2. Where any other Executive Office becomes vacant, the Executive Council shall nominate a replacement subject to the approval of the House of Representatives.\n3. Any person appointed to fill a vacancy shall serve for the remainder of the unexpired term.', displayOrder: 7 },
        { sectionNumber: '8', title: 'Collective Responsibility', content: 'Members of the Executive Council shall be collectively responsible for the administration of the Union and shall be accountable to the House of Representatives and the general membership of the Union.', displayOrder: 8 },
        { sectionNumber: '9', title: 'Code of Conduct', content: 'Every Executive Officer shall perform his or her duties with integrity, accountability, transparency and loyalty to the Union, and shall avoid any conduct capable of bringing the Union into disrepute.', displayOrder: 9 },
      ],
    },
    {
      articleNumber: 6,
      title: 'POWERS AND FUNCTIONS OF EXECUTIVE OFFICERS',
      slug: 'article-6-powers-and-functions-of-executive-officers',
      overview: 'Detailed statutory duties and powers assigned to all 17 Executive Officers.',
      sections: [
        { sectionNumber: '1', title: 'President', content: 'The President shall:\na. Be the Chief Executive Officer and official spokesperson of the Union;\nb. Provide leadership and strategic direction for the Union;\nc. Preside over meetings of the Executive Council and Congress;\nd. Coordinate and supervise the activities of all Organs;\ne. Ensure the implementation of the Constitution, resolutions, policies and programmes of the Union;\nf. Present an Annual Report of the activities of the Union to the House of Representatives and Congress;\ng. Serve as a signatory to the Union\'s bank account in accordance with this Constitution;\nh. Appoint advisers, committees and other officers as authorized by this Constitution or approved by the House of Representatives;\ni. Present the proposed Annual Budget of the Union to the House of Representatives through the Financial Secretary;\nj. Perform such other lawful functions as may be necessary for the effective administration of the Union.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Vice President', content: 'The Vice President shall:\na. Assist the President in the discharge of his or her duties;\nb. Act for the President during the President\'s absence;\nc. Coordinate assignments delegated by the President;\nd. Succeed the President in accordance with this Constitution.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Secretary General', content: 'The Secretary General shall:\na. Be the Chief Administrative Officer of the Union;\nb. Keep accurate records and minutes of meetings;\nc. Issue notices of meetings;\nd. Maintain official correspondence;\ne. Keep custody of all official records and documents of the Union;\nf. Prepare meeting agendas in consultation with the President;\ng. Perform such administrative duties as may be required for the efficient administration of the Union.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Assistant Secretary General', content: 'The Assistant Secretary General shall:\na. Assist the Secretary General;\nb. Act in the absence of the Secretary General;\nc. Perform duties assigned by the Secretary General or Executive Council.', displayOrder: 4 },
        { sectionNumber: '5', title: 'Financial Secretary', content: 'The Financial Secretary shall:\na. Maintain accurate financial records;\nb. Receive and account for all monies due to the Union;\nc. Prepare financial statements and reports;\nd. Serve as a signatory to the Union\'s bank account;\ne. Present financial reports as required;\nf. Produce financial records whenever required for audit.', displayOrder: 5 },
        { sectionNumber: '6', title: 'Treasurer', content: 'The Treasurer shall:\na. Safeguard all monies belonging to the Union;\nb. Ensure prompt banking of funds;\nc. Serve as a signatory to the Union\'s bank account;\nd. Maintain custody records of all funds received;\ne. Present financial reports whenever required.', displayOrder: 6 },
        { sectionNumber: '7', title: 'Auditor General', content: 'The Auditor General shall:\na. Audit the financial records of the Union at least once every semester;\nb. Submit audit reports to the House of Representatives and Congress;\nc. Conduct special audits where necessary;\nd. Recommend measures to improve financial accountability and transparency.', displayOrder: 7 },
        { sectionNumber: '8', title: 'Director of Membership Affairs', content: 'The Director of Membership Affairs shall:\na. Coordinate membership registration and documentation;\nb. Maintain an up-to-date membership database;\nc. Organize orientation programmes for new members;\nd. Promote active participation of members in the affairs of the Union.', displayOrder: 8 },
        { sectionNumber: '9', title: 'Director of Education and Academic Affairs', content: 'The Director of Education and Academic Affairs shall:\na. Promote academic excellence and intellectual development among members;\nb. Develop and coordinate educational programmes, seminars, tutorials and workshops of the Union;\nc. Liaise with the University authorities and relevant stakeholders on academic matters affecting members;\nd. Promote scholarships, mentorship, research, career development and academic opportunities for members;\ne. Advise the Executive Council on educational policies and programmes;\nf. Perform such other educational functions as may be assigned under this Constitution.', displayOrder: 9 },
        { sectionNumber: '10', title: 'Director of Cultural Affairs', content: 'The Director of Cultural Affairs shall:\na. Promote Yoruba culture, heritage and values;\nb. Organize cultural programmes and festivals;\nc. Coordinate traditional institutions recognized by the Union;\nd. Promote cultural education among members.', displayOrder: 10 },
        { sectionNumber: '11', title: 'Public Relations Officer', content: 'The Public Relations Officer shall:\na. Manage the public image of the Union;\nb. Publicize the activities and programmes of the Union;\nc. Serve as Chairperson of the Publicity and Media Committee;\nd. Coordinate official publications and media engagements.', displayOrder: 11 },
        { sectionNumber: '12', title: 'Assistant Public Relations Officer', content: 'The Assistant Public Relations Officer shall:\na. Assist the Public Relations Officer;\nb. Act in the absence of the Public Relations Officer.', displayOrder: 12 },
        { sectionNumber: '13', title: 'Social Director', content: 'The Social Director shall:\na. Organize social programmes and events;\nb. Coordinate social activities approved by the Union;\nc. Maintain social assets belonging to the Union.', displayOrder: 13 },
        { sectionNumber: '14', title: 'Welfare Director', content: 'The Welfare Director shall:\na. Promote the welfare of members;\nb. Coordinate welfare programmes;\nc. Receive welfare complaints and recommendations;\nd. Recommend welfare policies to the Executive Council.', displayOrder: 14 },
        { sectionNumber: '15', title: 'Assistant Welfare Director', content: 'The Assistant Welfare Director shall:\na. Assist the Welfare Director;\nb. Act in the absence of the Welfare Director.', displayOrder: 15 },
        { sectionNumber: '16', title: 'Sports Director', content: 'The Sports Director shall:\na. Organize sporting competitions and recreational activities;\nb. Promote participation in sports among members;\nc. Maintain sports equipment belonging to the Union.', displayOrder: 16 },
        { sectionNumber: '17', title: 'Disciplinary Officer', content: 'The Disciplinary Officer shall:\na. Maintain discipline during meetings and official activities of the Union;\nb. Assist the Constitutional Review and Compliance Committee (CRC) in enforcing disciplinary decisions where necessary;\nc. Monitor compliance with this Constitution and regulations of the Union;\nd. Perform such lawful disciplinary duties as may be assigned under this Constitution.', displayOrder: 17 },
      ],
    },
    {
      articleNumber: 7,
      title: 'HOUSE OF REPRESENTATIVES',
      slug: 'article-7-house-of-representatives',
      overview: 'Establishment, 8 constituent state composition (2 delegates per state), principal officers, legislative functions, powers to summon, sittings, quorum, and impeachment.',
      sections: [
        { sectionNumber: '1', title: 'Establishment', content: '1. There shall be a legislative arm of the Union known as the House of Representatives (hereinafter referred to as "the House").\n2. The House shall be the legislative and oversight arm of the Union.\n3. The House shall exercise such powers and perform such functions as are conferred upon it by this Constitution.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Composition', content: '1. The House of Representatives shall consist of representatives from each Constituent State of the Union.\n2. Each Constituent State shall be entitled to two (2) representatives in the House of Representatives.\n3. Representatives shall be duly nominated by their respective Constituent States and shall be persons of integrity, good character, sound judgment and demonstrated commitment to the welfare and progress of the Union.\n4. A representative shall cease to hold office where he or she:\na. Resigns in writing;\nb. Ceases to be a member of the Union;\nc. Is removed in accordance with this Constitution;\nd. Is duly recalled by the Constituent State he or she represents;\ne. Ceases to hold office by virtue of which he or she became a representative.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Constitution and Principal Officers of the House', content: '1. Each Constituent State shall nominate two (2) representatives to the House of Representatives not later than fourteen (14) days after the inauguration of a new Executive Council.\n2. The names of nominated representatives shall be submitted to the Secretary General of the Union and published to members.\n3. The House shall hold its inaugural sitting not later than seven (7) days after the completion of nominations.\n4. At its inaugural sitting, the House shall elect from among its members:\na. Speaker;\nb. Deputy Speaker;\nc. Clerk of the House;\nd. Chief Whip.\n5. The election of the Principal Officers shall be by a simple majority of members present and voting.\n6. The tenure of members and Principal Officers of the House shall run concurrently with that of the Executive Council unless otherwise provided by this Constitution.\n7. Where a Constituent State fails to nominate its representatives within the prescribed period, the House may commence its functions, provided that such failure shall not invalidate the constitution or proceedings of the House.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Functions and Powers of the House', content: 'The House shall:\na. Make rules, resolutions and regulations for the good governance of the Union;\nb. Consider and approve policies and programmes of the Executive Council where approval is required under this Constitution;\nc. Exercise oversight over the activities of the Executive Council and all organs of the Union;\nd. Receive, consider and deliberate upon reports submitted by officers and organs of the Union;\ne. Approve the Annual Budget and any Supplementary Budget;\nf. Approve any major expenditure exceeding an amount prescribed by the House from time to time;\ng. Consider and recommend appointments where recommendation is required under this Constitution;\nh. Approve the appointment of members of the Constitutional Review and Compliance Committee (CRC);\ni. Approve the appointment of members of the Nomination and Screening Committee (NSC);\nj. Approve the creation, merger, restructuring or abolition of offices, departments, committees or organs of the Union where such action affects the structure of the Union;\nk. Investigate matters affecting the welfare, finances or administration of the Union;\nl. Consider and approve constitutional amendments in accordance with this Constitution;\nm. Represent and protect the interests of members and Constituent States of the Union;\nn. Establish Standing Committees for the effective discharge of its legislative and oversight functions;\no. Perform such other legislative and oversight functions as may be necessary for the effective administration of the Union.', displayOrder: 4 },
        { sectionNumber: '5', title: 'Power to Summon', content: '1. The House may invite or summon any officer of the Union to provide information, clarification or explanation on matters relating to the affairs of the Union.\n2. Any officer summoned by the House shall attend and cooperate with the proceedings unless prevented by a reasonable cause.', displayOrder: 5 },
        { sectionNumber: '6', title: 'Sittings of the House', content: '1. The House shall sit at least twice every semester.\n2. The Speaker shall preside over sittings of the House and, in his or her absence, the Deputy Speaker shall preside.\n3. Notice of sittings shall be communicated to members within a reasonable time before the sitting.\n4. The House may hold regular, special, emergency, physical, virtual or hybrid sittings.', displayOrder: 6 },
        { sectionNumber: '7', title: 'Quorum', content: 'The quorum for a meeting of the House shall be one-third (1/3) of the total membership of the House.', displayOrder: 7 },
        { sectionNumber: '8', title: 'Resolutions and Decisions', content: '1. Except where otherwise provided by this Constitution, decisions of the House shall be made by a simple majority of members present and voting.\n2. In the event of a tie, the presiding officer shall exercise a casting vote.', displayOrder: 8 },
        { sectionNumber: '9', title: 'Removal of Principal Officers', content: 'A Principal Officer of the House may be removed by a resolution supported by not less than two-thirds (2/3) of the members of the House on the grounds of misconduct, incompetence, abuse of office or violation of this Constitution.', displayOrder: 9 },
      ],
    },
    {
      articleNumber: 8,
      title: 'CONSTITUTIONAL REVIEW AND COMPLIANCE COMMITTEE (CRC)',
      slug: 'article-8-constitutional-review-and-compliance-committee',
      overview: 'Establishment, 5-member composition, tenure, statutory functions, powers of investigation, fair hearing, and appeal process of the CRC.',
      sections: [
        { sectionNumber: '1', title: 'Establishment', content: '1. There shall be a Constitutional Review and Compliance Committee (CRC) of the Union.\n2. The CRC shall be an independent constitutional body responsible for constitutional compliance, disciplinary matters, dispute resolution and constitutional review.\n3. In the discharge of its functions, the CRC shall be impartial, independent and guided solely by the provisions of this Constitution and the principles of natural justice.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Composition', content: '1. The CRC shall consist of five (5) members.\n2. Members of the CRC shall be nominated by the Executive Council and confirmed by the House of Representatives.\n3. Members shall be persons of proven integrity, impartiality and good character.\n4. No serving Executive Officer or member of the House of Representatives shall be eligible for appointment into the CRC.\n5. The CRC shall elect from among its members:\na. Chairperson;\nb. Secretary.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Tenure', content: '1. Members of the CRC shall hold office for one (1) academic session.\n2. A member may be reappointed for one additional term only.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Functions', content: 'The CRC shall:\na. Interpret the provisions of this Constitution upon request by any organ of the Union;\nb. Resolve constitutional and administrative disputes arising within the Union;\nc. Investigate allegations of misconduct against members and officers;\nd. Ensure compliance with the provisions of this Constitution;\ne. Conduct constitutional review exercises as may be directed by Congress or the House of Representatives;\nf. Receive and determine petitions submitted by members;\ng. Recommend disciplinary measures where necessary;\nh. Promote constitutional awareness among members;\ni. Advise the Executive Council, House of Representatives and Congress on constitutional matters whenever necessary.', displayOrder: 4 },
        { sectionNumber: '5', title: 'Powers of Investigation', content: '1. The CRC may invite any member, officer or organ of the Union in the course of an investigation.\n2. The CRC may require the production of documents, records or information relevant to any matter under investigation.\n3. All organs and officers of the Union shall cooperate with the CRC in the discharge of its constitutional responsibilities.', displayOrder: 5 },
        { sectionNumber: '6', title: 'Fair Hearing', content: '1. No member or officer shall be sanctioned without adequate notice of the allegation against him or her.\n2. Every person accused of misconduct shall have the right to be heard and to present evidence in his or her defence.\n3. The CRC shall ensure that its proceedings are conducted fairly, impartially and without bias.', displayOrder: 6 },
        { sectionNumber: '7', title: 'Recommendations and Decisions', content: '1. The CRC shall submit its findings and recommendations to the House of Representatives.\n2. Recommendations involving suspension, removal from office or other major sanctions shall take effect only upon approval by the House of Representatives where such approval is required under this Constitution.\n3. Decisions of the CRC on matters not requiring legislative approval shall be binding on the parties.', displayOrder: 7 },
        { sectionNumber: '8', title: 'Constitutional Review', content: '1. The CRC shall periodically review the operation of this Constitution and recommend amendments where necessary.\n2. The CRC shall submit constitutional review reports and recommendations to the House of Representatives for consideration before presentation to Congress.', displayOrder: 8 },
        { sectionNumber: '9', title: 'Removal of Members', content: 'A member of the CRC may be removed by a resolution supported by two-thirds (2/3) of the members of the House of Representatives on the grounds of misconduct, incompetence, bias, conflict of interest or violation of this Constitution.', displayOrder: 9 },
        { sectionNumber: '10', title: 'Conflict of Interest', content: '1. A member of the CRC shall not participate in the hearing or determination of any matter in which he or she has a personal interest.\n2. Where a conflict of interest exists, the affected member shall recuse himself or herself from the proceedings.\n3. Failure to disclose a conflict of interest shall constitute misconduct.', displayOrder: 10 },
        { sectionNumber: '11', title: 'Appeal', content: '1. Any member or officer dissatisfied with a decision of the CRC may appeal to the House of Representatives within seven (7) days of the decision.\n2. The House of Representatives shall determine the appeal after giving all parties an opportunity to be heard.\n3. The decision of the House of Representatives shall be final.', displayOrder: 11 },
      ],
    },
    {
      articleNumber: 9,
      title: 'NOMINATION AND SCREENING COMMITTEE (NSC)',
      slug: 'article-9-nomination-and-screening-committee',
      overview: 'Electoral and screening committee governing candidate eligibility, transition timetables, unopposed nominations, and handovers.',
      sections: [
        { sectionNumber: '1', title: 'Establishment', content: '1. There shall be a Nomination and Screening Committee of the Union, hereinafter referred to as the Nomination and Screening Committee (NSC).\n2. The Committee shall be responsible for the nomination, screening, verification and recommendation of nominees for Executive offices under this Constitution.\n3. In the discharge of its functions, the Committee shall be independent, impartial and accountable only to this Constitution.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Composition', content: '1. The Committee shall consist of five (5) members.\n2. Members of the Nomination and Screening Committee shall be nominated by the House of Representatives from among qualified members of the Union who are not serving Executive Officers or members of the House of Representatives, and shall be confirmed by Congress.\n3. No member of the Committee shall:\na. Be nominated for any Executive office during the process under consideration;\nb. Act as sponsor or representative of any nominee;\nc. Hold any Executive office during the tenure of the Committee.\n4. The Committee shall elect from among its members:\na. Chairperson;\nb. Secretary.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Tenure', content: '1. Members of the Committee shall hold office from the date of confirmation until the conclusion of the nomination, screening and confirmation process and submission of their final report.\n2. The Committee shall stand dissolved immediately after the Transition and Handover Ceremony unless otherwise resolved by Congress.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Functions', content: 'The Committee shall:\na. Publish nomination guidelines and timetable;\nb. Receive nominations from eligible Constituent States;\nc. Verify the credentials and qualifications of nominees;\nd. Conduct screening exercises;\ne. Investigate complaints relating to nominations;\nf. Determine the eligibility of nominees in accordance with this Constitution;\ng. Publish the list of qualified nominees;\nh. Submit its report and recommendations to Congress through the House of Representatives;\ni. Perform such other functions as may be necessary for the conduct of a credible nomination and screening process.', displayOrder: 4 },
        { sectionNumber: '5', title: 'Nomination Timetable', content: '1. The Committee shall be constituted not later than six (6) weeks before the expiration of the tenure of the Executive Council.\n2. The Committee shall publish the nomination timetable not later than four (4) weeks before the screening exercise.\n3. The timetable shall include:\na. Opening of nominations;\nb. Submission of nomination forms;\nc. Verification of credentials;\nd. Screening of nominees;\ne. Publication of qualified nominees;\nf. Hearing of complaints and appeals;\ng. Presentation of qualified nominees to Congress.', displayOrder: 5 },
        { sectionNumber: '6', title: 'Qualification for Nomination', content: 'A nominee shall:\na. Be a bona fide member of the Union;\nb. Be a registered student of the Federal University Dutse;\nc. Have fulfilled all financial obligations owed to the Union;\nd. Be of proven good character and integrity;\ne. Not have been found guilty of gross misconduct within the preceding academic session;\nf. Meet all academic requirements prescribed by the University;\ng. Satisfy all other lawful requirements prescribed by this Constitution.', displayOrder: 6 },
        { sectionNumber: '7', title: 'Disqualification', content: 'A person shall not be qualified for nomination if he or she:\na. Has been removed from office for misconduct within the preceding academic session;\nb. Is serving a disciplinary sanction imposed under this Constitution;\nc. Knowingly provides false information during the nomination process;\nd. Fails to satisfy the constitutional requirements for the office sought.', displayOrder: 7 },
        { sectionNumber: '8', title: 'Review of Disqualification', content: '1. Any nominee dissatisfied with a decision of the Committee concerning qualification or disqualification may petition the Constitutional Review and Compliance Committee (CRC) within forty-eight (48) hours of the publication of the decision.\n2. The CRC shall determine the petition within seventy-two (72) hours.\n3. The decision of the CRC shall be final.', displayOrder: 8 },
        { sectionNumber: '9', title: 'Presentation and Confirmation of Nominees', content: '1. Upon completion of the nomination and screening process, the Nomination and Screening Committee shall publish the list of qualified nominees not later than seven (7) days before the Transition and Handover Ceremony.\n2. During the Transition and Handover Ceremony, the Chairperson of the Committee shall present the qualified nominees to Congress.\n3. Congress shall consider the report of the Committee and confirm the nominees by a simple majority of members present and voting.\n4. Where any nominee is rejected by Congress, the concerned Constituent State shall submit a replacement nominee within a period prescribed by the Committee.', displayOrder: 9 },
        { sectionNumber: '10', title: 'Unopposed Nomination', content: 'Where only one qualified nominee is presented for an office, such nominee shall be deemed duly nominated upon confirmation by Congress.', displayOrder: 10 },
        { sectionNumber: '11', title: 'Transition, Handover and Inauguration', content: '1. Upon confirmation by Congress, the outgoing Executive Council shall formally hand over the affairs, records, assets and responsibilities of the Union to the incoming Executive Council during a Transition and Handover Ceremony.\n2. Immediately after the handover, the incoming Executive Council shall subscribe to the Oath of Allegiance and Oath of Office and shall be formally inaugurated in accordance with this Constitution.', displayOrder: 11 },
      ],
    },
    {
      articleNumber: 10,
      title: 'FINANCE',
      slug: 'article-10-finance',
      overview: 'Financial year, revenue sources, budget submission, banking signatories, expenditure controls, emergency expenditure, procurement, audit, and misconduct sanctions.',
      sections: [
        { sectionNumber: '1', title: 'Financial Year', content: 'The financial year of the Union shall correspond with the academic session of the Federal University Dutse unless otherwise determined by the House of Representatives.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Sources of Revenue', content: 'The funds of the Union shall be derived from:\na. Membership registration fees;\nb. Annual dues approved by Congress;\nc. Levies approved in accordance with this Constitution;\nd. Donations, grants and gifts from lawful sources;\ne. Fundraising activities approved by the House of Representatives;\nf. Proceeds from investments and lawful business ventures of the Union;\ng. Income generated from programmes, projects and activities of the Union;\nh. Sponsorships and partnerships approved by the House of Representatives;\ni. Any other lawful source approved by the House of Representatives.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Budget', content: '1. The Executive Council shall prepare and submit an Annual Budget to the House of Representatives for consideration and approval.\n2. No expenditure shall be incurred unless provided for in an approved budget except in emergency situations as provided under this Constitution.\n3. Supplementary budgets may be submitted where additional expenditure becomes necessary.\n4. A supplementary budget shall require approval of the House of Representatives before implementation.\n5. The approved Annual Budget shall be presented to Congress for information and transparency.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Banking Operations', content: '1. The Union shall maintain one or more accounts with a duly recognized financial institution.\n2. The approved signatories to the Union\'s account shall be:\na. President;\nb. Financial Secretary;\nc. Treasurer.\n3. Any two (2) of the authorized signatories shall jointly authorize transactions.\n4. No officer shall operate a private account for the purpose of receiving, keeping or disbursing Union funds.\n5. No withdrawal or transfer of funds shall be made except through the official financial account(s) of the Union.', displayOrder: 4 },
        { sectionNumber: '5', title: 'Collection and Custody of Funds', content: '1. All monies received on behalf of the Union shall be properly receipted and recorded.\n2. Funds received shall be paid into the Union\'s account within a reasonable time.\n3. No officer shall retain Union funds in personal custody beyond the period reasonably required for banking purposes.', displayOrder: 5 },
        { sectionNumber: '6', title: 'Expenditure and Financial Controls', content: '1. All expenditures shall be supported by appropriate documentation, receipts, invoices or payment vouchers.\n2. Any expenditure exceeding ten percent (10%) of the Union\'s approved annual budget, or such amount as may be prescribed by the House of Representatives, shall require prior approval of the House.\n3. No payment shall be made without proper authorization.\n4. The Executive Council shall ensure prudent, transparent and accountable management of Union funds.', displayOrder: 6 },
        { sectionNumber: '6A', title: 'Emergency Expenditure', content: '1. Where urgent expenditure becomes necessary to prevent substantial harm to the interests of the Union, the Executive Council may authorize such expenditure.\n2. Any expenditure made under this Section shall be reported to the House of Representatives within seven (7) days.\n3. The House of Representatives may ratify or reject the expenditure after considering the circumstances.', displayOrder: 7 },
        { sectionNumber: '6B', title: 'Procurement and Contracts', content: '1. No contract, procurement or financial commitment shall be entered into on behalf of the Union except in accordance with procedures approved by the House of Representatives.\n2. Where practicable, competitive quotations shall be obtained for major expenditures.', displayOrder: 8 },
        { sectionNumber: '7', title: 'Financial Reporting', content: '1. The Financial Secretary shall prepare periodic financial reports.\n2. A comprehensive financial report shall be presented to Congress at least once every semester.\n3. At the expiration of every tenure, the outgoing Executive Council shall submit a complete financial statement and handover report.', displayOrder: 9 },
        { sectionNumber: '8', title: 'Audit', content: '1. The Auditor General shall audit the financial records of the Union at least once every semester.\n2. The Auditor General may conduct special audits where circumstances require.\n3. Audit reports shall be submitted to the House of Representatives and Congress.\n4. All officers shall make financial records available for audit upon request.\n5. The Auditor General shall act independently in the discharge of his or her duties and shall not be subject to the direction or control of any officer in the preparation of audit reports.', displayOrder: 10 },
        { sectionNumber: '9', title: 'Assets and Property', content: '1. All assets and property acquired by the Union shall remain the property of the Union.\n2. An inventory of all Union assets shall be maintained and updated regularly.\n3. No officer shall dispose of, transfer or alienate Union property without the authorization of the House of Representatives.\n4. The Treasurer shall maintain an Asset Register containing all movable and immovable property of the Union.', displayOrder: 11 },
        { sectionNumber: '10', title: 'Financial Misconduct', content: 'The following shall constitute financial misconduct:\na. Misappropriation of funds;\nb. Embezzlement;\nc. Unauthorized expenditure;\nd. Diversion of Union funds;\ne. Falsification of financial records;\nf. Concealment of financial information;\ng. Unauthorized disposal of Union assets;\nh. Failure to account for Union funds entrusted to an officer.', displayOrder: 12 },
        { sectionNumber: '11', title: 'Sanctions for Financial Misconduct', content: '1. Any officer or member found guilty of financial misconduct shall:\na. Refund the amount or value involved;\nb. Be subject to disciplinary measures under this Constitution;\nc. Be removed from office where applicable;\nd. Be disqualified from holding any elective, nominated or appointive office for a period determined by the House of Representatives upon the recommendation of the Constitutional Review and Compliance Committee (CRC).\n2. The sanctions provided under this Constitution shall not prevent the Union from reporting criminal conduct to the appropriate authorities where necessary.', displayOrder: 13 },
        { sectionNumber: '12', title: 'Handover of Financial Records', content: '1. Outgoing financial officers shall hand over all financial records, assets, account details and relevant documents to their successors within fourteen (14) days of leaving office.\n2. Failure to comply with this Section shall constitute misconduct.\n3. Any officer who fails to hand over records within the prescribed period shall be liable to disciplinary proceedings before the Constitutional Review and Compliance Committee (CRC).', displayOrder: 14 },
      ],
    },
    {
      articleNumber: 11,
      title: 'MEETINGS',
      slug: 'article-11-meetings',
      overview: 'Classification of Union meetings, Congress powers, EXCO meetings, House sittings, emergency meetings, quorums, physical, virtual and hybrid sittings.',
      sections: [
        { sectionNumber: '1', title: 'Types of Meetings', content: 'The Union shall conduct the following meetings:\na. Congress Meetings;\nb. Executive Council Meetings;\nc. House of Representatives Sittings;\nd. Committee Meetings;\ne. Emergency Meetings; and\nf. Any other meeting authorized under this Constitution.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Congress Meetings', content: '1. Congress shall be the general meeting of members of the Union.\n2. Congress shall be the supreme deliberative organ of the Union and shall exercise such powers as are conferred upon it by this Constitution.\n3. Congress shall be held at least twice every semester.\n4. Congress shall consider reports, policies, budgets, constitutional amendments and any other matter affecting the Union.\n5. Congress may issue resolutions binding on all organs of the Union, provided such resolutions are not inconsistent with this Constitution.\n6. Any meeting convened for constitutional amendment shall require not less than fourteen (14) days\' notice.', displayOrder: 2 },
        { sectionNumber: '2A', title: 'Powers of Congress', content: 'Congress shall:\na. Receive reports from all organs and officers of the Union;\nb. Ratify constitutional amendments in accordance with this Constitution;\nc. Debate matters affecting the welfare, interests and development of members;\nd. Ratify appointments or decisions requiring the approval of the general membership under this Constitution;\ne. Pass resolutions on matters affecting the Union; and\nf. Exercise such other powers as are expressly conferred upon it by this Constitution.', displayOrder: 3 },
        { sectionNumber: '3', title: 'Executive Council Meetings', content: '1. The Executive Council shall meet at least twice every month.\n2. Attendance at Executive Council meetings shall be compulsory for all Executive Officers except where a reasonable excuse has been communicated.\n3. The President may convene Executive Council meetings whenever necessary.\n4. Decisions of the Executive Council shall be subject to this Constitution and the oversight of the House of Representatives.', displayOrder: 4 },
        { sectionNumber: '4', title: 'Sittings of the House of Representatives', content: '1. The House of Representatives shall hold at least two (2) regular sittings in every semester.\n2. The Speaker shall preside over the sittings of the House and, in the absence of the Speaker, the Deputy Speaker shall preside.\n3. The House may hold regular, special or emergency sittings as circumstances may require.\n4. The Clerk of the House shall issue notice of every sitting in accordance with the Standing Orders of the House.\n5. An official minute of the sitting must be published within 48hrs of the sitting by the clerk of the House.', displayOrder: 5 },
        { sectionNumber: '5', title: 'Committee Meetings', content: '1. Committees established under this Constitution may meet as often as necessary for the discharge of their functions.\n2. Each Committee shall regulate its proceedings subject to this Constitution.', displayOrder: 6 },
        { sectionNumber: '6', title: 'Emergency Meetings', content: '1. An Emergency Meeting may be convened where urgent matters affecting the Union require immediate consideration.\n2. Emergency Meetings may be convened by:\na. The President;\nb. A resolution of the Executive Council;\nc. The Speaker upon a resolution of the House of Representatives; or\nd. A written request signed by not less than one-third (1/3) of registered members.\n3. Business conducted at an Emergency Meeting shall be limited to the matters for which the meeting was convened.', displayOrder: 7 },
        { sectionNumber: '7', title: 'Notice of Meetings', content: '1. Reasonable notice shall be given before any meeting of the Union.\n2. Notice may be communicated through physical, electronic or any other officially recognized means.\n3. Failure of a member to receive notice shall not invalidate proceedings where reasonable efforts were made to notify members.', displayOrder: 8 },
        { sectionNumber: '8', title: 'Quorum', content: 'a. The quorum for Congress shall be one-third (1/3) of the registered members of the Union.\nb. The quorum for Executive Council meetings shall be one-half (1/2) of the members of the Executive Council.\nc. The quorum for meetings of the House of Representatives shall be one-third (1/3) of the total membership of the House.\nd. Where quorum is not formed within a reasonable time, the meeting shall be adjourned and reconvened in accordance with procedures prescribed by the relevant organ.', displayOrder: 9 },
        { sectionNumber: '9', title: 'Voting and Decisions', content: '1. Except where otherwise provided by this Constitution, decisions shall be made by a simple majority of members present and voting.\n2. Voting may be conducted by voice vote, show of hands, secret ballot, electronic voting or any other method approved by the presiding officer.\n3. In the event of a tie, the presiding officer shall exercise a casting vote.', displayOrder: 10 },
        { sectionNumber: '9A', title: 'Conflict of Interest', content: '1. Any member who has a direct personal or financial interest in any matter before a meeting shall disclose such interest before deliberations commence.\n2. The presiding officer may require such member to abstain from deliberation or voting where the interest is capable of affecting impartial decision-making.', displayOrder: 11 },
        { sectionNumber: '10', title: 'Conduct of Meetings', content: '1. Meetings of the Union shall be conducted in an orderly, respectful and democratic manner.\n2. Every member shall have the right to be heard in accordance with the rules governing the meeting.\n3. No member shall engage in disorderly conduct, violence, intimidation or disruptive behaviour during meetings.\n4. The presiding officer shall ensure fairness, decorum and compliance with this Constitution.', displayOrder: 12 },
        { sectionNumber: '11', title: 'Physical, Virtual and Hybrid Meetings', content: '1. Meetings of the Union may be conducted physically, virtually or through a hybrid format.\n2. Participation through approved electronic platforms shall constitute valid attendance.\n3. Decisions taken during virtual or hybrid meetings shall have the same force and effect as those taken during physical meetings.', displayOrder: 13 },
        { sectionNumber: '12', title: 'Minutes and Records', content: '1. Accurate minutes shall be kept for every meeting of the Union.\n2. Minutes shall form part of the official records of the Union.\n3. Minutes shall be made available to the relevant organ of the Union upon request.', displayOrder: 14 },
        { sectionNumber: '12A', title: 'Attendance', content: '1. Members of the Executive Council, House of Representatives and Committees shall attend meetings regularly.\n2. Persistent absence from meetings without reasonable excuse shall constitute misconduct and may attract sanctions under this Constitution.', displayOrder: 15 },
        { sectionNumber: '13', title: 'Rules of Procedure', content: 'Subject to the provisions of this Constitution, each organ of the Union may adopt rules of procedure for the conduct of its meetings and proceedings.', displayOrder: 16 },
      ],
    },
    {
      articleNumber: 12,
      title: 'LEADERSHIP ROTATION AND EQUITABLE REPRESENTATION',
      slug: 'article-12-leadership-rotation-and-equitable-representation',
      overview: 'Constitutional doctrine of presidential rotation among the 8 constituent states, order of rotation, and equitable office distribution.',
      sections: [
        { sectionNumber: '1', title: 'Principle of Equitable Representation', content: '1. The Union shall be governed in accordance with the principles of fairness, inclusiveness, equity and balanced representation among all member States.\n2. No member State shall dominate the leadership of the Union to the exclusion of others.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Rotation of the Presidency', content: '1. The office of the President shall rotate among the member States of the Union.\n2. In implementing the principle of rotation, priority shall be given to States that have not previously occupied the office of President.\n3. A State that has recently produced the President shall not be eligible to present a nominee for the office until every other eligible State has had a reasonable opportunity to occupy the office.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Order of Rotation', content: '1. The House of Representatives shall maintain an official record of the order in which member States occupy the office of President.\n2. The order of rotation shall be determined having regard to equity, fairness and the historical occupancy of the office.\n3. Any dispute regarding the order of rotation shall be referred to the Constitutional Review and Compliance Committee (CRC), whose recommendation shall be subject to the approval of Congress.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Nomination of Candidates', content: '1. Where the office of President is due to a particular State under the rotation arrangement, the concerned State Association shall nominate a qualified candidate in accordance with this Constitution.\n2. The nomination shall be submitted to the Electoral Committee within the prescribed period for screening and verification.\n3. Only nominees who satisfy the constitutional requirements shall be presented to the House of Representatives for confirmation.', displayOrder: 4 },
        { sectionNumber: '5', title: 'Failure to Present a Qualified Nominee', content: '1. Where a State Association fails to present a qualified nominee within the prescribed period:\na. The Electoral Committee shall notify the concerned State Association;\nb. The State Association shall be granted an additional period of seven (7) days to submit a qualified nominee; and\nc. Where the State Association still fails to present a qualified nominee, the House of Representatives shall, with the approval of Congress, authorize the office to rotate to the next eligible State.', displayOrder: 5 },
        { sectionNumber: '6', title: 'Equitable Distribution of Offices', content: '1. In constituting the Executive Council, reasonable efforts shall be made to ensure equitable representation of all member States.\n2. No single State shall hold an excessive concentration of principal offices at the same time.', displayOrder: 6 },
        { sectionNumber: '7', title: 'Interpretation', content: 'For the purposes of this Article, "member States" means Kwara, Kogi (Okun), Oyo, Osun, Ondo, Ogun, Lagos and Ekiti States represented within the Union.', displayOrder: 7 },
        { sectionNumber: '8', title: 'Review of Rotation Arrangement', content: '1. The implementation of the rotation principle may be reviewed where necessary to promote fairness, equity and effective administration of the Union.\n2. No review of the rotation arrangement shall take effect unless approved by Congress.', displayOrder: 8 },
      ],
    },
    {
      articleNumber: 13,
      title: 'PATRONS, PATRONESSES AND CULTURAL INSTITUTIONS',
      slug: 'article-13-patrons-patronesses-and-cultural-institutions',
      overview: 'Role of patrons and patronesses, establishment of ceremonial traditional title court (Oba, Bashorun, Bobagunwa, Otun, Iyalode, Olori), and cultural preservation.',
      sections: [
        { sectionNumber: '1', title: 'Patrons and Patronesses', content: '1. The Union shall have Patrons and Patronesses who shall serve as advisers, mentors and supporters of the Union.\n2. Patrons and Patronesses shall be persons of proven integrity, good character and commitment to the objectives of the Union.\n3. At least one Patron or Patroness shall be a member of staff of the Federal University Dutse.\n4. The Union may designate one Patron as the Grand Patron.\n5. Patrons and Patronesses shall not interfere with the day-to-day administration of the Union.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Functions of Patrons and Patronesses', content: 'The Patrons and Patronesses shall:\na. Provide guidance and advisory support to the Union;\nb. Promote the welfare and development of members;\nc. Assist in conflict resolution where necessary;\nd. Support the Union in achieving its aims and objectives; and\ne. Represent the interests of the Union when called upon.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Appointment of Patrons and Patronesses', content: '1. Patrons and Patronesses shall be appointed by the Executive Council and confirmed by the House of Representatives.\n2. Their appointments may be reviewed or withdrawn where their conduct becomes inconsistent with the objectives or best interests of the Union.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Cultural Institutions', content: '1. The Union recognizes and shall preserve the cultural heritage of the Yoruba people through the establishment of cultural institutions and the conferment of traditional titles.\n2. Such cultural institutions shall be ceremonial and cultural in nature and shall not exercise executive, legislative, judicial or disciplinary powers under this Constitution.', displayOrder: 4 },
        { sectionNumber: '5', title: 'Traditional Titles', content: 'The Union may maintain the following traditional titles:\na. Oba;\nb. Bashorun;\nc. Bobagunwa;\nd. Afobaje;\ne. Otun;\nf. Osi;\ng. Iyalode;\nh. Olori I;\ni. Olori II; and\nj. Any other traditional title approved by Congress.', displayOrder: 5 },
        { sectionNumber: '6', title: 'Functions of Traditional Title Holders', content: 'Traditional title holders shall:\na. Promote Yoruba culture, language and values;\nb. Participate in cultural programmes and ceremonies of the Union;\nc. Promote unity, peace and cultural education among members under the supervision of the president;\nd. Serve as cultural ambassadors of the Union; and\ne. Perform such ceremonial functions as may be assigned in accordance with this Constitution.', displayOrder: 6 },
        { sectionNumber: '7', title: 'Appointment of Traditional Title Holders', content: '1. Traditional title holders shall be appointed annually in accordance with guidelines approved by the House of Representatives.\n2. The Executive Council shall receive nominations for traditional titles and forward the names of qualified nominees to the House of Representatives for confirmation.\n3. The House of Representatives shall confirm the nominees by a simple majority of members present and voting.\n4. Confirmed traditional title holders shall be formally installed during the Annual Transition Ceremony together with the inauguration of the newly confirmed Executive Council.\n5. The tenure of every traditional title holder shall be one (1) academic session and shall expire upon the installation of successors.', displayOrder: 7 },
        { sectionNumber: '8', title: 'Non-Political Nature of Traditional Titles', content: '1. Traditional title holders shall remain politically neutral in all nomination, screening, confirmation and leadership selection processes of the Union.\n2. No traditional title shall confer any automatic entitlement to elective or appointive office under this Constitution.\n3. The conferment of traditional titles shall be purely honorary and cultural and shall not vest the holder with executive, legislative or disciplinary authority within the Union.', displayOrder: 8 },
      ],
    },
    {
      articleNumber: 14,
      title: 'DISCIPLINE, OFFENCES AND PENALTIES',
      slug: 'article-14-discipline-offences-and-penalties',
      overview: 'Classification of offences (Minor, Serious, Gross Misconduct), online platform regulations, disciplinary proceedings, sanctions, and appeal procedures.',
      sections: [
        { sectionNumber: '1', title: 'General Principles', content: '1. Every member and officer of the Union shall conduct himself or herself in a manner that promotes the objectives, reputation and integrity of the Union.\n2. No member shall engage in any act capable of bringing the Union into disrepute.\n3. Disciplinary proceedings shall be conducted fairly, impartially and in accordance with the principles of natural justice.\n4. No disciplinary measure shall be imposed except in accordance with this Constitution.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Classification of Offences', content: 'Offences under this Constitution shall be classified as:\na. Minor Misconduct;\nb. Serious Misconduct;\nc. Gross Misconduct.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Minor Misconduct', content: 'The following shall constitute Minor Misconduct:\na. Disruption of meetings;\nb. Use of abusive or offensive language during official activities;\nc. Failure to comply with lawful directives of the Union;\nd. Conduct likely to undermine the orderly administration of the Union.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Serious Misconduct', content: 'The following shall constitute Serious Misconduct:\na. Repeated acts of Minor Misconduct;\nb. Deliberate violation of any provision of this Constitution;\nc. Unauthorized use of the Union\'s name or property;\nd. Publication or dissemination of false information concerning the Union;\ne. Conduct likely to create disunity among members.', displayOrder: 4 },
        { sectionNumber: '5', title: 'Gross Misconduct', content: 'The following shall constitute Gross Misconduct:\na. Financial misconduct;\nb. Fraud, forgery or falsification of records;\nc. Embezzlement or misappropriation of Union funds or property;\nd. Manipulation, bribery, intimidation or fraudulent conduct during any nomination, screening or leadership selection process established under this Constitution;\ne. Abuse of office;\nf. Bribery or corruption;\ng. Physical assault during Union activities;\nh. Any act capable of seriously damaging the reputation, unity or stability of the Union.', displayOrder: 5 },
        { sectionNumber: '5A', title: 'Online Conduct', content: '1. Members shall maintain responsible conduct on all official digital platforms of the Union.\n2. Cyberbullying, harassment, dissemination of false information, hate speech and impersonation on official Union platforms shall constitute misconduct.\n3. The Union may regulate its official online platforms through guidelines consistent with this Constitution.', displayOrder: 6 },
        { sectionNumber: '6', title: 'Disciplinary Procedure', content: '1. Any complaint against a member or officer shall be submitted to the Constitutional Review and Compliance Committee (CRC).\n2. The CRC shall investigate the complaint and give all affected parties adequate opportunity to be heard.\n3. No disciplinary sanction shall be imposed without fair hearing.\n4. The CRC may dismiss frivolous, vexatious or malicious complaints.', displayOrder: 7 },
        { sectionNumber: '6A', title: 'Burden and Standard of Proof', content: '1. A person alleging misconduct shall bear the burden of proving the allegation.\n2. The Constitutional Review and Compliance Committee (CRC) shall determine disciplinary matters based on credible evidence and the balance of probabilities.\n3. No member or officer shall be presumed guilty until the allegation has been fairly investigated and determined.', displayOrder: 8 },
        { sectionNumber: '7', title: 'Sanctions', content: 'Where a member or officer is found liable for misconduct, one or more of the following sanctions may be imposed:\na. Verbal warning;\nb. Written warning;\nc. Public or private apology;\nd. Restitution or refund where applicable;\ne. Suspension from specified activities;\nf. Suspension from office;\ng. Removal from office;\nh. Disqualification from being nominated for or holding any office of the Union for a specified period;\ni. Any other lawful sanction consistent with this Constitution.', displayOrder: 9 },
        { sectionNumber: '8', title: 'Factors in Determining Sanctions', content: 'In determining the appropriate sanction, consideration shall be given to:\na. The nature and gravity of the offence;\nb. Whether the offence was repeated;\nc. The impact of the offence on the Union and its members;\nd. Any mitigating or aggravating circumstances;\ne. The conduct of the accused during the proceedings.', displayOrder: 10 },
        { sectionNumber: '9', title: 'Rights of an Accused Person', content: 'Any person accused of misconduct shall have the right to:\na. Be informed of the allegation against him or her;\nb. Be given adequate time to prepare a defence;\nc. Present evidence and witnesses;\nd. Question evidence presented against him or her;\ne. Receive a reasoned written decision.', displayOrder: 11 },
        { sectionNumber: '10', title: 'Appeal', content: '1. Any person dissatisfied with the decision of the CRC may appeal to the House of Representatives within seven (7) days of the decision.\n2. The House shall determine the appeal within fourteen (14) days.\n3. The decision of the House of Representatives shall be final.', displayOrder: 12 },
        { sectionNumber: '11', title: 'Protection Against Victimization', content: '1. No member shall be subjected to disciplinary proceedings solely because of criticism made in good faith.\n2. No officer or organ of the Union shall use disciplinary proceedings as an instrument of harassment, intimidation, retaliation or political persecution.', displayOrder: 13 },
        { sectionNumber: '12', title: 'Limitation', content: '1. Disciplinary proceedings shall be commenced within a reasonable time after the occurrence or discovery of the alleged misconduct.\n2. Where delay is unreasonable and prejudicial to the accused, the CRC may dismiss the complaint unless sufficient justification is shown.', displayOrder: 14 },
      ],
    },
    {
      articleNumber: 15,
      title: 'CONSTITUTIONAL AMENDMENT, TRANSITIONAL PROVISIONS, OATHS, CITATION AND COMMENCEMENT',
      slug: 'article-15-amendment-transitional-provisions-oaths-citation-commencement',
      overview: 'Amendment procedures, notice, periodic review, transitional provisions, Oaths of Allegiance & Office, citation, and official commencement.',
      sections: [
        { sectionNumber: '1', title: 'Amendment of the Constitution', content: '1. This Constitution may be amended only in accordance with the provisions of this Article.\n2. A proposal for amendment may originate from:\na. The Executive Council;\nb. The House of Representatives;\nc. The Constitutional Review and Compliance Committee (CRC);\nd. A written petition supported by not less than one-third (1/3) of the registered members of the Union.\n3. Every proposal for amendment shall be submitted to the House of Representatives for consideration.\n4. The House of Representatives shall deliberate on the proposed amendment and may approve it by a two-thirds (2/3) majority of members present and voting.\n5. A constitutional amendment approved by the House shall be presented to Congress for ratification.\n6. Ratification shall require the support of not less than two-thirds (2/3) of members present and voting at a duly constituted Congress.\n7. No amendment shall take effect unless it complies with this Article.', displayOrder: 1 },
        { sectionNumber: '1A', title: 'Notice of Constitutional Amendment', content: '1. Notice of every proposed constitutional amendment shall be circulated to members not less than fourteen (14) days before the Congress at which the amendment is to be considered.\n2. The proposed amendment shall be accompanied by an Explanatory Memorandum stating the purpose, objectives and effect of the proposed amendment.', displayOrder: 2 },
        { sectionNumber: '2', title: 'Periodic Constitutional Review', content: '1. This Constitution shall be reviewed whenever the need arises.\n2. The Constitutional Review and Compliance Committee (CRC) may recommend amendments aimed at improving the governance, accountability and effectiveness of the Union.\n3. Constitutional review shall be conducted through transparent consultation with members and relevant stakeholders.', displayOrder: 3 },
        { sectionNumber: '3', title: 'Transitional Provisions', content: '1. Upon the coming into force of this Constitution, all offices, committees, institutions and structures established under any previous Constitution shall continue to exist until reconstituted or replaced in accordance with this Constitution.\n2. Any action lawfully taken under a previous Constitution shall remain valid unless inconsistent with this Constitution.\n3. Existing regulations, resolutions and policies shall remain in force to the extent that they are not inconsistent with this Constitution.\n4. Any dispute arising during the transition period shall be resolved in accordance with this Constitution.', displayOrder: 4 },
        { sectionNumber: '4', title: 'Oath of Allegiance', content: 'Every officer nominated, screened, confirmed or appointed under this Constitution shall, before assuming office, subscribe to the Oath of Allegiance prescribed in Schedule 1 to this Constitution.', displayOrder: 5 },
        { sectionNumber: '5', title: 'Oath of Office', content: 'Every officer nominated, screened, confirmed or appointed under this Constitution shall, before performing the functions of office, subscribe to the Oath of Office prescribed in Schedule 2 to this Constitution.', displayOrder: 6 },
        { sectionNumber: '6', title: 'Citation', content: 'This Constitution shall be cited as:\n"The Unification Constitution of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter."', displayOrder: 7 },
        { sectionNumber: '7', title: 'Commencement', content: 'This Constitution shall come into force immediately upon its adoption by Congress and approval by the appropriate authority of the University where such approval is required.', displayOrder: 8 },
      ],
    },
    {
      articleNumber: 16,
      title: 'VACANCY, REMOVAL, RESIGNATION AND SUCCESSION',
      slug: 'article-16-vacancy-removal-resignation-and-succession',
      overview: 'Grounds for vacancy, resignation procedure, removal proceedings, presidential succession, and compulsory asset handover.',
      sections: [
        { sectionNumber: '1', title: 'Vacancy in Office', content: 'An office shall become vacant where the holder:\na. Resigns;\nb. Dies;\nc. Is removed from office in accordance with this Constitution;\nd. Ceases to be a bona fide student of the Federal University Dutse;\ne. Becomes permanently incapable of performing the functions of office;\nf. Is absent from the affairs of the Union without reasonable justification for a prolonged period as may be determined by the House of Representatives.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Resignation', content: '1. Any officer may resign from office by submitting a written letter of resignation to the Secretary General or, where applicable, to the Speaker of the House of Representatives.\n2. The resignation shall take effect upon acknowledgment by the appropriate authority or on such later date as may be stated in the letter of resignation.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Removal from Office', content: '1. Any nominated, confirmed or appointed officer may be removed from office for:\na. Gross misconduct;\nb. Abuse of office;\nc. Financial misconduct;\nd. Persistent violation of this Constitution;\ne. Gross incompetence;\nf. Conduct capable of bringing the Union into disrepute.\n2. Allegations shall first be investigated by the Constitutional Review and Compliance Committee (CRC).\n3. The affected officer shall be afforded fair hearing.\n4. Removal from office shall require the approval of two-thirds (2/3) of the members of the House of Representatives.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Vacancy in the Office of President', content: '1. Where the office of President becomes vacant by reason of death, resignation, removal, incapacity or any other cause, the Vice President shall immediately assume office as President for the remainder of the tenure.\n2. Where both the offices of President and Vice President become vacant simultaneously, the Speaker of the House of Representatives shall serve as Acting President pending the nomination, screening and confirmation of replacements in accordance with this Constitution.\n3. The Acting President shall not hold office for more than thirty (30) days except where Congress approves an extension for good cause.', displayOrder: 4 },
        { sectionNumber: '5', title: 'Vacancy in Other Offices', content: '1. Where any other Executive Office becomes vacant, the Executive Council shall nominate a qualified replacement.\n2. Such nomination shall be subject to screening where applicable and confirmation by the House of Representatives.\n3. The replacement shall serve for the remainder of the unexpired tenure.', displayOrder: 5 },
        { sectionNumber: '6', title: 'Temporary Absence', content: 'Where an officer is temporarily unable to perform the functions of office, the appropriate deputy, assistant or designated officer shall perform the functions of that office until the substantive officer resumes duty.', displayOrder: 6 },
        { sectionNumber: '7', title: 'Handover', content: '1. Every officer leaving office shall hand over all documents, records, assets, passwords, official correspondence and other property relating to the office to the successor or appropriate authority within fourteen (14) days.\n2. Failure to comply with this Section shall constitute misconduct and may attract disciplinary action under this Constitution.', displayOrder: 7 },
      ],
    },
    {
      articleNumber: 17,
      title: 'INTERPRETATION AND RATIFICATION SCHEDULES',
      slug: 'article-17-interpretation-schedules-assent-certificates',
      overview: 'Definitive legal terms, gender & number rules, Schedules I & II (Oaths), Presidential Assent, Speaker Certificate, Officer Acknowledgement, and House Ratification.',
      sections: [
        { sectionNumber: '1', title: 'Interpretation', content: 'In this Constitution, unless the context otherwise requires:\n"Union" means the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter.\n"Congress" means the General Assembly of all duly registered members of the Union and shall be the supreme organ of the Union.\n"House of Representatives" means the legislative arm of the Union established under this Constitution.\n"Executive Council" or "EXCO" means the executive arm of the Union consisting of officers nominated, screened, confirmed and sworn into office in accordance with this Constitution.\n"Constitutional Review and Compliance Committee (CRC)" or "CRC" means the independent constitutional body established under this Constitution to oversee constitutional compliance, disciplinary matters, dispute resolution and constitutional review.\n"Electoral Committee" or "NECO" means the independent committee established under this Constitution to conduct nomination, screening, verification and leadership selection processes of the Union.\n"Member" means any person duly registered as a member of the Union in accordance with this Constitution.\n"Officer" means any person nominated, screened, confirmed or appointed into an office recognized under this Constitution.\n"State Association" means the recognized body representing Yoruba students from a particular Yoruba-speaking State within the Union.\n"Nominee" means a person duly presented by a State Association for consideration for any office established under this Constitution.\n"Transitioning Day" means the official day designated by the Union for the presentation, confirmation and inauguration of newly nominated Executive Officers, the appointment of Patrons, Patronesses, the Oba and other traditional title holders, and such other constitutional activities as may be prescribed.\n"Session" means an academic session recognized by the Federal University Dutse.\n"Semester" means an academic semester recognized by the Federal University Dutse.\n"Quorum" means the minimum number of members required to validly conduct business under this Constitution.\n"Simple Majority" means more than one-half of the votes cast by members present and voting.\n"Two-Thirds Majority" means not less than two-thirds (2/3) of the votes cast by members present and voting.\n"Gross Misconduct" includes serious violation of this Constitution, abuse of office, financial misconduct, corruption, fraud, manipulation of nomination or screening processes, or any act capable of bringing the Union into disrepute.\n"University" means the Federal University Dutse.\n"Constitution" means the Constitution of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter.', displayOrder: 1 },
        { sectionNumber: '2', title: 'Gender and Number', content: '1. Words importing the masculine gender shall include the feminine gender and vice versa.\n2. Words in the singular shall include the plural and words in the plural shall include the singular where the context so admits.', displayOrder: 2 },
        { sectionNumber: '3', title: 'Supremacy of Interpretation', content: '1. Where any question arises concerning the interpretation of this Constitution, the interpretation most consistent with the objectives, spirit and provisions of this Constitution shall prevail.\n2. The Constitutional Review and Compliance Committee (CRC) may issue advisory interpretations of this Constitution, subject to the supervisory authority of the House of Representatives where applicable.', displayOrder: 3 },
        { sectionNumber: '4', title: 'Schedule 1: Oath of Allegiance', content: 'OATH OF ALLEGIANCE\nI, [FULL NAME], do solemnly swear (or affirm) that I will be faithful and bear true allegiance to the Yoruba Students\' Union (YOSU); that I will preserve, protect and defend its Constitution and always act in the best interest of the Association.\nSo help me God.', displayOrder: 4 },
        { sectionNumber: '5', title: 'Schedule 2: Oath of Office', content: 'OATH OF OFFICE\nI, [FULL NAME], having been elected/appointed as [OFFICE TITLE] of the Yoruba Students\' Union (YOSU), do solemnly swear (or affirm) that I will faithfully discharge my duties to the best of my ability; that I will uphold and defend the Constitution of the Association; that I will act honestly, fairly and in the interest of all members; and that I will not allow my personal interest to influence my official decisions.\nSo help me God.', displayOrder: 5 },
        { sectionNumber: '6', title: 'Presidential Assent', content: 'PRESIDENTIAL ASSENT\nI, Asiwaju Abdulsalam Abdulgafar Oluwagbenga, President of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter, having carefully considered the provisions of this Constitution as reviewed by the Constitutional Review Committee, harmonized by the House of Representatives following the official approval of the Union\'s change of name from NAKOLES to YOSU, and duly adopted and ratified by the House of Representatives at its Physical Sitting held on Friday, 10 July, 2026, do hereby give my Presidential Assent to this Constitution.\nBy this assent, this Constitution is hereby approved as the supreme governing document of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter.\nDate: 11 July, 2026', displayOrder: 6 },
        { sectionNumber: '7', title: 'Speaker\'s Certificate', content: 'SPEAKER\'S CERTIFICATE\nI, Rt. Hon. Ibrahim Sobur Bamidele, Speaker of the House of Representatives of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter, hereby certify that this Constitution was duly considered, debated, reviewed clause by clause, and unanimously adopted and ratified by the House of Representatives at its duly constituted Physical Sitting held on Friday, 10 July, 2026.\nDate: 11 July, 2026', displayOrder: 7 },
      ],
    },
  ];

  for (const artData of articles2026) {
    const article = await prisma.constitutionArticle.create({
      data: {
        versionId: version2026.id,
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

  // POPULATE FORMER 2025 CONSTITUTION ARTICLES IF VERSION CREATED
  if (version2025) {
    const articles2025 = [
      {
        articleNumber: 1,
        title: 'NAME, MOTTO AND SUPREMACY (2025 PIONEER DRAFT)',
        slug: 'article-1-2025-pioneer-name-motto',
        overview: 'Pre-Unification name (NAKOLES FUD) and original governing provisions prior to official institutional name change approval.',
        sections: [
          { sectionNumber: '1', title: 'Name of the Association', content: 'The Association shall be known as the National Association of Kwara, Kogi (Okun), Oyo, Osun, Ondo, Ogun, Lagos and Ekiti State Students (NAKOLES), Federal University Dutse Chapter.', displayOrder: 1 },
          { sectionNumber: '2', title: 'Supremacy', content: 'This Pioneer Constitution shall guide the administration of NAKOLES FUD Chapter subject to approval by the University Students\' Affairs Division.', displayOrder: 2 },
        ],
      },
      {
        articleNumber: 2,
        title: 'MEMBERSHIP & STATE ASSOCIATIONS (2025 DRAFT)',
        slug: 'article-2-2025-pioneer-membership',
        overview: 'Former state association delegate provisions.',
        sections: [
          { sectionNumber: '1', title: 'Membership Eligibility', content: 'Membership open to indigenous students from Kwara, Kogi, Oyo, Osun, Ondo, Ogun, Lagos and Ekiti states enrolled at Federal University Dutse.', displayOrder: 1 },
        ],
      },
    ];

    for (const artData of articles2025) {
      const article = await prisma.constitutionArticle.create({
        data: {
          versionId: version2025.id,
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
  }

  // 3. Seed Constitutional Amendments History
  await prisma.constitutionAmendment.createMany({
    data: [
      {
        versionId: version2026.id,
        proposedBy: 'Executive Council & House of Representatives',
        dateProposed: new Date('2026-06-15'),
        dateRatified: new Date('2026-07-10'),
        amendmentSummary: 'Historic Institutional Approval & Name Change from NAKOLES to Yoruba Students\' Union (YOSU)',
        fullText: 'Official approval granted by the Federal University Dutse Students\' Affairs Division changing the Association name from NAKOLES to YOSU. Harmonized across all constitutional articles.',
      },
      {
        versionId: version2026.id,
        proposedBy: 'Constitutional Review Committee (CRC)',
        dateProposed: new Date('2026-06-20'),
        dateRatified: new Date('2026-07-10'),
        amendmentSummary: 'Equal 8 Constituent States Legislative Representation Framework',
        fullText: 'Codified Article Seven Section 2 establishing two (2) Honourable Representatives per state across all 8 Yoruba Constituent States (Kwara, Kogi, Oyo, Osun, Ondo, Ogun, Lagos, Ekiti).',
      },
    ],
  });

  console.log('✅ Successfully seeded ALL UNABRIDGED 17 Articles of YOSU Unification Constitution 2026 & Historical 2025 Version!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding constitution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
