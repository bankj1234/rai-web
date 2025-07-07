import dayjs from 'dayjs'

export const formatDate = (
  dateString: string,
  format: string = 'DD/MM/YYYY, HH:mm'
): string => {
  return dayjs(dateString).format(format)
}
