import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Clean blue
    },
    secondary: {
      main: '#f5f5f5', // Light grey for accents
    },
    background: {
      default: '#ffffff', // White background
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Clean, modern typography
  },
});

export default theme;
