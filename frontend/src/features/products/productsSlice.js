import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

const initialState = {
	products: [],
	loading: false,
	error: null,
};

export const fetchProducts = createAsyncThunk(
	'products/fetchProducts',
	async (searchTerm, { getState, rejectWithValue }) => {
		const { accessToken } = getState().auth;
		try {
			const response = await api.post(
				'/graphql',
				{
					query: `
          query Products($search: String) {
            products(search: $search) {
              id
              name
              description
              price
              imageUrl
            }
          }
        `,
					variables: { search: searchTerm },
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			return response.data.data.products;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	},
);

export const createProduct = createAsyncThunk(
	'products/createProduct',
	async (productData, { getState, rejectWithValue }) => {
		const { accessToken } = getState().auth;
		try {
			const response = await api.post(
				'/graphql',
				{
					query: `
					mutation CreateProduct($input: CreateProductInput!) {
						createProduct(createProductInput: $input) {
							id
							name
							description
							price
							imageUrl
						}
					}						
        `,
					variables: { input: productData },
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			return response.data.data.createProduct;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	},
);

export const editProduct = createAsyncThunk(
	'products/editProduct',
	async (productData, { getState, rejectWithValue }) => {
		const { accessToken } = getState().auth;
		try {
			const response = await api.post(
				'/graphql',
				{
					query: `
					mutation UpdateProduct($input: UpdateProductInput!) {
						updateProduct(updateProductInput: $input) {
							id
							name
							description
							price
							imageUrl
						}
					}
        `,
					variables: { input: productData },
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			return response.data.data.updateProduct;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	},
);

export const deleteProduct = createAsyncThunk(
	'products/deleteProduct',
	async (productId, { getState, rejectWithValue }) => {
		const { accessToken } = getState().auth;
		try {
			await api.post(
				'/graphql',
				{
					query: `
          mutation RemoveProduct($id: Int!) {
            removeProduct(id: $id)
          }
        `,
					variables: { id: productId },
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			return { id: productId };
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	},
);

const productsSlice = createSlice({
	name: 'products',
	initialState,
	extraReducers: (builder) => {
		builder
			.addCase(fetchProducts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.loading = false;
				state.products = action.payload;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || 'Failed to fetch products';
			})
			.addCase(createProduct.fulfilled, (state, action) => {
				state.products.push(action.payload);
			})
			.addCase(editProduct.fulfilled, (state, action) => {
				const index = state.products.findIndex(
					(p) => p.id === action.payload.id,
				);
				if (index !== -1) {
					state.products[index] = action.payload;
				}
			})
			.addCase(deleteProduct.fulfilled, (state, action) => {
				state.products = state.products.filter(
					(p) => p.id !== action.payload.id,
				);
			});
	},
});

export default productsSlice.reducer;
