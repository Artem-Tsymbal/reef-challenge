import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Snackbar, Alert } from '@mui/material';

const Notifications = () => {
	const [message, setMessage] = useState('');
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const newSocket = io(process.env.REACT_APP_SOCKET_URL);

		newSocket.on('connect', () => {
			console.log('WebSocket connected');
		});

		newSocket.on('disconnect', () => {
			console.log('WebSocket disconnected');
		});

		newSocket.on('orderNotification', (data) => {
			setMessage(`New order placed: ${data}`);
			setOpen(true);
		});

		return () => {
			newSocket.close();
		};
	}, []);

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
			<Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default Notifications;
