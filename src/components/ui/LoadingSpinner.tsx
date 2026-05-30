import React from 'react';

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin"
    />
  );
}
