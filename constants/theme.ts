import { Platform } from 'react-native';

// fonte arredondada nativa (iOS/web) — sem custo de asset extra
export const Fonts = Platform.select({
  ios: { rounded: 'ui-rounded' },
  web: {
    rounded:
      "'SF Pro Rounded', 'Baloo 2', 'Comic Sans MS', 'Hiragino Maru Gothic ProN', sans-serif",
  },
  default: { rounded: 'normal' },
})!;

// cores vivas usadas nos botões do menu principal
export const FunColors = ['#FF7675', '#00B894', '#FDCB6E', '#6C5CE7', '#0984E3'];

// fundo pastel de cada tela, pra tirar a cara de "tudo branco"
export const ScreenBackgrounds = {
  game: '#BEE7FA',
  food: '#CFF0FA',
  pops: '#2C3968',
  album: '#E6F4FE',
  habitat: '#BFE3F0',
  memory: '#FDECEF',
  silhouette: '#232B4D',
};
