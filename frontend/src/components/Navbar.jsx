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
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Title */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('simulator')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  FinSecure UPI
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Visualizer & Lab
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">
                Interactive MITM Risk Awareness Platform
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('risk-lab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'risk-lab'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Risk Engine Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('crypto-lab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'crypto-lab'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Crypto Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('learn')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'learn'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Learn & Quiz</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          </div>

          {/* Controls & Actions */}
          <div className="flex items-center gap-2.5">
            {/* Guided Mode Toggle */}
            <button
              onClick={() => setIsGuidedMode(!isGuidedMode)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isGuidedMode
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
              }`}
              title="Toggle step-by-step guided instructions"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Guided: <strong className={isGuidedMode ? 'text-cyan-300' : 'text-slate-500'}>{isGuidedMode ? 'ON' : 'OFF'}</strong></span>
            </button>

            {/* Presentation Mode Demo Button */}
            <button
              onClick={onStartPresentation}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Demo Mode</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={onResetSimulation}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
              title="Reset simulation to default"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex lg:hidden items-center justify-between gap-1 py-2 overflow-x-auto border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'simulator' ? 'bg-emerald-500 text-white' : 'text-slate-400'
            }`}
          >
            Simulator
          </button>
          <button
            onClick={() => setActiveTab('risk-lab')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'risk-lab' ? 'bg-emerald-500 text-white' : 'text-slate-400'
            }`}
          >
            Risk Lab
          </button>
          <button
            onClick={() => setActiveTab('crypto-lab')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'crypto-lab' ? 'bg-emerald-500 text-white' : 'text-slate-400'
            }`}
          >
            Crypto Lab
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'learn' ? 'bg-emerald-500 text-white' : 'text-slate-400'
            }`}
          >
            Learn & Quiz
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
              activeTab === 'history' ? 'bg-emerald-500 text-white' : 'text-slate-400'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Safety Disclaimer Banner */}
      <div className="bg-slate-950/90 border-t border-b border-slate-800/60 py-1 px-4 text-center">
        <p className="text-[11px] text-slate-400 font-medium tracking-wide flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Educational Simulation</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">No real money, passwords, or actual UPI PINs are ever used or collected.</span>
        </p>
      </div>
    </header>
  );
}
