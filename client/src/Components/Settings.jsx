import React, { useState } from "react";
export const Settings = ({ settings, onChange }) => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold text-[#1e2939] mb-6 text-center">Settings</h2>

      <form className="space-y-6">
        {settings.map((setting) => (
          <div key={setting.id} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
            <div>
              <label htmlFor={setting.id} className="text-[#354960] font-medium">{setting.label}</label>
              <p className="text-sm text-gray-500">{setting.description}</p>
            </div>
            <input
              type="checkbox"
              id={setting.id}
              checked={setting.enabled}
              onChange={() => onChange(setting.id)}
              className="toggle toggle-lg"
            />
          </div>
        ))}
        <div className="text-right">
          <button type="submit" className="px-5 py-2 bg-green-500 text-white font-semibold rounded-xl">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};