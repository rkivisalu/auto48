import {
  EDITOR_PAGE_LOADED,
  EDITOR_PAGE_UNLOADED,
  CAR_SUBMITTED,
  ASYNC_START,
  ADD_TAG,
  REMOVE_TAG,
  UPDATE_FIELD_EDITOR
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case EDITOR_PAGE_LOADED:
      return {
        ...state,
        carSlug: action.payload ? action.payload.car.slug : '',
        title: action.payload ? action.payload.car.title : '',
        description: action.payload ? action.payload.car.description : '',
        kw: action.payload ? action.payload.car.kw : '',
        price: action.payload ? action.payload.car.price : '',
        body: action.payload ? action.payload.car.body : '',
        tagInput: '',
        tagList: action.payload ? action.payload.car.tagList : []
      };
    case EDITOR_PAGE_UNLOADED:
      return {};
    case CAR_SUBMITTED:
      return {
        ...state,
        inProgress: null,
        errors: action.error ? action.payload.errors : null
      };
    case ASYNC_START:
      if (action.subtype === CAR_SUBMITTED) {
        return { ...state, inProgress: true };
      }
      break;
    case ADD_TAG:
      return {
        ...state,
        tagList: state.tagList.concat([state.tagInput]),
        tagInput: ''
      };
    case REMOVE_TAG:
      return {
        ...state,
        tagList: state.tagList.filter(tag => tag !== action.tag)
      };
    case UPDATE_FIELD_EDITOR:
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }

  return state;
};
