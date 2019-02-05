import { dataList } from '../../constant/dataList';

export const actionType = {
    FETCH_DATA_LIST: 'FETCH_DATA_LIST'
};

export const fetchDataList = () => {
    return dispatch => {
        return dispatch({
            type: actionType.FETCH_DATA_LIST,
            payload: dataList
        });
    };
};
