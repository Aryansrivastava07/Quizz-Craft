"use client";

import React, { useState } from "react";

interface TacticalEngineConfigProps {
  difficulty: string;
  setDifficulty: (val: string) => void;
  gameMode: string;
  setGameMode: (val: string) => void;
  capacity: number;
  setCapacity: (val: number) => void;
}

export default function TacticalEngineConfig({
  difficulty,
  setDifficulty,
  gameMode,
  setGameMode,
  capacity,
  setCapacity,
}: TacticalEngineConfigProps) {
  const difficulties = ["Adaptive AI", "Casual", "Rigorous", "Olympiad"];
  const gameModes = ["Multi-Choice", "Blitz Timed", "3D Spatial", "Fill-in-Blank"];

  const estimatedXp = capacity * 25;

  return (
    <div className="pt-4 border-t border-outline-variant/20 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Difficulty Dial */}
      <div className="space-y-2">
        <label className="font-headline-sm text-xs sm:text-sm font-semibold text-on-surface flex items-center gap-1">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontSize: "16px" }}
          >
            tune
          </span>
          Difficulty Engine
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {difficulties.map((diff) => {
            const isSelected = difficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-2.5 py-1.5 rounded-lg font-label-code text-[12px] font-semibold text-center transition-colors ${
                  isSelected
                    ? "bg-primary/15 text-primary border border-primary/40 shadow-sm"
                    : "bg-surface-container-highest/60 hover:bg-surface-container-highest text-on-surface-variant border border-outline-variant/30"
                }`}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Architecture / Game Modes */}
      <div className="space-y-2">
        <label className="font-headline-sm text-xs sm:text-sm font-semibold text-on-surface flex items-center gap-1">
          <span
            className="material-symbols-outlined text-tertiary"
            style={{ fontSize: "16px" }}
          >
            category
          </span>
          Game Modes
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {gameModes.map((mode) => {
            const isSelected = gameMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setGameMode(mode)}
                className={`px-2.5 py-1.5 rounded-lg font-label-code text-[12px] font-semibold text-center transition-colors ${
                  isSelected
                    ? "bg-tertiary/15 text-tertiary border border-tertiary/40 shadow-sm"
                    : "bg-surface-container-highest/60 hover:bg-surface-container-highest text-on-surface-variant border border-outline-variant/30"
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Capacity & Streak Tier */}
      <div className="space-y-2">
        <label className="font-headline-sm text-xs sm:text-sm font-semibold text-on-surface flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span
              className="material-symbols-outlined text-secondary"
              style={{ fontSize: "16px" }}
            >
              target
            </span>
            Capacity
          </span>
          <span className="font-stat-counter text-xs sm:text-sm text-primary">
            {capacity} Questions
          </span>
        </label>
        <div className="p-2.5 rounded-lg bg-surface-container-highest/40 border border-outline-variant/30 flex flex-col justify-between h-[72px]">
          <input
            className="w-full accent-primary cursor-pointer bg-surface-container-highest h-1.5 rounded-lg"
            max="50"
            min="5"
            type="range"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
          <div className="flex justify-between font-label-code text-[11px] text-outline">
            <span>5 Blitz</span>
            <span className="text-tertiary">Est. +{estimatedXp} XP</span>
            <span>50 Marathon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
