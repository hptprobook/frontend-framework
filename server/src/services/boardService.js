// import ApiError from '~/utils/ApiError';
import { boardModel } from '~/models/boardModel';
import { slugify } from '~/utils/formatters';

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Gọi tới Model để tạo bản ghi
    const createdBoard = await boardModel.createNew({
      ...reqBody,
      slug: slugify(reqBody.title),
    });

    // Trả về kết quả cho controller, trong Service bắt buộc phải có return
    return await boardModel.findOneById(createdBoard.insertedId);
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
};
