import { useState } from 'react';
import { Container, Typography } from '@mui/material';
import ProductForm from './components/ProductForm/ProductForm';
import ProductList from './components/ProductList/ProductList';

function ProductManagementScreen() {
	const [productToEdit, setProductToEdit] = useState(null);

	const handleEdit = (product) => {
		setProductToEdit(product);
	};

	const clearForm = () => {
		setProductToEdit(null);
	};

	return (
		<Container maxWidth="md">
			<Typography variant="h4" align="center" gutterBottom>
				Product Management
			</Typography>

			<ProductForm productToEdit={productToEdit} onFormSubmit={clearForm} />

			<ProductList onEdit={handleEdit} />
		</Container>
	);
}

export default ProductManagementScreen;
