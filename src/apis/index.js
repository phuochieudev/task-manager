import axios from 'axios'
import { API_ROOT } from '../utils/constants'

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  //axios se tra ve ket qua ve qua property cua no la data
  return response.data
}