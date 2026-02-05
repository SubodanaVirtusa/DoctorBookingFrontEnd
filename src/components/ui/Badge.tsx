import React from 'react';

type BadgeProps = {
  status: string;
};

const statusClass: Record<string, string> = {
  Scheduled: 'badge badge-blue',
  Confirmed: 'badge badge-green',
  Completed: 'badge badge-gray',
  Cancelled: 'badge badge-red',
};

const Badge = ({ status }: BadgeProps) => {
  return <span className={statusClass[status] ?? 'badge badge-gray'}>{status}</span>;
};

export default Badge;
