import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesReport } from '../../../../features/salesReport/salesReportSlice';
import { TextField, Button, Divider, Box } from '@mui/material';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

function SalesReport() {
	const dispatch = useDispatch();
	const { report, loading, error } = useSelector((state) => state.salesReport);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	const handleFetchReport = () => {
		dispatch(fetchSalesReport({ startDate, endDate }));
	};

	useEffect(() => {
		dispatch(fetchSalesReport({}));
	}, [dispatch]);

	if (loading) return <p>Loading sales report...</p>;
	if (error) return <p>Error: {error}</p>;
	if (!report) return null;

	const salesData = report.salesOverTime.map((item) => ({
		date: item.date,
		sales: item.sales,
		orders: item.orders,
	}));

	return (
		<div>
			<Box
				sx={{
					marginBottom: '20px',
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<TextField
					label="Start Date"
					type="date"
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
					InputLabelProps={{
						shrink: true,
					}}
					style={{ marginRight: '10px' }}
				/>

				<TextField
					label="End Date"
					type="date"
					value={endDate}
					onChange={(e) => setEndDate(e.target.value)}
					InputLabelProps={{
						shrink: true,
					}}
					style={{ marginRight: '10px' }}
				/>
				<Button variant="contained" color="primary" onClick={handleFetchReport}>
					Fetch Report
				</Button>
			</Box>

			<div>
				<p>Total Sales: ${report.totalSales.toFixed(2)}</p>
				<p>Number of Orders: {report.numberOfOrders}</p>
				<p>Average Order Value: ${report.averageOrderValue.toFixed(2)}</p>
			</div>

			<Divider sx={{ my: 4 }} />

			<ResponsiveContainer width="100%" height={400}>
				<LineChart
					data={salesData}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line
						type="monotone"
						dataKey="sales"
						stroke="#8884d8"
						activeDot={{ r: 8 }}
					/>
					<Line type="monotone" dataKey="orders" stroke="#82ca9d" />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

export default SalesReport;
