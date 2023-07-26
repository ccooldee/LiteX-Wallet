import { CSSProperties } from 'react';

const $baseStyle: CSSProperties = Object.assign({}, {
  backgroundImage: 'url(./images/png/welcome-background.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center top',
  backgroundSize: 'contain',
  height: '100%',
  position: 'absolute',
  width: '100%',
  left: '0px',
  top: '0px',
} as CSSProperties);

export function BackgroundImage() {
  return (
    <div style={$baseStyle}>
    </div>
  );
}