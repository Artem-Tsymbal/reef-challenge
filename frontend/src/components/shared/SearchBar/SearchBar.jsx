import { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../../../features/products/productsSlice';
import { fetchOrders } from '../../../features/orders/ordersSlice';

function SearchBar({ type }) {
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
	const dispatch = useDispatch();

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 500);

		return () => {
			clearTimeout(handler);
		};
	}, [searchTerm]);

	useEffect(() => {
		if (type === 'products') {
			dispatch(fetchProducts(debouncedSearchTerm));
		} else if (type === 'orders') {
			dispatch(fetchOrders(debouncedSearchTerm));
		}
	}, [debouncedSearchTerm, type, dispatch]);

	const handleSearchClick = () => {
		setDebouncedSearchTerm(searchTerm);
	};

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				mb: 2,
			}}
		>
			<TextField
				label="Search"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				sx={{ marginRight: '30px', width: '100%' }}
			/>
			<Button
				variant="contained"
				onClick={handleSearchClick}
				sx={{
					width: '150px',
					height: '36px',
				}}
			>
				Search
			</Button>
		</Box>
	);
}

export default SearchBar;
