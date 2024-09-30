import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';
import Navbar from "../components/Navbar/Navbar";
import { Table, Card } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';

const History = () => {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 }); // Initial pagination settings

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/trips/`, {
                    params: {
                        user_id: user?.user_id,
                        _page: pagination.current,
                        _limit: pagination.pageSize
                    },
                });
                setData(response.data);
            } catch (error) {
                console.error("Error fetching Trips data:", error);
            }
        };

        fetchData();
    }, [user?.user_id, pagination.current, pagination.pageSize]);

    // Define columns for Ant Design Table
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string | number | Date) => new Date(date).toLocaleString(),
            sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            defaultSortOrder: 'descend' as const, // Sort descending by default
          },
        {
            title: 'Pickup Location',
            dataIndex: 'pickup_location',
            key: 'pickup_location',
        },
        {
            title: 'Destination Location',
            dataIndex: 'destination_location',
            key: 'destination_location',
        },
        {
            title: 'Distance (km)',
            dataIndex: 'distance_km',
            key: 'distance_km',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Service Name',
            dataIndex: 'service_name',
            key: 'service_name',
        },
        {
            title: 'Vehicle Type',
            dataIndex: 'vehicle_type',
            key: 'vehicle_type',
        },
        {
            title: 'Duration (minutes)',
            dataIndex: 'time_minutes',
            key: 'time_minutes',
        },
        // {
        //     title: 'Surge Multiplier',
        //     dataIndex: 'surge_multiplier',
        //     key: 'surge_multiplier',
        // },
    ];

    // Handle pagination change
    const handleTableChange = (
        pagination: TablePaginationConfig,
        
    ) => {
        setPagination({
            current: pagination.current!,
            pageSize: pagination.pageSize!,
        });
    };

    return (
        <div className="history-container">
            <Navbar />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px", color: 'white' }}>
                <h1>Welcome, <span style={{ color: 'yellow' }}>{user?.username}</span>!</h1>
                <h3 style={{ marginTop: '10px', marginBottom: '10px' }}>Here is your Recent Trip data</h3>
                <Card style={{ width: "80%",overflow:'scroll' }}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                        pagination={pagination}
                        onChange={handleTableChange}
                    />
                </Card>
            </div>
        </div>
    );
};

export default History;
