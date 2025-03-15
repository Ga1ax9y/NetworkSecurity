import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  FormControlLabel,
  Checkbox
} from '@mui/material';

const DANGEROUS_CHARS = ["'", "\"", ";", "-", "#", "/*", "*/", "="];

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [users, setUsers] = useState([]);
  const [escapeEnabled, setEscapeEnabled] = useState(false);

  const validateInput = (value) => {
    if (!escapeEnabled) return value;

    // Удаляем все опасные символы
    return value.split('').filter(char =>
      !DANGEROUS_CHARS.includes(char)
    ).join('');
  };

  const handleUsernameChange = (e) => {
    const cleanedValue = validateInput(e.target.value);
    setUsername(cleanedValue);
  };

  const fetchUsers = async () => {
    const response = await fetch('http://localhost:5000/users');
    const data = await response.json();
    setUsers(data);
  };

  const handleLogin = async (isSafe) => {
    const endpoint = isSafe ? 'safe' : 'unsafe';
    try {
      const response = await fetch(`http://localhost:5000/login/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          SQL Injection Demo
        </Typography>

        <TextField
          label="Username"
          value={username}
          onChange={handleUsernameChange}
          fullWidth
          margin="normal"
          helperText={escapeEnabled && "Запрещены символы: ' \" ; - # /* */ ="}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={escapeEnabled}
              onChange={(e) => setEscapeEnabled(e.target.checked)}
              color="primary"
            />
          }
          label="Включить экранирование символов"
          sx={{ mb: 2 }}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />

        <Box sx={{ mt: 2, gap: 2, display: 'flex' }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleLogin(false)}
          >
            Unsafe Login
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={() => handleLogin(true)}
          >
            Safe Login
          </Button>
        </Box>

        {result && (
          <Box sx={{ mt: 3, p: 2, bgcolor: result.error ? '#ffebee' : '#e8f5e9' }}>
            <Typography variant="h6">
              {result.error ? 'Error:' : 'Result:'}
            </Typography>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </Box>
        )}

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Database Contents
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Password</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.password}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
