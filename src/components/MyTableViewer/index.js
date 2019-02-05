import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MyTableGrid from './MyTableGrid'

import { fetchDataList } from '../../services/redux/dataListReducer/actions';
class MyTableViewer extends Component {
    componentDidMount() {
        let { fetchDataList } = this.props;
        setTimeout(()=>fetchDataList(), 50);
    }

    render() {
        let { dataListReducer } = this.props;

        return (
            <MyTableGrid
                id='myTableGrid'
                dataList={dataListReducer.dataList}
                selection={true}
            />
        );
    }
}
const mapStateToProps = state => ({
    dataListReducer: state.dataListReducer
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            fetchDataList
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyTableViewer);