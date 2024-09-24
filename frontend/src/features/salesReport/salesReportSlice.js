import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

const initialState = {
	report: null,
	loading: false,
	error: null,
};

export const fetchSalesReport = createAsyncThunk(
	'salesReport/fetchSalesReport',
	async ({ startDate, endDate }, { getState, rejectWithValue }) => {
		const { accessToken } = getState().auth;
		try {
			const response = await api.post(
				'/graphql',
				{
					query: `
          query SalesReport($startDate: String, $endDate: String) {
            salesReport(startDate: $startDate, endDate: $endDate) {
              totalSales
              numberOfOrders
              averageOrderValue
              salesOverTime {
                date
                sales
                orders
              }
            }
          }
        `,
					variables: { startDate, endDate },
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			return response.data.data.salesReport;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	},
);

const salesReportSlice = createSlice({
	name: 'salesReport',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchSalesReport.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchSalesReport.fulfilled, (state, action) => {
				state.loading = false;
				state.report = action.payload;
			})
			.addCase(fetchSalesReport.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload?.message || 'Failed to fetch sales report';
			});
	},
});

export default salesReportSlice.reducer;
