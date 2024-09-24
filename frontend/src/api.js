import axios from 'axios';
import store from './store';
import { logout, setAccessToken } from './features/auth/authSlice';

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	withCredentials: true,
});

async function refreshToken() {
	try {
		const response = await api.post('/graphql', {
			query: `
				mutation {
					refreshTokens {
						accessToken
					}
				}
			`,
		});

		const { accessToken } = response.data.data.refreshTokens;

		store.dispatch(setAccessToken(accessToken));

		return accessToken;
	} catch (err) {
		store.dispatch(logout());
		throw err;
	}
}

api.interceptors.response.use(
	(response) => {
		if (response.data.errors) {
			const unauthorizedError = response.data.errors.find(
				(err) => err.extensions?.code === 'UNAUTHENTICATED',
			);

			if (unauthorizedError) {
				const error = new Error('Unauthorized');
				error.isAuthError = true;
				throw error;
			}
		}
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (error.isAuthError && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const newAccessToken = await refreshToken();
				originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
				return api(originalRequest);
			} catch (err) {
				store.dispatch(logout());
				window.location.href = '/login';
				return Promise.reject(err);
			}
		}

		return Promise.reject(error);
	},
);

export default api;
