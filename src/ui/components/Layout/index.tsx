import React from 'react';

import './index.less';

export interface LayoutProps {
  children?: React.ReactNode;
}
export function Layout(props: LayoutProps) {
  const { children } = props;
  return (
    <div
      className="layout"
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative'
      }}>
      {children}
    </div>
  );
}
