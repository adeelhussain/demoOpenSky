
import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';

export const AlertBar = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }