import { render, screen, waitFor } from '@testing-library/react';
import MyListItem from './MyListItem';
import { vi } from 'vitest';
import { githubService } from '../service/github';
import type { OctokitResponse } from '../types/octokit.types';
import type { User } from '../types/user.types';

vi.mock('../service/github');
const mockedRequest = vi.mocked(githubService.request);

const mockUser: User = {
  login: 'octocat',
  reposUrl: 'https://api.github.com/users/octocat/repos',
};

describe('MyListItem', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('renders loading state then repositories', async () => {
    mockedRequest.mockResolvedValue({
      data: [
        { name: 'repo1', description: 'desc 1', stargazers_count: 42 },
        { name: 'repo2', description: null, stargazers_count: 0 },
      ],
    } as Partial<OctokitResponse<any, number>> as OctokitResponse<any, number>);

    render(<MyListItem user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText('repo1')).toBeInTheDocument();
      expect(screen.getByText('desc 1')).toBeInTheDocument();
      expect(screen.getByText('repo2')).toBeInTheDocument();
      expect(screen.getByText('No description')).toBeInTheDocument();
    });
  });

  it('renders error state when API fails', async () => {
    mockedRequest.mockRejectedValue(new Error('Failed to load'));

    render(<MyListItem user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
    });
  });

  it('renders fallback when no repos found', async () => {
    mockedRequest.mockResolvedValue({
      data: [],
    } as Partial<OctokitResponse<any, number>> as OctokitResponse<any, number>);

    render(<MyListItem user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText(/no repository found/i)).toBeInTheDocument();
    });
  });
});
