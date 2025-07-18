"use client";
import React from 'react'
import { useUsage } from '@/lib/usage-context';

function ToolsStatus() {
  const { usage } = useUsage();
  const getStatusStyles = () => {
    if (usage?.status === 'loading') {
      return {
        container: 'flex items-center gap-2 text-gray-600',
        circle: 'w-3 h-3 bg-gray-500 rounded-full animate-pulse',
        text: 'text-gray-600 font-medium'
      };
    }
    if (usage?.status === 'ok') {
      return {
        container: 'flex items-center gap-2 text-green-600',
        circle: 'w-3 h-3 bg-green-500 rounded-full animate-pulse',
        text: 'text-green-600 font-medium'
      };
    } else {
      return {
        container: 'flex items-center gap-2 text-red-600',
        circle: 'w-3 h-3 bg-red-500 rounded-full animate-pulse',
        text: 'text-red-600 font-medium'
      };
    }
  };

  const styles = getStatusStyles();

  return (

    <div className="">
      <div className={styles.container}>
        <div className={styles.circle}></div>
        <span className={styles.text}>{usage?.status === 'loading' ? 'Loading...' : usage?.status === 'ok' ? 'Tools Systems normal' : 'Tools Systems down'}</span>
      </div>
    </div>
  )
}

export default ToolsStatus;