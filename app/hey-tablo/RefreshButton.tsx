'use client';

import { useState } from 'react';

export default function RefreshButton() {
  const [refreshing, setRefreshing] = useState(false);

  return <button
    type="button"
    className="tablo-refresh"
    disabled={refreshing}
    onClick={() => {
      setRefreshing(true);
      window.location.reload();
    }}
  >{refreshing ? '새로고침 중…' : '↻ 목록 새로고침'}</button>;
}
