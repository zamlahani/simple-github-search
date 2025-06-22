export interface User {
  login: string;
  reposUrl: string;
}

export interface Repository {
  name: string;
  description: string;
  stargazersCount: number;
}
