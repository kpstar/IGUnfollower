import { REHYDRATE } from 'redux-persist';
import { TOOGLE_HISTORY, CLEAR_HISTORY } from './actions';

export default (state = { users: [] }, action) => {
  switch (action.type) {
    case REHYDRATE:
      if (action.payload) {
        return {
          users: action.payload.history.users,
        };
      }
      return { ...state };
    case TOOGLE_HISTORY:
      if (state.users.findIndex((e) => e.pk === action.user.pk)) {
        return {
          users: [action.user, ...state.users],
        }; 
      }
      return { users: state.users.filter((s) => s.pk !== action.user.pk) };
    case CLEAR_HISTORY:
      return { users: [] };
    default:
      return state;
  }
};
