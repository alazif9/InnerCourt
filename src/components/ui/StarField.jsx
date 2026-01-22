import React from 'react';

export default function StarField() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Pure black background */}
      <div className="absolute inset-0 bg-black" />
    </div>
  );
}