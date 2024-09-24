import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';
import ProductManagementScreen from '../screens/ProductManagementScreen/ProductManagementScreen';
import OrderManagementScreen from '../screens/OrderManagementScreen/OrderManagementScreen';
import SalesReportScreen from '../screens/SalesReportScreen/SalesReportScreen';

function AppRoutes() {
	return (
		<Routes>
			<Route
				path="/"
				element={
					<Layout>
						<HomeScreen />
					</Layout>
				}
			/>
			<Route path="/login" element={<LoginScreen />} />
			<Route path="/register" element={<RegisterScreen />} />

			<Route
				path="/product-management"
				element={
					<PrivateRoute>
						<Layout>
							<ProductManagementScreen />
						</Layout>
					</PrivateRoute>
				}
			/>
			<Route
				path="/order-management"
				element={
					<PrivateRoute>
						<Layout>
							<OrderManagementScreen />
						</Layout>
					</PrivateRoute>
				}
			/>
			<Route
				path="/sales-report"
				element={
					<PrivateRoute>
						<Layout>
							<SalesReportScreen />
						</Layout>
					</PrivateRoute>
				}
			/>

			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

export default AppRoutes;
