import { combineReducers } from 'redux';
import dataListReducer from './dataListReducer/reducers';

export default combineReducers({
    dataListReducer: dataListReducer
});
