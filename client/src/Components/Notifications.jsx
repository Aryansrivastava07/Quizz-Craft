import React, { useState } from "react";
export const Notifications = ({ notifications }) => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold text-[#1e2939] mb-6 text-center">Notifications</h2>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center">No notifications yet. You're all caught up! 🎉</p>
        ) : (
          notifications.map((note) => (
            <div key={note.id} className="bg-white shadow-md p-4 rounded-xl flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-[#354960]">{note.title}</h4>
                <p className="text-sm text-gray-600">{note.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(note.timestamp).toLocaleString()}</p>
              </div>
              {note.unread && <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-md">New</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};