'use client';

import React, { useState } from 'react';
import { Building2, Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { saveDepartmentsConfigAction } from '@/app/admin/actions';

interface DepartmentsCrudPageProps {
  initialConfig: Record<string, string[]>;
}

export function DepartmentsCrudPage({ initialConfig }: DepartmentsCrudPageProps) {
  const [config, setConfig] = useState<Record<string, string[]>>(initialConfig || {});
  const [newFacultyName, setNewFacultyName] = useState('');
  const [newDeptMap, setNewDeptMap] = useState<Record<string, string>>({});

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFacultyName.trim();
    if (!trimmed) return;
    if (config[trimmed]) {
      setToastMessage({ type: 'error', text: 'Faculty already exists.' });
      return;
    }

    setConfig((prev) => ({
      ...prev,
      [trimmed]: [],
    }));
    setNewFacultyName('');
    setToastMessage({ type: 'success', text: `Added ${trimmed}. Click "Save All Changes" to persist.` });
  };

  const handleRemoveFaculty = (facultyName: string) => {
    if (!confirm(`Are you sure you want to delete "${facultyName}" and all its departments?`)) return;
    setConfig((prev) => {
      const copy = { ...prev };
      delete copy[facultyName];
      return copy;
    });
    setToastMessage({ type: 'success', text: `Removed ${facultyName}. Click "Save All Changes" to persist.` });
  };

  const handleAddDepartment = (facultyName: string) => {
    const deptName = (newDeptMap[facultyName] || '').trim();
    if (!deptName) return;

    if (config[facultyName]?.includes(deptName)) {
      setToastMessage({ type: 'error', text: 'Department already exists in this faculty.' });
      return;
    }

    setConfig((prev) => ({
      ...prev,
      [facultyName]: [...(prev[facultyName] || []), deptName],
    }));

    setNewDeptMap((prev) => ({ ...prev, [facultyName]: '' }));
    setToastMessage({ type: 'success', text: `Added ${deptName} to ${facultyName}.` });
  };

  const handleRemoveDepartment = (facultyName: string, deptName: string) => {
    setConfig((prev) => ({
      ...prev,
      [facultyName]: (prev[facultyName] || []).filter((d) => d !== deptName),
    }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setToastMessage(null);
    try {
      const res = await saveDepartmentsConfigAction(config);
      if (res.success) {
        setToastMessage({ type: 'success', text: res.message || 'Faculties and Departments saved successfully!' });
      } else {
        setToastMessage({ type: 'error', text: res.error || 'Failed to save configuration.' });
      }
    } catch (err: any) {
      setToastMessage({ type: 'error', text: err.message || 'An error occurred while saving.' });
    } finally {
      setIsSaving(false);
    }
  };

  const facultyKeys = Object.keys(config);

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between shadow-md text-xs font-bold ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-400/50">
            ADMIN CONTENT MANAGEMENT
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">
            Academic Faculties & Departments
          </h1>
          <p className="text-xs text-slate-300 font-light mt-1">
            Add or edit faculties and departments. Newly added items immediately sync with student registration and profile editing dropdowns.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save All Changes</span>
        </button>
      </div>

      {/* Add New Faculty Card */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-800" /> Create New Faculty
        </h3>
        <form onSubmit={handleAddFaculty} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newFacultyName}
            onChange={(e) => setNewFacultyName(e.target.value)}
            placeholder="e.g. Faculty of Environmental Sciences"
            className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-950"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Faculty</span>
          </button>
        </form>
      </div>

      {/* Faculties & Departments Grid */}
      <div className="space-y-6">
        {facultyKeys.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center text-slate-500 text-xs">
            No faculties configured yet. Create a faculty above to get started.
          </div>
        ) : (
          facultyKeys.map((facultyName) => {
            const depts = config[facultyName] || [];
            return (
              <div key={facultyName} className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-4 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                    <h3 className="font-serif font-bold text-lg text-slate-900">{facultyName}</h3>
                    <span className="bg-stone-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {depts.length} Department{depts.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveFaculty(facultyName)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Faculty</span>
                  </button>
                </div>

                {/* Existing Departments Badges */}
                <div className="flex flex-wrap gap-2">
                  {depts.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No departments added to this faculty yet.</span>
                  ) : (
                    depts.map((dept) => (
                      <div
                        key={dept}
                        className="bg-emerald-50 text-emerald-950 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs"
                      >
                        <span>{dept}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDepartment(facultyName, dept)}
                          className="text-emerald-700 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove Department"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add New Department Input */}
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={newDeptMap[facultyName] || ''}
                    onChange={(e) => setNewDeptMap({ ...newDeptMap, [facultyName]: e.target.value })}
                    placeholder={`Add new department to ${facultyName}...`}
                    className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-950"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddDepartment(facultyName)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
