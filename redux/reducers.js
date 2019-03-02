import { persistCombineReducers } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import history from './history';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['history'],
};
export default persistCombineReducers(persistConfig, {
  history,
});
