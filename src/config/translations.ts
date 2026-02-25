import type { RadioStrings } from '../types';

export const translations: Record<'ar' | 'en', RadioStrings> = {
  ar: {
    ready: 'جاهز للتشغيل',
    playing: 'يتم التشغيل الآن',
    paused: 'متوقف مؤقتاً',
    stopped: 'متوقف',
    refreshing: 'جاري التحديث...',
    loading: 'جاري التحميل...',
    error: 'خطأ في تحميل البث',
    play: 'تشغيل',
    stop: 'إيقاف',
    refresh: 'تحديث',
    live: 'مباشر',
    pressAgain: 'اضغط مرة أخرى للتشغيل'
  },
  en: {
    ready: 'Ready to Play',
    playing: 'Now Playing',
    paused: 'Paused',
    stopped: 'Stopped',
    refreshing: 'Refreshing...',
    loading: 'Loading...',
    error: 'Error loading stream',
    play: 'Play',
    stop: 'Stop',
    refresh: 'Refresh',
    live: 'Live',
    pressAgain: 'Press again to play'
  }
};