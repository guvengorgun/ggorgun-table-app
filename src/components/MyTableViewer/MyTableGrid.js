import React, { Component } from 'react';
import DataTable from '../DataTable';
import PropTypes from 'prop-types';
import $ from 'jquery';


class MyTableGrid extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'Title',
                data: 'title'
            },
            {
                title: 'ID',
                data: 'id'
            },
            {
                title: 'Year',
                data: 'year'
            },
            {
                title: 'Description',
                data: 'description'
            }
        ];
        this.columnFormat = [
            {
                //Title column
                targets: [0],
                orderable: false,
                createdCell: function(td, cellData, rowData, row, col) {
                    $(td).css('width', '20%');
                    $(td).css('overflow', 'hidden');
                    $(td).css('white-space', 'nowrap');
                    $(td).css('text-overflow', 'ellipsis');
                    td.title = cellData;
                }
            },
            {
                //Title column
                targets: [1, 2],
                width: '10%',
                className: 'text-center'
            },
            {
                //Description column
                targets: [3],
                orderable: false,
                createdCell: function(td, cellData, rowData, row, col) {
                    $(td).css('max-width', '300px');
                    $(td).css('overflow', 'hidden');
                    $(td).css('white-space', 'nowrap');
                    $(td).css('text-overflow', 'ellipsis');
                    td.title = cellData;
                }
            }
        ]
    }

    render() {
        let { id, dataList, singleSelection, selection, updateSelected } = this.props;
        return (
            <DataTable
                id={id}
                columns={this.columns}
                data={dataList}
                singleSelection={singleSelection}
                selection={selection}
                pageable
                searchable
                sortable
                onSelectedItems={data => {
                    /*updateSelected(data[0]);*/
                }}
                columnFormat={this.columnFormat}
                rowFormat={(row, data, dataIndex) => {
                    if (singleSelection || selection) {
                        $(row).css('cursor', 'pointer');
                    }
                }}
            />
        );
    }
}

MyTableGrid.propTypes = {
    dataList: PropTypes.array.isRequired
};

MyTableGrid.defaultProps = {
    singleSelection: false
};

export default MyTableGrid;
