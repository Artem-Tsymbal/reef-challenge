import React from 'react';
import LoginForm from './components/LoginForm/LoginForm';
import { Container, Box } from '@mui/material';

function LoginScreen() {
	return (
		<Container maxWidth="sm">
			<Box sx={{ mt: 8 }}>
				<LoginForm />
			</Box>
		</Container>
	);
}

export default LoginScreen;
