import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { githubService } from './service/github';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import type { OctokitResponse } from './types/octokit.types';

vi.mock('./service/github');

const mockedRequest = vi.mocked(githubService.request);

describe('App', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('renders input and search button', () => {
    render(<App />);
    expect(screen.getByLabelText(/enter username/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('calls GitHub API and renders users', async () => {
    const mockResponse: Partial<OctokitResponse<any, number>> = {
      data: {
        items: [
          {
            login: 'torvalds',
            repos_url: 'https://api.github.com/users/torvalds/repos',
          },
        ],
      },
      status: 200,
      headers: {},
      url: '',
    };

    mockedRequest.mockResolvedValue(
      mockResponse as OctokitResponse<any, number>
    );

    render(<App />);
    fireEvent.change(screen.getByLabelText(/enter username/i), {
      target: { value: 'torvalds' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText('torvalds')).toBeInTheDocument();
  });

  it('shows error message on API failure', async () => {
    mockedRequest.mockRejectedValue(new Error('API Error'));

    render(<App />);
    fireEvent.change(screen.getByLabelText(/enter username/i), {
      target: { value: 'failuser' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText(/api error/i)).toBeInTheDocument();
  });
});
