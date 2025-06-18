import { Octokit } from 'octokit';

export const githubService = new Octokit({
  auth: import.meta.env.GITHUB_TOKEN,
});
