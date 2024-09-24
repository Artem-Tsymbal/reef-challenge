import { Typography, Button, Container, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

function HomeScreen() {
	const accessToken = useSelector((state) => state.auth.accessToken);

	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 8, textAlign: 'center' }}>
				<Typography variant="h3" gutterBottom>
					Welcome to the Product and Order Management System
				</Typography>
				{accessToken ? (
					<Typography variant="h6">
						Use the navigation bar to manage products, orders, and view sales
						reports.
					</Typography>
				) : (
					<>
						<Typography variant="h6" gutterBottom>
							Please log in or register to continue.
						</Typography>
						<Button
							variant="contained"
							color="primary"
							component={RouterLink}
							to="/login"
							sx={{ mr: 2 }}
						>
							Login
						</Button>
						<Button
							variant="outlined"
							color="primary"
							component={RouterLink}
							to="/register"
						>
							Register
						</Button>
					</>
				)}
			</Box>
		</Container>
	);
}

export default HomeScreen;
