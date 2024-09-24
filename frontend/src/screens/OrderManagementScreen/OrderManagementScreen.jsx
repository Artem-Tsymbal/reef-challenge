import React from 'react';
import OrderList from './components/OrderList/OrderList';
import SearchBar from '../../components/shared/SearchBar/SearchBar';
import { Typography } from '@mui/material';

function OrderManagementScreen() {
	return (
		<div>
			<Typography variant="h4" align="center" gutterBottom>
				Order Management
			</Typography>
			<SearchBar type="orders" />
			<OrderList />
		</div>
	);
}

export default OrderManagementScreen;
