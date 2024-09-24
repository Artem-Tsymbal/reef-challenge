import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../../features/auth/authSlice';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

function LoginForm() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { status, error } = useSelector((state) => state.auth);
	const [form, setForm] = useState({
		email: '',
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
		dispatch(loginUser(form)).then((res) => {
			if (res.type === 'auth/loginUser/fulfilled') {
				navigate('/');
			}
		});
	};

	return (
		<Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
			<Typography variant="h4" align="center" gutterBottom>
				Login
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
						{error?.message || 'Login failed'}
					</Typography>
				)}
				<Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
					Login
				</Button>
				<Button
					component={RouterLink}
					to="/register"
					fullWidth
					variant="text"
					sx={{ mt: 2 }}
				>
					Don't have an account? Register
				</Button>
			</Box>
		</Box>
	);
}

export default LoginForm;
