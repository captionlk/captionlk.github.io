export interface SubtitleStyle {
  fontFamily: string;
  fontSize: number; // in px
  color: string;
  backgroundColor: string;
  backgroundOpacity: number; // 0 to 1
  textShadow: 'none' | 'soft' | 'outline' | 'heavy';
  verticalPosition: 'bottom' | 'center' | 'top';
  verticalOffset: number; // percentage from top/bottom
}

export const DEFAULT_SUBTITLE_STYLE: SubtitleStyle = {
  fontFamily: "'Noto Sans Sinhala', 'Inter', system-ui, sans-serif",
  fontSize: 22,
  color: '#FFFFFF',
  backgroundColor: '#000000',
  backgroundOpacity: 0.75,
  textShadow: 'outline',
  verticalPosition: 'bottom',
  verticalOffset: 8
};
