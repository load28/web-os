import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 다양한 클래스 값을 병합하는 유틸리티 함수
 * Tailwind 클래스를 안전하게 결합하기 위해 사용
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
