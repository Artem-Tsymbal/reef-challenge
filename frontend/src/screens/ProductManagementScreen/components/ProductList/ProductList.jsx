import { useState, useEffect, useMemo, useCallback } from 'react';
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Box,
	TableContainer,
	Paper,
	TextField,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchProducts,
	deleteProduct,
} from '../../../../features/products/productsSlice';

function ProductList({ onEdit }) {
	const { products } = useSelector((state) => state.products);
	const dispatch = useDispatch();
	const [searchTerm, setSearchTerm] = useState('');

	const filteredProducts = useMemo(() => {
		return products.filter((product) =>
			product.name.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [products, searchTerm]);

	const handleSearchChange = useCallback((e) => {
		setSearchTerm(e.target.value);
	}, []);

	const handleDelete = useCallback(
		(productId) => {
			dispatch(deleteProduct(productId));
		},
		[dispatch],
	);

	useEffect(() => {
		dispatch(fetchProducts(searchTerm));
	}, [dispatch, searchTerm]);

	return (
		<>
			<Box sx={{ mb: 2 }}>
				<TextField
					label="Search"
					variant="outlined"
					value={searchTerm}
					onChange={handleSearchChange}
					fullWidth
				/>
			</Box>

			<TableContainer
				component={Paper}
				sx={{ maxHeight: 400, overflow: 'auto' }}
			>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Price</TableCell>
							<TableCell>Image</TableCell>
							<TableCell sx={{ minWidth: 150 }}>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredProducts.map((product) => (
							<TableRow key={product.id}>
								<TableCell>{product.name}</TableCell>
								<TableCell>{product.description}</TableCell>
								<TableCell>${product.price.toFixed(2)}</TableCell>
								<TableCell>
									{product.imageUrl ? (
										<img
											src={product.imageUrl}
											alt={product.name}
											style={{ maxWidth: '100px', height: 'auto' }}
										/>
									) : (
										'No Image'
									)}
								</TableCell>
								<TableCell>
									<Box
										sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
									>
										<Button
											variant="contained"
											color="primary"
											onClick={() => onEdit(product)}
										>
											Edit
										</Button>
										<Button
											variant="contained"
											color="secondary"
											onClick={() => handleDelete(product.id)}
										>
											Delete
										</Button>
									</Box>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}

export default ProductList;
