import React, { useContext } from 'react';
import { Alert as MuiAlert, Stack } from '@mui/material';
import { AlertContext } from '../../context/AlertContext';

const Alert = () => {
  const { alerts } = useContext(AlertContext);

  return (
    <Stack sx={{ width: '100%', p: 2 }} spacing={2}>
      {alerts.map((alert) => (
        <MuiAlert key={alert.id} severity={alert.type} variant="filled">
          {alert.msg}
        </MuiAlert>
      ))}
    </Stack>
  );
};

export default Alert;