import React from 'react';
import { Wrench, Smartphone, RefreshCw, CheckCircle } from 'lucide-react';

export const Services = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h1>
          <p className="text-slate-500">Beyond just selling phones, we provide full lifecycle support for your devices.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Repair Service */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Wrench size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Expert Repair Service</h2>
            <p className="text-slate-600 mb-6">
              Screen broken? Battery draining fast? Our certified technicians can fix it. We use original parts and provide warranty on repairs.
            </p>
            <ul className="space-y-3 mb-8">
              {['LCD Replacement', 'Battery Replacement', 'Water Damage', 'Software Issues'].map(i => (
                <li key={i} className="flex items-center gap-2 text-slate-700">
                  <CheckCircle size={18} className="text-green-500" /> {i}
                </li>
              ))}
            </ul>
            <button className="bg-slate-900 text-white font-semibold py-3 px-6 rounded-lg w-full">
              Book Repair Appointment
            </button>
          </div>

          {/* Trade In */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
              <RefreshCw size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Trade In Program</h2>
            <p className="text-slate-600 mb-6">
              Upgrade your old device to the latest model. We offer competitive rates for your used iPhone, Samsung, and other flagship devices.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 mb-8">
              <h4 className="font-bold text-sm mb-2">Estimated Value Example:</h4>
              <div className="flex justify-between text-sm mb-1">
                <span>iPhone 13 Pro 128GB</span>
                <span className="font-bold">Up to Rp 10.000.000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Samsung S23 Ultra</span>
                <span className="font-bold">Up to Rp 12.500.000</span>
              </div>
            </div>
            <button className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg w-full">
              Check Trade-in Value
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
