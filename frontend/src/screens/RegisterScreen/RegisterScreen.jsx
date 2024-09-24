import React from 'react';
import RegisterForm from './components/RegisterFrom/RegisterForm';
import { Container, Box } from '@mui/material';

function RegisterScreen() {
	return (
		<Container maxWidth="sm">
			<Box sx={{ mt: 8 }}>
				<RegisterForm />
			</Box>
		</Container>
	);
}

export default RegisterScreen;
