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
  game: '#6EC6DE',
  food: '#FFE0A3',
  pops: '#4A3B5C',
  album: '#FDF6E9',
  habitat: '#9FDDD0',
  memory: '#FDECEF',
  silhouette: '#1F2A44',
};
