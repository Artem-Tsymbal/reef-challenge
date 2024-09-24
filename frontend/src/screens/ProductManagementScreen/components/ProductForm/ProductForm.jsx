import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Grid2, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import {
	createProduct,
	editProduct,
} from '../../../../features/products/productsSlice';

function ProductForm({ productToEdit, onFormSubmit }) {
	const dispatch = useDispatch();
	const [form, setForm] = useState({
		name: '',
		description: '',
		price: '',
		imageUrl: '',
	});
	const [errors, setErrors] = useState({});
	const [isValidImage, setIsValidImage] = useState(true);

	useEffect(() => {
		if (productToEdit) {
			setForm({
				name: productToEdit.name,
				description: productToEdit.description,
				price: productToEdit.price,
				imageUrl: productToEdit.imageUrl || '',
			});
		}
	}, [productToEdit]);

	const validateImageUrl = useCallback((url) => {
		if (!url) return true;
		const img = new Image();
		img.src = url;
		img.onload = () => setIsValidImage(true);
		img.onerror = () => setIsValidImage(false);
	}, []);

	const validate = () => {
		const newErrors = {};
		if (!form.name) newErrors.name = 'Name is required';
		if (!form.description) newErrors.description = 'Description is required';
		if (!form.price || parseFloat(form.price) <= 0)
			newErrors.price = 'Price must be greater than zero';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setForm((prevForm) => ({
				...prevForm,
				[name]: value,
			}));

			if (name === 'imageUrl') {
				validateImageUrl(value);
			}
		},
		[validateImageUrl],
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validate()) return;

		const productData = {
			...form,
			price: parseFloat(form.price),
		};

		if (productToEdit) {
			dispatch(
				editProduct({ ...productData, id: parseInt(productToEdit.id, 10) }),
			);
		} else {
			dispatch(createProduct(productData));
		}

		setForm({
			name: '',
			description: '',
			price: '',
			imageUrl: '',
		});

		if (onFormSubmit) onFormSubmit();
	};

	return (
		<Box sx={{ marginBottom: '20px' }}>
			<Grid2 container spacing={2}>
				<Grid2 item="true" xs={12}>
					<TextField
						label="Name"
						name="name"
						value={form.name}
						onChange={handleChange}
						error={!!errors.name}
						helperText={errors.name}
						fullWidth
					/>
				</Grid2>
				<Grid2 item="true" xs={12}>
					<TextField
						label="Description"
						name="description"
						value={form.description}
						onChange={handleChange}
						error={!!errors.description}
						helperText={errors.description}
						fullWidth
					/>
				</Grid2>
				<Grid2 item="true" xs={12}>
					<TextField
						label="Price"
						name="price"
						type="number"
						value={form.price}
						onChange={handleChange}
						error={!!errors.price}
						helperText={errors.price}
						fullWidth
					/>
				</Grid2>
				<Grid2 item="true" xs={12}>
					<TextField
						label="Image URL"
						name="imageUrl"
						value={form.imageUrl}
						onChange={handleChange}
						error={!isValidImage}
						helperText={!isValidImage && 'Invalid image URL'}
						fullWidth
					/>
				</Grid2>

				<Grid2 item="true" xs={2}>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						fullWidth
						onClick={handleSubmit}
					>
						{productToEdit ? 'Edit Product' : 'Add Product'}
					</Button>
				</Grid2>

				{isValidImage && form.imageUrl && (
					<Grid2
						item="true"
						xs={4}
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<img
							src={form.imageUrl}
							alt="Product"
							style={{ maxWidth: '150px', height: 'auto', marginLeft: '20px' }}
						/>
					</Grid2>
				)}
			</Grid2>
		</Box>
	);
}

export default ProductForm;
