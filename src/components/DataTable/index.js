import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net';
import 'datatables.net-bs';
import 'datatables.net-select';

import 'datatables.net-buttons';
import 'datatables.net-buttons-bs';

import 'datatables.net-buttons/js/dataTables.buttons.min';
import 'datatables.net-buttons/js/buttons.colVis.min';
import 'datatables.net-buttons/js/buttons.flash.min';
import 'datatables.net-buttons/js/buttons.html5.min';
import 'datatables.net-buttons/js/buttons.print.min';

import 'datatables.net-buttons-bs/js/buttons.bootstrap.min';
import 'datatables.net-buttons-bs/css/buttons.bootstrap.min.css';

import 'datatables.net-select-bs/css/select.bootstrap.min.css';
import 'datatables.net-select/js/dataTables.select';

import 'datatables.net-bs/css/dataTables.bootstrap.css';
import 'datatables.net-bs/js/dataTables.bootstrap';

import { history } from '../../store';

class DataTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageIndex: 0,
            selectedRowIndex: undefined,
            initialize: true
        };
        this.selectedItems = [];
        this.initialize = this.initialize.bind(this);
        this.destroy = this.destroy.bind(this);
        this.reloadCurrentState = this.reloadCurrentState.bind(this);
        this.getDataFromLocalStorage = this.getDataFromLocalStorage.bind(this);
    }

    componentDidMount() {
        this.initialize();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextState.initialize && !this.state.initialize) {
            let selectedRowIndex = undefined;

            if (this.state.selectedRowIndex !== nextState.selectedRowIndex) {
                selectedRowIndex = nextState.selectedRowIndex;
            }

            if (
                nextProps.id !== this.props.id ||
                nextProps.data.length !== this.props.data.length ||
                nextProps.columns.length !== this.props.columns.length ||
                nextProps.data !== this.props.data
            ) {
                this.reloadTableData(
                    nextProps.id,
                    nextProps.data,
                    nextProps.columns,
                    history,
                    selectedRowIndex
                );
            } else {
                this.updateTable(
                    nextProps.id,
                    nextProps.data,
                    nextProps.columns,
                    history,
                    selectedRowIndex
                );
            }
        }
        return false;
    }

    initialize() {
        let table = this.refs.main;

        let _this = this;
        const {
            id,
            showButtons,
            buttons,
            data,
            columns,
            sortable,
            order,
            pageable,
            serverSide,
            ajax,
            columnFormat,
            rowFormat,
            rowGroup,
            checkBoxSelection,
            selection,
            onSelectedItems,
            singleSelection,
        } = this.props;

        $(table).DataTable({
            id,
            dom: this.createDOM(),
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'All']],
            processing: true,
            buttons: showButtons ? buttons : [],
            data: data,
            columns: columns,
            ordering: sortable,
            order: order,
            paging: pageable,
            serverSide: serverSide,
            ajax: ajax,
            fixedColumns: true,
            select: selection
                ? 'multi'
                : checkBoxSelection
                    ? { style: 'multi', selector: 'td:first-child' }
                    : singleSelection,
            columnDefs: columnFormat,
            createdRow: rowFormat,
            rowGroup: rowGroup,
            stateSave: true,
            stateSaveCallback: function(settings, data) {
                if (!_this.state.initialize) {
                    const localData = _this.getDataFromLocalStorage(
                        history,
                        id
                    );

                    if (
                        localData !== null &&
                        localData !== undefined &&
                        localData.selectedRowIndex !== undefined
                    )
                        data.selectedRowIndex = localData.selectedRowIndex;

                    localStorage.setItem(
                        'DataTables_MLP' +
                        history.location.pathname +
                        (id ? '#' + id : ''),
                        JSON.stringify(data)
                    );
                }
            }
        });

        if (selection) {
            $(table, 'tbody').on('click', 'tr', function() {
                if (
                    this._DT_RowIndex !== undefined &&
                    !this.classList.contains('disabled')
                ) {
                    const rowId = this._DT_RowIndex;

                    const localData = _this.getDataFromLocalStorage(
                        history,
                        id
                    );

                    if (localData !== null && localData !== undefined)
                        localData.selectedRowIndex = rowId;

                    if (
                        history !== null &&
                        history !== undefined &&
                        !_this.state.initialize
                    ) {
                        localStorage.setItem(
                            'DataTables_MLP' +
                            history.location.pathname +
                            (id ? '#' + id : ''),
                            JSON.stringify(localData)
                        );
                    }

                    _this.setState({ selectedRowIndex: rowId });
                    const selectedItem = _this.props.data[rowId];
                    const index = $.inArray(selectedItem, _this.selectedItems);

                    if (index === -1) {
                        _this.selectedItems.push(selectedItem);
                    } else {
                        _this.selectedItems.splice(index, 1);
                    }

                    $(this).toggleClass('selected');
                    onSelectedItems(_this.selectedItems);
                }
            });
        }

        if (singleSelection) {
            $(table, 'tbody').on('click', 'tr', function() {
                if (!this.classList.contains('disabled')) {
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                        _this.selectedItems = [];
                        let localData = _this.getDataFromLocalStorage(
                            history,
                            id
                        );

                        delete localData.selectedRowIndex;

                        localStorage.setItem(
                            'DataTables_MLP' +
                            history.location.pathname +
                            (id ? '#' + id : ''),
                            JSON.stringify(localData)
                        );

                        _this.setState({ selectedRowIndex: null });

                        onSelectedItems(_this.selectedItems);
                    } else {
                        $(table)
                            .find('tr.selected')
                            .removeClass('selected');
                        $(this).addClass('selected');

                        if (this._DT_RowIndex !== undefined) {
                            let rowId = this._DT_RowIndex;

                            const localData = _this.getDataFromLocalStorage(
                                history,
                                id
                            );

                            if (localData !== null && localData !== undefined)
                                localData.selectedRowIndex = rowId;

                            if (
                                history !== null &&
                                history !== undefined &&
                                !_this.state.initialize
                            ) {
                                localStorage.setItem(
                                    'DataTables_MLP' +
                                    history.location.pathname +
                                    (id ? '#' + id : ''),
                                    JSON.stringify(localData)
                                );
                            }

                            _this.setState({ selectedRowIndex: rowId });

                            let selectedItem = _this.props.data[rowId];

                            _this.selectedItems = [];
                            _this.selectedItems.push(selectedItem);
                            onSelectedItems(_this.selectedItems);
                        }
                    }
                }
            });
        }

        this.setState({ initialize: false });

        const localData = this.getDataFromLocalStorage(history, id);

        this.reloadCurrentState(localData, true, _this.state.selectedRowIndex);
    }

    destroy() {
        let table = this.refs.main;

        $(table)
            .DataTable()
            .destroy();
    }

    createDOM() {
        const { pageable, showButtons, searchable } = this.props;
        let row = "<'row'";

        if (pageable) {
            if (showButtons) {
                row += "<'col-sm-5'l><'col-sm-4 text-right'B>";
            } else {
                row += "<'col-sm-9'l>";
            }
        } else if (showButtons) {
            row += "<'col-sm-9 text-left'B>";
        }

        if (searchable) {
            row += "<'col-sm-3'f>";
        }

        row += '>';

        if (pageable) {
            row += 'tip';
        }

        return row;
    }

    reloadTableData(id, names, colnames, history, selectedRowIndex) {
        const localData = this.getDataFromLocalStorage(history, id);
        const table = this.refs.main;

        let datatable = $(table).DataTable();
        let tableHeader = $(datatable.column(0).header());

        tableHeader.removeClass('selected');
        this.selectedItems = [];
        datatable.clear();
        datatable.rows.add(names);
        datatable.columns = colnames;
        datatable.draw();

        this.reloadCurrentState(localData, true, selectedRowIndex);
    }

    updateTable(id, names, colnames, history, selectedRowIndex) {
        const localData = this.getDataFromLocalStorage(history, id);
        const table = this.refs.main;
        const datatable = $(table).DataTable();

        datatable.columns.adjust();
        datatable.rows().every(function() {
            const oldNameData = this.data();
            const newNameData = names.filter(nameData => {
                return nameData.name === oldNameData.name;
            });

            if (oldNameData.nickname !== newNameData.nickname) {
                this.data(newNameData);
            }

            return true;
        });

        datatable.draw();

        this.reloadCurrentState(localData, false, selectedRowIndex);
    }

    reloadCurrentState(localData, isPageLength, selectedRowIndex) {
        if (localData !== undefined && localData !== null) {
            const table = this.refs.main;
            const datatable = $(table).DataTable();

            if (isPageLength) {
                datatable.page.len(localData.length).draw(false);
            }

            const order = localData.order;
            const search = localData.search.search;
            const pageIndex = localData.start / localData.length;

            datatable.order(order).draw(false);
            datatable.search(search).draw(false);
            datatable.page(pageIndex).draw(false);

            if (localData.selectedRowIndex !== undefined) {
                /*datatable
                    .row(localData.selectedRowIndex, { page: 'current' })
                    .select();*/
                datatable.rows({ selected: true }.deselect);
            }
        }
    }

    getDataFromLocalStorage(history, id) {
        let localData = null;
        if (history !== null && history !== undefined) {
            const localPath = history.location.pathname + (id ? '#' + id : '');
            localData = JSON.parse(
                localStorage.getItem('DataTables_MLP' + localPath)
            );
        }

        return localData;
    }

    render() {
        const { id, contextMenu } = this.props;

        return (
            <div className="table-responsive">
                <table
                    id={id}
                    ref="main"
                    className="table table-hover table-bordered table-striped data-table-back"
                    cellSpacing="0"
                    width="100%"
                />
                {contextMenu}
            </div>
        );
    }
}

DataTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    sortable: PropTypes.bool,
    pageable: PropTypes.bool,
    checkBoxSelection: PropTypes.bool,
    selection: PropTypes.bool,
    searchable: PropTypes.bool,
    showButtons: PropTypes.bool,
    buttons: PropTypes.array,
    onSelectedItems: PropTypes.func,
    onDoubleClick: PropTypes.func,
    singleSelection: PropTypes.bool,
    serverSide: PropTypes.bool,
    ajax: PropTypes.string,
    columnFormat: PropTypes.array,
    rowFormat: PropTypes.func,
    rowGroup: PropTypes.object,
    order: PropTypes.array,
    id: PropTypes.string,
    history: PropTypes.object
};

DataTable.defaultProps = {
    sortable: false,
    pageable: false,
    checkBoxSelection: false,
    selection: false,
    searchable: false,
    singleSelection: false,
    contextMenu: null,
    showButtons: false,
    buttons: [],
    serverSide: false,
    columnFormat: null,
    rowFormat: null,
    rowGroup: null,
    order: [['0', 'desc']],
    id: null,
    history: null
};

export default DataTable;
