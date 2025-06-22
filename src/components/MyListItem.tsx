import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Grid,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { Repository, User } from '../types/user.types';
import { useEffect, useState } from 'react';
import { githubService } from '../service/github';
import { Star } from '@mui/icons-material';
import { RequestError } from 'octokit';

function MyListItem({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const theme = useTheme();

  async function fetchRepos() {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await githubService.request(`GET /users/${user.login}/repos`);
      console.log('repos of:', user.login);
      console.log('~ ~ res.data:', res.data);
      const newRepos: Repository[] = res.data.map(
        (r: {
          name: any;
          description: any;
          stargazers_count: any;
        }): Repository => ({
          name: r.name,
          description: r.description,
          stargazersCount: r.stargazers_count,
        })
      );
      setRepos(newRepos);
    } catch (err: unknown) {
      if (err instanceof RequestError) {
        console.error(`GitHub API error (${err.status}):`, err.message);
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Unexpected error');
        console.error('Unexpected error:', err);
      }
      setRepos([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRepos();
  }, []);

  return (
    <ListItem sx={{ width: '100%', display: 'block' }} disableGutters>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          sx={{ background: theme.palette.grey[300] }}
        >
          <Typography>{user.login}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: '1rem' }}>
          <Grid container direction={'column'} gap={2}>
            {isLoading ? (
              <div style={{ textAlign: 'center' }}>
                <CircularProgress />
              </div>
            ) : errorMessage ? (
              <Typography
                style={{
                  paddingTop: '0.5rem',
                  color: theme.palette.error.main,
                }}
              >
                {errorMessage}
              </Typography>
            ) : repos.length ? (
              repos.map((r) => (
                <Grid
                  key={r.name}
                  sx={{
                    background: theme.palette.grey[500],
                    padding: '0.5rem',
                  }}
                >
                  <Grid container justifyContent={'space-between'}>
                    <Grid>
                      <b style={{ fontSize: '1.2rem' }}>{r.name}</b>
                    </Grid>
                    <Grid>
                      <Stack direction='row' alignItems='center' spacing={0.5}>
                        <Typography>{r.stargazersCount}</Typography>
                        <Star fontSize='small' />
                      </Stack>
                    </Grid>
                  </Grid>
                  <div>{r.description ?? <i> No description</i>}</div>
                </Grid>
              ))
            ) : (
              <i>No repository found</i>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
}

export default MyListItem;
