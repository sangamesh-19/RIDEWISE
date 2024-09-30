import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import type { InputRef } from 'antd/es/input'; // Import InputRef for the ref type

interface ServiceUsageData {
  service_name: string;
  vehicle_type: string;
  count: number;
}

type DataIndex = keyof ServiceUsageData;

const ServiceUsageList: React.FC<{ service_usage: ServiceUsageData[] }> = ({ service_usage }) => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState<DataIndex | undefined>(undefined); // Use DataIndex | undefined
  const searchInput = useRef<InputRef>(null);

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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<ServiceUsageData> => ({
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

  const columns: ColumnsType<ServiceUsageData> = [
    {
      title: 'Service Name',
      dataIndex: 'service_name',
      key: 'service_name',
      width: '30%',
      ...getColumnSearchProps('service_name'),
    },
    {
      title: 'Vehicle Type',
      dataIndex: 'vehicle_type',
      key: 'vehicle_type',
      width: '30%',
      ...getColumnSearchProps('vehicle_type'),
    },
    {
      title: 'Frequency',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  const paginationConfig = {
    defaultPageSize: 6, // Number of items per page
    pageSizeOptions: ['5', '10', '15', '20'], // Options for changing the number of items per page
    hideOnSinglePage: true,
  };

  return (
    <Table
      bordered
      columns={columns}
      dataSource={service_usage.slice(0, 5)} // Displaying service usage data
      pagination={paginationConfig} // Adding pagination
    />
  );
};

export default ServiceUsageList;
