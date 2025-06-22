import { useState } from 'react';
import './App.css';
import {
  Button,
  Container,
  CssBaseline,
  Grid,
  List,
  TextField,
} from '@mui/material';
import { githubService } from './service/github';
import type { User } from './types/user.types';
import MyListItem from './components/MyListItem';

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
      console.log('~ ~ res.data:', res.data);
      const newUsers: User[] = res.data.items.map(
        (val: any): User => ({
          login: val.login,
          reposUrl: val.repos_url,
        })
      );
      setUsers(newUsers);
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
          </Grid>
        </Grid>
        <List>
          {users.map((user) => (
            <MyListItem user={user} key={user.login} />
          ))}
        </List>
      </Container>
    </>
  );
}

export default App;
