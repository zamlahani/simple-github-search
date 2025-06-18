import { useState } from 'react';
import './App.css';
import { Button, Container, CssBaseline, Grid, TextField } from '@mui/material';
import { githubService } from './service/github';

interface User {
  login: string;
}

function App() {
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);

  async function onSearchClick() {
    setIsLoading(true);
    try {
      const res = await githubService.request(
        `GET /search/users?q=${encodeURIComponent(username)}&per_page=5`
      );
      setUsers(
        res.data.items.map((val: { login: any }) => ({ login: val.login }))
      );
    } catch (err) {
      console.log('~ ~ err:', err);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <CssBaseline />
      <Container>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <div>
              <TextField
                fullWidth
                id='outlined-basic'
                label='Enter username'
                variant='outlined'
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <div>
              <Button
                loading={isLoading}
                onClick={onSearchClick}
                fullWidth
                variant='contained'
              >
                Search
              </Button>
            </div>
            {users.map((user) => (
              <div key={user.login}>{user.login}</div>
            ))}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;
