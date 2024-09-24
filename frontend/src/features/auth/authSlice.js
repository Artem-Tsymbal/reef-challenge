import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

const initialState = {
	user: null,
	accessToken: localStorage.getItem('accessToken') || null,
	status: 'idle',
	error: null,
};

export const registerUser = createAsyncThunk(
	'auth/registerUser',
	async (userData, { rejectWithValue }) => {
		try {
			const response = await api.post('/graphql', {
				query: `
					mutation Register($input: RegisterUserInput!) {
						register(registerUserInput: $input) {
							accessToken
						}
					}
				`,
				variables: {
					input: userData,
				},
			});
			return response.data.data.register;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	},
);

export const loginUser = createAsyncThunk(
	'auth/loginUser',
	async (userData, { rejectWithValue }) => {
		try {
			const response = await api.post('/graphql', {
				query: `
					mutation Login($input: LoginUserInput!) {
						login(loginUserInput: $input) {
							accessToken
						}
					}
				`,
				variables: {
					input: userData,
				},
			});
			return response.data.data.login;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	},
);

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout(state) {
			state.user = null;
			state.accessToken = null;
			localStorage.removeItem('accessToken');
		},
		setAccessToken(state, action) {
			state.accessToken = action.payload;
			localStorage.setItem('accessToken', action.payload);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.fulfilled, (state, action) => {
				state.accessToken = action.payload.accessToken;
				state.status = 'succeeded';
				localStorage.setItem('accessToken', action.payload.accessToken);
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.error = action.payload;
				state.status = 'failed';
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.accessToken = action.payload.accessToken;
				state.status = 'succeeded';
				localStorage.setItem('accessToken', action.payload.accessToken);
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.error = action.payload;
				state.status = 'failed';
			});
	},
});

export const { logout, setAccessToken } = authSlice.actions;

export default authSlice.reducer;
