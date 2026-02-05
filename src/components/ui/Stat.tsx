import React from 'react';

type StatProps = {
  label: string;
  value: string;
};

const Stat = ({ label, value }: StatProps) => {
  return (
    <div className="stat">
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
};

export default Stat;
