import {
  CAR_FAVORITED,
  CAR_UNFAVORITED,
  SET_PAGE,
  APPLY_TAG_FILTER,
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  CHANGE_TAB,
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED,
  PROFILE_FAVORITES_PAGE_LOADED,
  PROFILE_FAVORITES_PAGE_UNLOADED
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case CAR_FAVORITED:
    case CAR_UNFAVORITED:
      return {
        ...state,
        cars: state.cars.map(car => {
          if (car.slug === action.payload.car.slug) {
            return {
              ...car,
              favorited: action.payload.car.favorited,
              favoritesCount: action.payload.car.favoritesCount
            };
          }
          return car;
        })
      };
    case SET_PAGE:
      return {
        ...state,
        cars: action.payload.cars,
        carsCount: action.payload.carsCount,
        currentPage: action.page
      };
    case APPLY_TAG_FILTER:
      return {
        ...state,
        pager: action.pager,
        cars: action.payload.cars,
        carsCount: action.payload.carsCount,
        tab: null,
        tag: action.tag,
        currentPage: 0
      };
    case HOME_PAGE_LOADED:
      return {
        ...state,
        pager: action.pager,
        tags: action.payload[0].tags,
        cars: action.payload[1].cars,
        carsCount: action.payload[1].carsCount,
        currentPage: 0,
        tab: action.tab
      };
    case HOME_PAGE_UNLOADED:
      return {};
    case CHANGE_TAB:
      return {
        ...state,
        pager: action.pager,
        cars: action.payload.cars,
        carsCount: action.payload.carsCount,
        tab: action.tab,
        currentPage: 0,
        tag: null
      };
    case PROFILE_PAGE_LOADED:
    case PROFILE_FAVORITES_PAGE_LOADED:
      return {
        ...state,
        pager: action.pager,
        cars: action.payload[1].cars,
        carsCount: action.payload[1].carsCount,
        currentPage: 0
      };
    case PROFILE_PAGE_UNLOADED:
    case PROFILE_FAVORITES_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
