import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { Repository, User } from '../types/user.types';
import { useEffect, useState } from 'react';
import { githubService } from '../service/github';

function MyListItem({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [repos, setRepos] = useState<Repository[]>([]);
  async function fetchRepos() {
    setIsLoading(true);
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
    } catch (err) {
      console.log('~ ~ err:', err);
      setRepos([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRepos();
  }, []);

  return (
    <ListItem>
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography>{user.login}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {repos.map((r, i) => (
              <div key={i}>
                <Grid container>
                  <Grid>
                    <b>{r.name}</b>
                  </Grid>
                  <Grid>{r.stargazersCount}</Grid>
                </Grid>
                <div>{r.description}</div>
              </div>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  );
}

export default MyListItem;
