import axiosInstance from './api.services'

export const callTestApi = async () => {
  const response = await axiosInstance.get('api/v1/sample')
  return response.data
}
