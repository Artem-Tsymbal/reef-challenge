import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchOrders,
	updateOrderStatus,
	createRandomOrder,
} from '../../../../features/orders/ordersSlice';
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Select,
	MenuItem,
	Button,
} from '@mui/material';

function OrderList() {
	const dispatch = useDispatch();
	const { orders, loading, error } = useSelector((state) => state.orders);

	useEffect(() => {
		dispatch(fetchOrders());
	}, [dispatch]);

	const handleStatusChange = (orderId, newStatus) => {
		dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
	};

	const handleCreateRandomOrder = () => {
		dispatch(createRandomOrder());
	};

	if (loading) return <p>Loading orders...</p>;
	if (error) return <p>Error: {error}</p>;

	return (
		<div>
			<Button variant="contained" onClick={handleCreateRandomOrder}>
				Create Random Order
			</Button>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Order ID</TableCell>
						<TableCell>Customer Name</TableCell>
						<TableCell>Order Date</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Order Items</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{orders.map((order) => (
						<TableRow key={order.id}>
							<TableCell>{order.id}</TableCell>
							<TableCell>{order.customerName}</TableCell>
							<TableCell>
								{new Date(order.orderDate).toLocaleDateString()}
							</TableCell>
							<TableCell>
								<Select
									value={order.status}
									onChange={(e) => handleStatusChange(order.id, e.target.value)}
								>
									<MenuItem value="Pending">Pending</MenuItem>
									<MenuItem value="Processing">Processing</MenuItem>
									<MenuItem value="Shipped">Shipped</MenuItem>
									<MenuItem value="Delivered">Delivered</MenuItem>
								</Select>
							</TableCell>
							<TableCell>
								{order.orderItems.map((item) => (
									<div key={item.id}>
										{item.quantity} x {item.product.name} @ $
										{item.price.toFixed(2)}
									</div>
								))}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

export default OrderList;
