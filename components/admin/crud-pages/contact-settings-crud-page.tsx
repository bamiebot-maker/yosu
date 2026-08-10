'use client';

import React, { useState } from 'react';
import {
  Settings,
  Save,
  Plus,
  Trash2,
  Edit,
  Loader2,
  HelpCircle,
  Clock,
  Share2,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/admin/crud-modals/delete-confirm-modal';
import {
  updateContactSettingsAction,
  createFaqItemAction,
  updateFaqItemAction,
  deleteFaqItemAction,
} from '@/app/admin/actions';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isPublished: boolean;
}

export function ContactSettingsCrudPage({
  settings,
  faqs,
}: {
  settings: Record<string, string>;
  faqs: FaqItem[];
}) {
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);

  // FAQ Modal / Form State
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isFaqFormOpen, setIsFaqFormOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FaqItem | null>(null);
  const [savingFaq, setSavingFaq] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMsg(null);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await updateContactSettingsAction(formData);
      if (res.success) {
        setSettingsMsg(res.message || 'Contact settings updated successfully!');
      } else {
        setSettingsMsg(`Error: ${res.error}`);
      }
    } catch (err: any) {
      setSettingsMsg(`Error: ${err.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveFaq = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingFaq(true);
    const formData = new FormData(e.currentTarget);
    try {
      if (editingFaq) {
        await updateFaqItemAction(editingFaq.id, formData);
      } else {
        await createFaqItemAction(formData);
      }
      setIsFaqFormOpen(false);
      setEditingFaq(null);
    } finally {
      setSavingFaq(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[9px] sm:text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
            SUPER ADMIN CONFIGURATION
          </span>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
            Contact Details, Socials & FAQ CMS
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage official secretariat addresses, helplines, social channels, office hours, map URLs, and FAQ items.
          </p>
        </div>
      </div>

      {settingsMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-bold ${
            settingsMsg.startsWith('Error')
              ? 'bg-rose-100 text-rose-800 border border-rose-200'
              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
          }`}
        >
          {settingsMsg}
        </div>
      )}

      {/* SECTION 1: CONTACT SETTINGS FORM */}
      <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h2 className="font-serif font-bold text-xl text-slate-900">Secretariat Information & Channels</h2>
            <p className="text-xs text-slate-500">Edit office details displayed on the public contact page.</p>
          </div>
          <button
            type="submit"
            disabled={savingSettings}
            className="px-6 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
          >
            {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-amber-400" />}
            <span>{savingSettings ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>

        {/* Intro Banner Settings */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Page Title & Subtitle</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold block mb-1">Intro Title</label>
              <input
                type="text"
                name="contact_intro_title"
                defaultValue={settings.contact_intro_title || 'Official Communication & Enquiry Portal'}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Intro Subtitle</label>
              <input
                type="text"
                name="contact_intro_subtitle"
                defaultValue={settings.contact_intro_subtitle || 'Connect directly with the Executive Council, Secretariat, or House of Representatives.'}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Addresses & Emails */}
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Address & Emails</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold block mb-1">Office Address</label>
              <input
                type="text"
                name="contact_address"
                defaultValue={settings.contact_address || 'Yoruba Students\' Union (YOSU) Secretariat, Federal University Dutse, PMB 7156, Dutse, Jigawa State, Nigeria'}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1">Official General Email</label>
                <input
                  type="email"
                  name="contact_email"
                  defaultValue={settings.contact_email || 'info@yosufud.org.ng'}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Support Email</label>
                <input
                  type="email"
                  name="contact_support_email"
                  defaultValue={settings.contact_support_email || 'support@yosufud.org.ng'}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Phone Numbers & WhatsApp */}
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Telephone & WhatsApp</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold block mb-1">Main Helpline Phone</label>
              <input
                type="text"
                name="contact_phone"
                defaultValue={settings.contact_phone || '+234 803 123 4567'}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Alternative Phone</label>
              <input
                type="text"
                name="contact_phone_alt"
                defaultValue={settings.contact_phone_alt || '+234 812 987 6543'}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Official WhatsApp Hotline</label>
              <input
                type="text"
                name="contact_whatsapp"
                defaultValue={settings.contact_whatsapp || '+234 803 123 4567'}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Office Hours */}
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Office Working Hours</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold block mb-1">Monday – Friday</label>
              <input
                type="text"
                name="office_hours_weekday"
                defaultValue={settings.office_hours_weekday || 'Monday – Friday: 8:00 AM – 5:00 PM'}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Saturday</label>
              <input
                type="text"
                name="office_hours_saturday"
                defaultValue={settings.office_hours_saturday || 'Saturday: 10:00 AM – 2:00 PM'}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Sunday</label>
              <input
                type="text"
                name="office_hours_sunday"
                defaultValue={settings.office_hours_sunday || 'Sunday: Closed (Emergency Hotline Active)'}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Public Holidays</label>
              <input
                type="text"
                name="office_hours_holidays"
                defaultValue={settings.office_hours_holidays || 'Public Holidays: Closed'}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Map URL */}
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Google Maps Location Embed</h3>
          <div>
            <label className="text-xs font-bold block mb-1">Google Maps Embed URL</label>
            <input
              type="text"
              name="contact_map_url"
              defaultValue={settings.contact_map_url || ''}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
            />
          </div>
        </div>

        {/* Social Platforms */}
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Social Media Hub URLs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold block mb-1">Facebook URL</label>
              <input
                type="text"
                name="social_facebook"
                defaultValue={settings.social_facebook || ''}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Instagram URL</label>
              <input
                type="text"
                name="social_instagram"
                defaultValue={settings.social_instagram || ''}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">X (Twitter) URL</label>
              <input
                type="text"
                name="social_twitter"
                defaultValue={settings.social_twitter || ''}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Telegram Channel URL</label>
              <input
                type="text"
                name="social_telegram"
                defaultValue={settings.social_telegram || ''}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">LinkedIn Page URL</label>
              <input
                type="text"
                name="social_linkedin"
                defaultValue={settings.social_linkedin || ''}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">YouTube Channel URL</label>
              <input
                type="text"
                name="social_youtube"
                defaultValue={settings.social_youtube || ''}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-stone-100">
          <button
            type="submit"
            disabled={savingSettings}
            className="px-6 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
          >
            {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-amber-400" />}
            <span>{savingSettings ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>

      {/* SECTION 2: FAQ ITEMS CMS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-4">
          <div>
            <h2 className="font-serif font-bold text-xl text-slate-900">FAQ Accordion Module ({faqs.length})</h2>
            <p className="text-xs text-slate-500">Manage frequently asked questions displayed on the public contact page.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingFaq(null);
              setIsFaqFormOpen(true);
            }}
            className="px-4 py-2 bg-emerald-950 text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition-colors flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add FAQ Item</span>
          </button>
        </div>

        {/* Inline Add / Edit Form */}
        {isFaqFormOpen && (
          <form onSubmit={handleSaveFaq} className="p-6 bg-stone-50 rounded-2xl border border-stone-300 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-base text-slate-900">
              {editingFaq ? 'Edit FAQ Item' : 'Add New FAQ Item'}
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold block text-slate-700">Question *</label>
              <input
                type="text"
                name="question"
                required
                defaultValue={editingFaq?.question || ''}
                placeholder="e.g. How do I register for YOSU membership?"
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold block text-slate-700">Answer *</label>
              <textarea
                name="answer"
                required
                rows={3}
                defaultValue={editingFaq?.answer || ''}
                placeholder="Detailed answer text..."
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold block text-slate-700">Category</label>
                <select
                  name="category"
                  defaultValue={editingFaq?.category || 'GENERAL'}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-bold"
                >
                  <option value="GENERAL">GENERAL</option>
                  <option value="MEMBERSHIP">MEMBERSHIP</option>
                  <option value="CONSTITUTION">CONSTITUTION</option>
                  <option value="ACADEMICS">ACADEMICS</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold block text-slate-700">Display Order</label>
                <input
                  type="number"
                  name="displayOrder"
                  defaultValue={editingFaq?.displayOrder || faqs.length + 1}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublished"
                    value="true"
                    defaultChecked={editingFaq ? editingFaq.isPublished : true}
                    className="w-4 h-4 text-emerald-800 rounded"
                  />
                  <span>Published</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setIsFaqFormOpen(false);
                  setEditingFaq(null);
                }}
                className="px-4 py-2 bg-stone-200 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingFaq}
                className="px-5 py-2 bg-emerald-950 text-white text-xs font-bold rounded-xl"
              >
                {savingFaq ? 'Saving...' : 'Save FAQ'}
              </button>
            </div>
          </form>
        )}

        {/* FAQs List */}
        <div className="space-y-3">
          {faqs.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No FAQ items created yet.</p>
          ) : (
            faqs.map((faq) => (
              <div
                key={faq.id}
                className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                      {faq.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Order: {faq.displayOrder}</span>
                    {faq.isPublished ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Published</span>
                    ) : (
                      <span className="text-[10px] bg-stone-200 text-slate-600 font-bold px-2 py-0.5 rounded">Draft</span>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-slate-900">{faq.question}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{faq.answer}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFaq(faq);
                      setIsFaqFormOpen(true);
                    }}
                    className="p-2 text-slate-600 hover:bg-stone-200 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFaqToDelete(faq)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete FAQ Modal */}
      {faqToDelete && (
        <DeleteConfirmModal
          isOpen={!!faqToDelete}
          onClose={() => setFaqToDelete(null)}
          title="Delete FAQ Item"
          itemTitle={faqToDelete.question}
          onConfirm={async () => {
            await deleteFaqItemAction(faqToDelete.id);
          }}
        />
      )}
    </div>
  );
}
