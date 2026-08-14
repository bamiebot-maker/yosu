'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Crown, Users, MapPin, Phone, Mail, Search, Shield, Building2, User } from 'lucide-react';

export interface ExecutiveOfficerData {
  id: string;
  name: string;
  officeTitle: string;
  stateOfOrigin: string;
  phone?: string | null;
  email?: string | null;
  photoUrl?: string | null;
  category: 'EXECUTIVE' | 'HOUSE';
}

interface ExecutiveDirectoryProps {
  executives: ExecutiveOfficerData[];
  representatives: ExecutiveOfficerData[];
  statesList: string[];
}

export function ExecutiveDirectory({ executives, representatives, statesList }: ExecutiveDirectoryProps) {
  const [activeTab, setActiveTab] = useState<'EXECUTIVE' | 'HOUSE'>('EXECUTIVE');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter officers
  const currentList = activeTab === 'EXECUTIVE' ? executives : representatives;

  const filteredOfficers = currentList.filter((officer) => {
    const matchesSearch =
      officer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      officer.officeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      officer.stateOfOrigin.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState = selectedState === 'ALL' || officer.stateOfOrigin.toUpperCase() === selectedState.toUpperCase();

    return matchesSearch && matchesState;
  });

  // Group representatives by state if House tab is active and ALL state is selected
  const repsByState: Record<string, ExecutiveOfficerData[]> = {};
  if (activeTab === 'HOUSE') {
    filteredOfficers.forEach((rep) => {
      const state = rep.stateOfOrigin || 'Other';
      if (!repsByState[state]) repsByState[state] = [];
      repsByState[state].push(rep);
    });
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5" />
            <span>YOSU Leadership Roster</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Executive & Legislative Directory
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
            Official administration directory of the Yoruba Students' Union (YOSU), Federal University Dutse Chapter.
          </p>
        </div>
      </div>

      {/* Tabs & Search Filter Controls */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 space-y-4">
        {/* Main Tab Switches */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex bg-stone-100 p-1 rounded-xl gap-1">
            <button
              onClick={() => {
                setActiveTab('EXECUTIVE');
                setSelectedState('ALL');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'EXECUTIVE'
                  ? 'bg-emerald-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Current Administration ({executives.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('HOUSE')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'HOUSE'
                  ? 'bg-emerald-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>House of Representatives ({representatives.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, office or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-900 transition-all"
            />
          </div>
        </div>

        {/* State Filter Pills for House of Representatives */}
        {activeTab === 'HOUSE' && (
          <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-2 flex-shrink-0">
              Filter State:
            </span>
            <button
              onClick={() => setSelectedState('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedState === 'ALL'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
              }`}
            >
              All States
            </button>
            {statesList.map((state) => (
              <button
                key={state}
                onClick={() => setSelectedState(state)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedState === state
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Directory Grid */}
      {filteredOfficers.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-serif text-base font-bold text-slate-800">No Leadership Records Found</h4>
          <p className="text-xs text-slate-500">No officers found matching your search or state filter criteria.</p>
        </div>
      ) : activeTab === 'HOUSE' && selectedState === 'ALL' ? (
        /* Grouped House of Representatives View */
        <div className="space-y-8">
          {Object.entries(repsByState).map(([stateName, reps]) => (
            <div key={stateName} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
                <MapPin className="w-4 h-4 text-emerald-900" />
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  {stateName} State Caucus
                </h3>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {reps.length} Delegates
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reps.map((officer) => (
                  <OfficerCard key={officer.id} officer={officer} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Ungrouped Grid View (Executive Council or Filtered State) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOfficers.map((officer) => (
            <OfficerCard key={officer.id} officer={officer} />
          ))}
        </div>
      )}
    </div>
  );
}

function OfficerCard({ officer }: { officer: ExecutiveOfficerData }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:border-emerald-800/40">
      <div className="flex items-start gap-3.5">
        {/* Officer Photo */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-900 border border-stone-300 flex-shrink-0">
          {officer.photoUrl ? (
            <Image
              src={officer.photoUrl}
              alt={officer.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-emerald-950 text-amber-400">
              <User className="w-8 h-8 opacity-80" />
            </div>
          )}
        </div>

        {/* Officer Info */}
        <div className="space-y-1 overflow-hidden">
          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider inline-block">
            {officer.officeTitle}
          </span>

          <h4 className="font-serif text-sm sm:text-base font-bold text-slate-900 truncate leading-tight mt-1">
            {officer.name}
          </h4>

          <div className="flex items-center gap-1 text-xs text-slate-600">
            <MapPin className="w-3 h-3 text-emerald-800 flex-shrink-0" />
            <span className="truncate">{officer.stateOfOrigin} State</span>
          </div>
        </div>
      </div>

      {/* Contact Details (If available) */}
      <div className="pt-3 border-t border-stone-100 text-xs space-y-1.5 text-slate-600">
        {officer.phone ? (
          <a
            href={`tel:${officer.phone}`}
            className="flex items-center gap-2 hover:text-emerald-900 transition-colors truncate"
          >
            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="font-mono text-slate-800 text-[11px] font-semibold">{officer.phone}</span>
          </a>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 text-[11px] italic">
            <Phone className="w-3.5 h-3.5 opacity-50 flex-shrink-0" />
            <span>Official contact via Secretariat</span>
          </div>
        )}

        {officer.email && (
          <a
            href={`mailto:${officer.email}`}
            className="flex items-center gap-2 hover:text-emerald-900 transition-colors truncate text-[11px]"
          >
            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{officer.email}</span>
          </a>
        )}
      </div>
    </div>
  );
}
