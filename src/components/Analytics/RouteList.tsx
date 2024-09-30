import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import type { InputRef } from 'antd/es/input';

interface PopularRoutesData {
  pickup_location: string;
  destination_location: string;
  count: number;
}

type DataIndex = keyof PopularRoutesData;

const PopularRoutesList: React.FC<{ popular_routes: PopularRoutesData[] }> = ({ popular_routes }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null); // Use InputRef for the ref type

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<PopularRoutesData> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={close}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: () => (
      <SearchOutlined style={{ color: '#1890ff' }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<PopularRoutesData> = [
    {
      title: 'Pickup Location',
      dataIndex: 'pickup_location',
      key: 'pickup_location',
      width: '40%',
      ...getColumnSearchProps('pickup_location'),
    },
    {
      title: 'Destination Location',
      dataIndex: 'destination_location',
      key: 'destination_location',
      width: '40%',
      ...getColumnSearchProps('destination_location'),
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  const paginationConfig = {
    defaultPageSize: 5, // Number of items per page
    pageSizeOptions: ['5', '10', '15', '20'], // Options for changing the number of items per page
    hideOnSinglePage: true,
  };

  return (
    <Table
      bordered
      columns={columns}
      dataSource={popular_routes.slice(0, 5)} // Displaying only top 5 routes
      pagination={paginationConfig} // Adding pagination
    />
  );
};

export default PopularRoutesList;
