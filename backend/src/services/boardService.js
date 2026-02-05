/* eslint-disable quotes */
/* eslint-disable no-useless-catch */
import { StatusCodes } from "http-status-codes"
import { boardModel } from "~/models/boardModel"
import ApiError from "~/utils/ApiError"
import { slugify } from "~/utils/formatters"
import { cloneDeep } from 'lodash'

const createNew = async (reqBody) => {
  try {
    // Xử lý logic dữ liệu từ đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    // Gọi tới tần model để xử lý lưu bản ghi newBoard vào trong Database
    const createdBoard = await boardModel.createNew(newBoard)

    //Lấy bản ghi board sau khi gọi (tuỳ mục đích dự án mà có cần bước này hay không)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    // Làm thêm các xử lý logic khác với các Collection khác tuỳ đặc thù dự án...vv
    // Bắn Email, Nofitication về cho admin khi có 1 cái board được tạo...vv

    // Trả kết quả về, trong Service luôn phải có return
    return getNewBoard
  } catch (error) {throw error}
}
const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    // 1. Deep clone board ra mot cai moi de xu ly, khong anh huong toi board ban dau, tuy muc dich ve sau ma co can clone deep hay khong.
    const resBoard = cloneDeep(board)
    // 2. Dua card ve dung column cua no
    resBoard.columns.forEach(column => {

      //C1: Cach dung equals nay la boi vi objectId trong MongoDB co support method .equals
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))

      //C2: Convert ObjectId ve string bang ham toString() cua JavaScript
      // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })
    // 3. Xoa mang card khoi board ban dau
    delete resBoard.cards

    return resBoard
  } catch (error) {throw error}
}
export const boardService = {
  createNew,
  getDetails
}