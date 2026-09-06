"use client";

import React, { useState, useEffect } from 'react';
import { experimentApi, apiClient } from '../../lib/api-client';
import { FlaskConical, X, Loader2, Sparkles, Play, Dices, Sliders, AlertCircle } from 'lucide-react';

interface ScenarioOption {
  id: string;
  name: string;
  domain?: string;
  seed?: number;
  duration?: number;
}

const DEFAULT_SCENARIOS: ScenarioOption[] = [
  { id: 'SCN-RT-101', name: 'Baseline Operational Resilience', domain: 'Financial Services', seed: 42, duration: 100 },
  { id: 'SCN-RT-992', name: 'High Market Volatility Stress Test', domain: 'Financial Services', seed: 42, duration: 100 },
  { id: 'SCN-RT-401', name: 'Global Freight Port Congestion', domain: 'Supply Chain', seed: 101, duration: 250 },
  { id: 'SCN-RT-884', name: 'Cyber Incident Infrastructure Failover', domain: 'IT Operations', seed: 777, duration: 50 },
];

export default function CreateExperimentModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const [name, setName] = useState('');
  const [scenarioId, setScenarioId] = useState('SCN-RT-101');
  const [domain, setDomain] = useState('Financial Services');
  const [seed, setSeed] = useState(42);
  const [durationTicks, setDurationTicks] = useState(100);
  const [tickDelay, setTickDelay] = useState(0.2);
  const [autoStart, setAutoStart] = useState(true);

  const [scenarios, setScenarios] = useState<ScenarioOption[]>(DEFAULT_SCENARIOS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch scenarios from API if available
  useEffect(() => {
    if (!isOpen) return;

    // Reset error & load scenarios
    setError(null);
    let isMounted = true;

    async function loadScenarios() {
      try {
        const data = await apiClient.get<ScenarioOption[]>('/api/v1/scenarios/list/detailed');
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          setScenarios(data);
          if (!scenarioId || !data.some((s) => s.id === scenarioId)) {
            setScenarioId(data[0].id);
            if (data[0].domain) setDomain(data[0].domain);
          }
        }
      } catch {
        // Silently use defaults
      }
    }

    loadScenarios();

    // Keydown listener for Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // When scenario changes, adjust domain if known
  const handleScenarioChange = (selectedId: string) => {
    setScenarioId(selectedId);
    const found = scenarios.find((s) => s.id === selectedId);
    if (found?.domain) {
      setDomain(found.domain);
    }
    if (found?.seed) {
      setSeed(found.seed);
    }
    if (found?.duration) {
      setDurationTicks(found.duration);
    }
  };

  const handleRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 90000) + 1000);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a valid experiment name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: name.trim(),
        seed: Number(seed),
        config: {
          scenario_id: scenarioId,
          global_seed: Number(seed),
          duration_ticks: Number(durationTicks),
          tick_delay_seconds: Number(tickDelay),
          parameters: {
            domain,
          },
        },
      };

      const newExp = await experimentApi.createExperiment(payload);

      if (autoStart && newExp?.id) {
        try {
          await experimentApi.startSimulation(newExp.id, {
            global_seed: Number(seed),
            duration_ticks: Number(durationTicks),
            tick_delay_seconds: Number(tickDelay),
          });
        } catch (simErr) {
          console.warn('Experiment created, but starting simulation returned error:', simErr);
        }
      }

      // Reset form
      setName('');
      if (onCreated) onCreated();
      onClose();
    } catch (err: any) {
      console.error('Failed to create experiment:', err);
      setError(err?.message || 'Failed to create experiment. Please check API connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h3 id="modal-title" className="font-bold text-slate-900 text-base">
                Create New Experiment
              </h3>
              <p className="text-xs text-slate-500">
                Configure simulation blueprint, scenario profile & parameters.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-1.5 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Experiment Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Experiment Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g., Enterprise Workforce Attrition Shock"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
            />
          </div>

          {/* Scenario & Domain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Scenario Blueprint
              </label>
              <select
                value={scenarioId}
                onChange={(e) => handleScenarioChange(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              >
                {scenarios.map((scn) => (
                  <option key={scn.id} value={scn.id}>
                    {scn.name} ({scn.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Domain / Sector
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              >
                <option value="Financial Services">Financial Services</option>
                <option value="Supply Chain">Supply Chain</option>
                <option value="Healthcare Systems">Healthcare Systems</option>
                <option value="IT Operations">IT Operations</option>
                <option value="E-Commerce Logistics">E-Commerce Logistics</option>
              </select>
            </div>
          </div>

          {/* Seed & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Deterministic Seed</label>
                <button
                  type="button"
                  onClick={handleRandomSeed}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                >
                  <Dices className="w-3 h-3" /> Randomize
                </button>
              </div>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Simulation Duration (Ticks)
              </label>
              <input
                type="number"
                min="10"
                max="1000"
                value={durationTicks}
                onChange={(e) => setDurationTicks(Number(e.target.value))}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition font-mono"
              />
            </div>
          </div>

          {/* Execution Speed */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              Runtime Tick Interval
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Fast (0.1s)', val: 0.1 },
                { label: 'Standard (0.2s)', val: 0.2 },
                { label: 'Stepped (0.5s)', val: 0.5 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setTickDelay(opt.val)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                    tickDelay === opt.val
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Start Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={autoStart}
                onChange={(e) => setAutoStart(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Auto-start simulation runtime immediately
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Initializes synthetic workers and streams telemetry ticks right after creation.
                </span>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating & Launching...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Create Experiment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}