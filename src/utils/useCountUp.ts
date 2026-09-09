import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  useIndianLocale?: boolean;
  formatIndian?: boolean;
}

export function useCountUp(
  targetValue: number,
  options: UseCountUpOptions = {}
): string {
  const {
    duration = 800,
    decimals = 0,
    prefix = '',
    suffix = '',
    useIndianLocale = false,
    formatIndian = false,
  } = options;

  const isIndian = formatIndian || useIndianLocale;

  const [currentValue, setCurrentValue] = useState<number>(0);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrentValue(targetValue);
      return;
    }

    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    let startTime: number | null = null;
    let frameId: number;

    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const val = easedProgress * targetValue;

      setCurrentValue(val);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCurrentValue(targetValue);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [targetValue, duration]);

  let formattedNum = currentValue.toFixed(decimals);
  if (isIndian) {
    const parts = formattedNum.split('.');
    const integerPart = Math.floor(Number(parts[0])).toLocaleString('en-IN');
    formattedNum = parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
  }

  return `${prefix}${formattedNum}${suffix}`;
}
