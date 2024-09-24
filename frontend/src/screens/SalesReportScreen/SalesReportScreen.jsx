import React from 'react';
import SalesReport from './components/SalesReport/SalesReport';
import { Typography } from '@mui/material';

function SalesReportScreen() {
	return (
		<div>
			<Typography variant="h4" align="left" gutterBottom sx={{ mb: 5 }}>
				Sales report
			</Typography>
			<SalesReport />
		</div>
	);
}

export default SalesReportScreen;
