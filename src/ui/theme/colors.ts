// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette = {
  white: '#ffffff',
  white_muted: 'rgba(255, 255, 255, 0.5)',
  black: '#000000',
  black_muted: 'rgba(0, 0, 0, 0.5)',
  black_muted2: 'rgba(0, 0, 0, 0.)',

  dark: '#1E283C',
  grey: '#495361',
  light: '#f2f4f6',

  black_dark: '#0a0f57',

  green_dark: '#379a29',
  green: '#41B530',
  green_light: '#5ec04f',

  blues_dark: '#2565e6',
  blues: '#004BFF',
  blues_light: '#1a1a1a',
  blues_hover: '#d7e3f8',
  blues_color: '#3375bb',

  red_dark: '#c92b40',
  red: '#ED334B',
  red_light: '#f05266',

  blue_dark: '#1461d1',
  blue: '#1872F6',
  blue_light: '#c6dcfd',

  blue_pastel_dark: '#3774A8',
  blue_pastel: '#4A98DB',
  blue_pastel_light: '#57B2FF',

  gold: 'rgba(255,255,255,0.45)'
};

export const colors = Object.assign({}, palette, {
  transparent: 'rgba(0, 0, 0, 0)',

  text: palette.dark,

  textDim: palette.grey,

  background: '#D8E0EF',

  error: '#e5p2937',

  danger: palette.red,

  card: palette.black_dark, 
  warning: palette.blue_pastel,
  primary: palette.blues,

  bg2: palette.black_dark,
  bg3: '#434242',
  bg4: '#35373b',
  bg5: '#212f40',

  border: 'rgba(255,255,255,0.1)'
});

export type ColorTypes = keyof typeof colors;
