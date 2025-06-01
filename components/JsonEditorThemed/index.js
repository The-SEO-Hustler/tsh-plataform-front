'use client'

import React, { useEffect, useState } from 'react'
import { JsonEditor, githubDarkTheme, githubLightTheme } from 'json-edit-react';
import { useTheme } from 'next-themes';

export default function JsonEditorThemed({ data }) {
  // const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  // useEffect(() => {
  //   setMounted(true);
  // }, []);
  // if (!mounted) return (
  //   <pre className="rounded-2xl overflow-hidden p-4 bg-gray-100 text-foreground">
  //     {JSON.stringify(data, null, 2)}
  //   </pre>
  // );
  return (
    <div className="bg-card p-1 rounded-md border border-border">

      <JsonEditor
        className="!w-full !min-w-none !max-w-none !bg-background"
        data={data}
        rootName=""
        theme={
          resolvedTheme === "dark"
            ? githubDarkTheme
            : githubLightTheme
        }
        restrictAdd
        restrictDelete
        restrictEdit
        collapse={false}
        showCollectionCount="when-closed"
      />
    </div>
  )
}
