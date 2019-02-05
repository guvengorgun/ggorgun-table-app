import { actionType } from './actions';

const initialState = {
    dataList: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.FETCH_DATA_LIST: {
            return {
                ...state,
                dataList: action.payload
            };
        }

        default:
            return state;
    }
};
