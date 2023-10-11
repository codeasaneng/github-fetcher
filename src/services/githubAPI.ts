import axios from 'axios';
import { prop } from 'ramda';

export interface GithubUser {
  id: number;
  login: string;
  name: string;
  location: string;
}

export interface DbUser {
  id: number;
  github_id: number;
  user_name: string;
  name?: string;
  location?: string;
}

// Fetch a github user by user name (login)
export const fetchGithubUser = async (username: string) => {
  const response = await axios.get(`https://api.github.com/users/${username}`);
  return {
    id: prop('id', response.data),
    login: prop('login', response.data),
    name: prop('name', response.data),
    location: prop('location', response.data),
  };
};

// Fetch an user languages
export const fetchUserLanguages = async (username: string) => {
  const repos = await axios.get(`https://api.github.com/users/${username}/repos`);
  const languages: string[] = repos.data.map((repo: any) => repo.language);
  return Array.from(new Set(languages));
};
