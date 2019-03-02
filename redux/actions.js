export const TOOGLE_HISTORY = 'TOOGLE_HISTORY';
export const CLEAR_HISTORY = 'CLEAR_HISTORY';

export const addToFavs = (user) => ({
  type: TOOGLE_HISTORY, user,
});

export const checkInFav = (pk) => (_, getState) => {
  const index = getState().history.users.findIndex((s) => s.pk === pk);
  return index > -1;
};

export const clearHistroy = () => ({
  type: CLEAR_HISTORY,
});
