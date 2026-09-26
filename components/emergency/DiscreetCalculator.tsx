'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Lock, EyeOff, ShieldAlert } from 'lucide-react';

export function DiscreetCalculator() {
  const { isDiscreetMode, toggleDiscreetMode, triggerSOS } = useApp();
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  if (!isDiscreetMode) return null;

  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevVal(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleOp = (op: string) => {
    const inputVal = parseFloat(display);
    if (prevVal === null) {
      setPrevVal(inputVal);
    } else if (operation) {
      const current = prevVal;
      let result = current;
      if (operation === '+') result = current + inputVal;
      if (operation === '-') result = current - inputVal;
      if (operation === '×') result = current * inputVal;
      if (operation === '÷') result = current / (inputVal || 1);
      setDisplay(String(result));
      setPrevVal(result);
    }
    setWaitingForOperand(true);
    setOperation(op);
  };

  const handleEquals = () => {
    // Secret backdoor trigger checks:
    if (display === '1234') {
      // Return to SafeCircle app
      toggleDiscreetMode();
      return;
    }
    if (display === '911' || display === '112') {
      // Trigger silent SOS
      toggleDiscreetMode();
      triggerSOS();
      return;
    }

    const inputVal = parseFloat(display);
    if (prevVal !== null && operation) {
      let result = prevVal;
      if (operation === '+') result = prevVal + inputVal;
      if (operation === '-') result = prevVal - inputVal;
      if (operation === '×') result = prevVal * inputVal;
      if (operation === '÷') result = prevVal / (inputVal || 1);
      setDisplay(String(result));
      setPrevVal(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-4 animate-in fade-in select-none">
      <div className="w-full max-w-sm bg-black border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5">
        {/* Subtle Camouflage Header */}
        <div className="flex items-center justify-between text-slate-600 text-xs px-2">
          <span className="font-mono">CALC-PRO v2.4</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-700">Type 1234= to exit</span>
            <button 
              onClick={toggleDiscreetMode} 
              className="text-slate-600 hover:text-slate-400 p-1"
              title="Exit Camouflage"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Calculator Display */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 text-right overflow-hidden shadow-inner">
          <div className="text-slate-500 text-xs h-4 font-mono">
            {prevVal !== null && operation ? `${prevVal} ${operation}` : ''}
          </div>
          <div className="text-white text-4xl font-mono tracking-tight font-light truncate">
            {display}
          </div>
        </div>

        {/* Calculator Keypad */}
        <div className="grid grid-cols-4 gap-3 text-lg font-medium">
          <button
            onClick={handleClear}
            className="p-4 rounded-2xl bg-slate-800 text-red-400 font-bold hover:bg-slate-700 active:scale-95 transition-all"
          >
            AC
          </button>
          <button
            onClick={() => setDisplay(String(parseFloat(display) * -1))}
            className="p-4 rounded-2xl bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all"
          >
            ±
          </button>
          <button
            onClick={() => setDisplay(String(parseFloat(display) / 100))}
            className="p-4 rounded-2xl bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all"
          >
            %
          </button>
          <button
            onClick={() => handleOp('÷')}
            className="p-4 rounded-2xl bg-amber-600 text-white font-bold hover:bg-amber-500 active:scale-95 transition-all"
          >
            ÷
          </button>

          {['7', '8', '9'].map(d => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="p-4 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 active:scale-95 transition-all"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => handleOp('×')}
            className="p-4 rounded-2xl bg-amber-600 text-white font-bold hover:bg-amber-500 active:scale-95 transition-all"
          >
            ×
          </button>

          {['4', '5', '6'].map(d => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="p-4 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 active:scale-95 transition-all"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => handleOp('-')}
            className="p-4 rounded-2xl bg-amber-600 text-white font-bold hover:bg-amber-500 active:scale-95 transition-all"
          >
            -
          </button>

          {['1', '2', '3'].map(d => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="p-4 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 active:scale-95 transition-all"
            >
              {d}
            </button>
          ))}
          <button
            onClick={() => handleOp('+')}
            className="p-4 rounded-2xl bg-amber-600 text-white font-bold hover:bg-amber-500 active:scale-95 transition-all"
          >
            +
          </button>

          <button
            onClick={() => handleDigit('0')}
            className="col-span-2 p-4 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 active:scale-95 transition-all text-left pl-7"
          >
            0
          </button>
          <button
            onClick={handleDecimal}
            className="p-4 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 active:scale-95 transition-all"
          >
            .
          </button>
          <button
            onClick={handleEquals}
            className="p-4 rounded-2xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400 active:scale-95 transition-all text-xl"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}
