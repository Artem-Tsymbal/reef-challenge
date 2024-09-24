import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../../features/auth/authSlice';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

function RegisterForm() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { status, error } = useSelector((state) => state.auth);
	const [form, setForm] = useState({
		email: '',
		firstName: '',
		lastName: '',
		password: '',
	});

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(registerUser(form)).then((res) => {
			if (res.type === 'auth/registerUser/fulfilled') {
				navigate('/');
			}
		});
	};

	return (
		<Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
			<Typography variant="h4" align="center" gutterBottom>
				Register
			</Typography>
			<Box component="form" onSubmit={handleSubmit}>
				<TextField
					label="Email"
					name="email"
					onChange={handleChange}
					fullWidth
					margin="normal"
					required
				/>
				<TextField
					label="First Name"
					name="firstName"
					onChange={handleChange}
					fullWidth
					margin="normal"
					required
				/>
				<TextField
					label="Last Name"
					name="lastName"
					onChange={handleChange}
					fullWidth
					margin="normal"
					required
				/>
				<TextField
					label="Password"
					name="password"
					type="password"
					onChange={handleChange}
					fullWidth
					margin="normal"
					required
				/>
				{status === 'failed' && (
					<Typography color="error">
						{error?.message || 'Registration failed'}
					</Typography>
				)}
				<Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
					Register
				</Button>
				<Button
					component={RouterLink}
					to="/login"
					fullWidth
					variant="text"
					sx={{ mt: 2 }}
				>
					Already have an account? Login
				</Button>
			</Box>
		</Box>
	);
}

export default RegisterForm;
