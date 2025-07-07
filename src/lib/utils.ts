import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const addSpaceBetweenUpperCase = (text: string) => {
  return text
    ?.replace(/([a-z])([A-Z])/g, '$1 $2')
    ?.replace(/_/g, ' ')
    ?.split(' ')
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    ?.join(' ')
}

export const customRound = (number: number, toFixed = 2) => {
  if (number == null || isNaN(number)) {
    return null
  }
  return parseFloat(Number(number)?.toFixed(toFixed))
}
