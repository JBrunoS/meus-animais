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
  food: '#FFF9E6',
  pops: '#F3E8FF',
  album: '#E6F4FE',
  habitat: '#E3F6E5',
  memory: '#FDECEF',
  silhouette: '#EDEDED',
};
