import axios from 'axios';
import { prop } from 'ramda';

export const fetchGithubUser = async (username: string) => {
  const response = await axios.get(`https://api.github.com/users/${username}`);
  return {
    id: prop('id', response.data),
    login: prop('login', response.data),
    name: prop('name', response.data),
    location: prop('location', response.data),
  };
};
