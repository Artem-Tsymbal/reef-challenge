import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

const initialState = {
	orders: [],
	loading: false,
	error: null,
};

export const fetchOrders = createAsyncThunk(
	'orders/fetchOrders',
	async (searchTerm, { getState, rejectWithValue }) => {
		const { accessToken } = getState().auth;
		try {
			const response = await api.post(
				'/graphql',
				{
					query: `
          query Orders($search: String) {
            orders(search: $search) {
              id
              customerName
              orderDate
              status
              orderItems {
                id
                quantity
                price
                product {
                  id
                  name
                }
              }
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
			return response.data.data.orders;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	},
);

export const updateOrderStatus = createAsyncThunk(
	'orders/updateOrderStatus',
	async ({ id, status }, { getState, rejectWithValue }) => {
		const { accessToken } = getState().auth;
		try {
			const response = await api.post(
				'/graphql',
				{
					query: `
          mutation UpdateOrderStatus($input: UpdateOrderInput!) {
            updateOrderStatus(updateOrderInput: $input) {
              id
              status
            }
          }
        `,
					variables: { input: { id: parseInt(id, 10), status } },
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			return response.data.data.updateOrderStatus;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	},
);

export const createRandomOrder = createAsyncThunk(
	'orders/createRandomOrder',
	async (_, { getState, rejectWithValue }) => {
		const { accessToken } = getState().auth;
		try {
			const response = await api.post(
				'/graphql',
				{
					query: `
          mutation {
            createRandomOrder {
              id
              customerName
              orderDate
              status
              orderItems {
                id
                quantity
                price
                product {
                  id
                  name
                }
              }
            }
          }
        `,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			return response.data.data.createRandomOrder;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	},
);

const ordersSlice = createSlice({
	name: 'orders',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchOrders.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchOrders.fulfilled, (state, action) => {
				state.loading = false;
				state.orders = action.payload;
			})
			.addCase(fetchOrders.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || 'Failed to fetch orders';
			})
			.addCase(updateOrderStatus.fulfilled, (state, action) => {
				const index = state.orders.findIndex(
					(order) => order.id === action.payload.id,
				);
				if (index !== -1) {
					state.orders[index].status = action.payload.status;
				}
			})
			.addCase(createRandomOrder.fulfilled, (state, action) => {
				state.orders.push(action.payload);
			});
	},
});

export default ordersSlice.reducer;
