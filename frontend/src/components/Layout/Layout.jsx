import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import Notifications from '../Notifications/Notifications';

function Layout({ children }) {
	const accessToken = useSelector((state) => state.auth.accessToken);

	const dispatch = useDispatch();

	const handleLogout = () => {
		dispatch(logout());
	};

	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" sx={{ flexGrow: 1 }}>
						Product and Order Management
					</Typography>
					<Button
						color="inherit"
						component={RouterLink}
						to="/product-management"
					>
						Products
					</Button>
					<Button color="inherit" component={RouterLink} to="/order-management">
						Orders
					</Button>
					<Button color="inherit" component={RouterLink} to="/sales-report">
						Sales Report
					</Button>
					{accessToken && (
						<Button color="inherit" onClick={handleLogout}>
							Logout
						</Button>
					)}
				</Toolbar>
			</AppBar>

			<Notifications />

			<Container sx={{ mt: 4 }}>{children}</Container>
		</>
	);
}

export default Layout;
