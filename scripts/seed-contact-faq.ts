import { PrismaClient, SettingGroup } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📬 Seeding default Contact Settings and FAQ Items...');

  const settingsToSeed = [
    { key: 'contact_address', value: 'Yoruba Students\' Union (YOSU) Secretariat, Federal University Dutse, PMB 7156, Dutse, Jigawa State, Nigeria', label: 'Office Address', group: SettingGroup.CONTACT },
    { key: 'contact_email', value: 'info@yosufud.org.ng', label: 'Official Email', group: SettingGroup.CONTACT },
    { key: 'contact_support_email', value: 'support@yosufud.org.ng', label: 'Support Email', group: SettingGroup.CONTACT },
    { key: 'contact_phone', value: '+234 803 123 4567', label: 'Helpline Phone', group: SettingGroup.CONTACT },
    { key: 'contact_phone_alt', value: '+234 812 987 6543', label: 'Alternative Phone', group: SettingGroup.CONTACT },
    { key: 'contact_whatsapp', value: '+234 803 123 4567', label: 'Official WhatsApp', group: SettingGroup.CONTACT },
    { key: 'social_facebook', value: 'https://facebook.com/yosufud', label: 'Facebook URL', group: SettingGroup.FOOTER },
    { key: 'social_instagram', value: 'https://instagram.com/yosu_fud', label: 'Instagram URL', group: SettingGroup.FOOTER },
    { key: 'social_twitter', value: 'https://x.com/yosufud', label: 'X (Twitter) URL', group: SettingGroup.FOOTER },
    { key: 'social_telegram', value: 'https://t.me/yosufud', label: 'Telegram Channel', group: SettingGroup.FOOTER },
    { key: 'social_linkedin', value: 'https://linkedin.com/company/yosufud', label: 'LinkedIn Page', group: SettingGroup.FOOTER },
    { key: 'social_youtube', value: 'https://youtube.com/@yosufud', label: 'YouTube Channel', group: SettingGroup.FOOTER },
    { key: 'social_website', value: 'https://yosufud.org.ng', label: 'Website URL', group: SettingGroup.FOOTER },
    { key: 'contact_map_url', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15609.434863375822!2d9.333069150000001!3d11.669862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11ae456ebdbcc169%3A0x6e9f1a0e495267a5!2sFederal%20University%20Dutse!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng', label: 'Google Maps Embed URL', group: SettingGroup.CONTACT },
    { key: 'office_hours_weekday', value: 'Monday – Friday: 8:00 AM – 5:00 PM', label: 'Weekday Office Hours', group: SettingGroup.CONTACT },
    { key: 'office_hours_saturday', value: 'Saturday: 10:00 AM – 2:00 PM', label: 'Saturday Office Hours', group: SettingGroup.CONTACT },
    { key: 'office_hours_sunday', value: 'Sunday: Closed (Emergency Hotline Active)', label: 'Sunday Office Hours', group: SettingGroup.CONTACT },
    { key: 'office_hours_holidays', value: 'Public Holidays: Closed', label: 'Public Holiday Hours', group: SettingGroup.CONTACT },
    { key: 'contact_intro_title', value: 'Official Communication & Enquiry Portal', label: 'Contact Page Intro Title', group: SettingGroup.CONTACT },
    { key: 'contact_intro_subtitle', value: 'Connect directly with the Executive Council, Secretariat, or House of Representatives.', label: 'Contact Page Intro Subtitle', group: SettingGroup.CONTACT },
  ];

  for (const item of settingsToSeed) {
    await prisma.siteSetting.upsert({
      where: { key: item.key },
      update: { value: item.value, label: item.label, group: item.group },
      create: { key: item.key, value: item.value, label: item.label, group: item.group },
    });
  }

  const faqs = [
    {
      question: 'Who can register as a member of YOSU FUD Chapter?',
      answer: 'Membership is open to all bona fide Yoruba students admitted into any undergraduate, postgraduate, or diploma programme at the Federal University Dutse.',
      category: 'MEMBERSHIP',
      displayOrder: 1,
    },
    {
      question: 'How do I obtain the official Constitution PDF Gazette?',
      answer: 'You can download the full ratified 2026 Unification Constitution PDF directly from our official online reader at /constitution or the downloads page.',
      category: 'CONSTITUTION',
      displayOrder: 2,
    },
    {
      question: 'How are constituent states represented in the House of Representatives?',
      answer: 'In accordance with Article Seven Section 2, each of the 8 Yoruba Constituent States (Kwara, Kogi, Oyo, Osun, Ondo, Ogun, Lagos, Ekiti) nominates two (2) delegates to the House.',
      category: 'CONSTITUTION',
      displayOrder: 3,
    },
    {
      question: 'What is the official procedure for submitting welfare or academic complaints?',
      answer: 'You can submit a direct message using the Contact Form on this page by selecting the "Welfare" or "Academic" category, or email support@yosufud.org.ng.',
      category: 'GENERAL',
      displayOrder: 4,
    },
    {
      question: 'How can alumni or sponsors partner with YOSU FUD Chapter?',
      answer: 'Sponsors and alumni can reach our Executive President or Financial Secretary directly through our official helpline +234 803 123 4567 or by selecting the "Sponsorship & Partnership" category in the contact form.',
      category: 'GENERAL',
      displayOrder: 5,
    },
  ];

  for (const faq of faqs) {
    const existing = await prisma.faqItem.findFirst({
      where: { question: faq.question },
    });
    if (!existing) {
      await prisma.faqItem.create({
        data: faq,
      });
    }
  }

  console.log('✅ Successfully seeded default Contact Settings and FAQ Items!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding contact settings & FAQs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
