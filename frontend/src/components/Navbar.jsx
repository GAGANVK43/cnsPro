import React from 'react';
import { ShieldCheck, Layers, Sliders, Cpu, BookOpen, RefreshCw, Play, HelpCircle } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  isGuidedMode,
  setIsGuidedMode,
  onStartPresentation,
  onResetSimulation,
  isMitmActive
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Title */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('simulator')}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  CNS Pro
                </span>
                <span className="text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Payment Security Lab
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Analyze communication & identify MITM risks
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('risk-lab')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'risk-lab'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Risk Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('crypto-lab')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'crypto-lab'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Crypto Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('learn')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'learn'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Learn & Quiz</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          </div>

          {/* Controls & Presentation Trigger */}
          <div className="flex items-center gap-2.5">
            {/* Guided Mode Toggle */}
            <button
              onClick={() => setIsGuidedMode(!isGuidedMode)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isGuidedMode
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle guided step explanations"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Guide: <strong className={isGuidedMode ? 'text-blue-700' : 'text-slate-500'}>{isGuidedMode ? 'ON' : 'OFF'}</strong></span>
            </button>

            {/* Presentation Mode Demo Button */}
            <button
              onClick={onStartPresentation}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Demo Mode</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={onResetSimulation}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Reset simulation to clean state"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden items-center justify-between gap-1 py-2 overflow-x-auto border-t border-slate-200">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
              activeTab === 'simulator' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            Simulator
          </button>
          <button
            onClick={() => setActiveTab('risk-lab')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
              activeTab === 'risk-lab' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            Risk Engine
          </button>
          <button
            onClick={() => setActiveTab('crypto-lab')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
              activeTab === 'crypto-lab' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            Crypto Lab
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
              activeTab === 'learn' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            Learn & Quiz
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
              activeTab === 'history' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-slate-50 border-t border-slate-200 py-1.5 px-4 text-center">
        <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Educational Simulation</span>
          <span className="text-slate-300">•</span>
          <span>Safe by design: No real banking passwords, PINs, or financial accounts are used.</span>
        </p>
      </div>
    </header>
  );
}
