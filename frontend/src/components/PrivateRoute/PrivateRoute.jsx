import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute({ children }) {
	const accessToken = useSelector((state) => state.auth.accessToken);
	return accessToken ? children : <Navigate to="/login" />;
}
