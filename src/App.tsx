import { useState } from 'react';
import './App.css';
import {
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  List,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { githubService } from './service/github';
import type { User } from './types/user.types';
import MyListItem from './components/MyListItem';
import { RequestError } from 'octokit';

function App() {
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const theme = useTheme();

  async function onSearchClick() {
    setHasSearched(true);
    if (!username) {
      setErrorMessage('Username cannot be empty');
      return;
    }

    setIsLoading(true);
    setUsers([]);
    setErrorMessage('');
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
    } catch (error) {
      console.log('~ ~ error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        setErrorMessage(error.message);
      } else if (error instanceof RequestError) {
        setErrorMessage(`${error.response?.data}`);
      } else {
        // handle all other errors
        setErrorMessage('Unknown error');
      }
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <CssBaseline />
      <div style={{ paddingTop: '1.5rem' }}>
        <Container>
          <Grid container spacing={2} alignItems={'stretch'}>
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
              <Button
                loading={isLoading}
                onClick={onSearchClick}
                fullWidth
                variant='contained'
                sx={{ height: '100%' }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
          {!hasSearched ? (
            ''
          ) : isLoading ? (
            <Typography style={{ paddingTop: '0.5rem', textAlign: 'center' }}>
              <CircularProgress />
            </Typography>
          ) : errorMessage ? (
            <Typography
              style={{ paddingTop: '0.5rem', color: theme.palette.error.main }}
            >
              {errorMessage}
            </Typography>
          ) : !users.length ? (
            <Typography
              style={{ paddingTop: '0.5rem', color: theme.palette.info.main }}
            >
              No user found
            </Typography>
          ) : (
            <List>
              {users.map((user) => (
                <MyListItem user={user} key={user.login} />
              ))}
            </List>
          )}
        </Container>
      </div>
    </>
  );
}

export default App;
