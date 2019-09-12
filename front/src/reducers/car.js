import {
  CAR_PAGE_LOADED,
  CAR_PAGE_UNLOADED,
  ADD_COMMENT,
  DELETE_COMMENT
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case CAR_PAGE_LOADED:
      return {
        ...state,
        car: action.payload[0].car,
        comments: action.payload[1].comments
      };
    case CAR_PAGE_UNLOADED:
      return {};
    case ADD_COMMENT:
      return {
        ...state,
        commentErrors: action.error ? action.payload.errors : null,
        comments: action.error ?
          null :
          (state.comments || []).concat([action.payload.comment])
      };
    case DELETE_COMMENT:
      const commentId = action.commentId
      return {
        ...state,
        comments: state.comments.filter(comment => comment.id !== commentId)
      };
    default:
      return state;
  }
};
