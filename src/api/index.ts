import axios, { AxiosResponse } from 'axios';
import { Kill } from '../LogParser/models';

const constructURL = (path: string): string => {
  const baseURL = window.API_URL;
  return `${baseURL}/${path}`;
};

export const shareSiege = async (params: {
  killFeed: Kill[],
  password: string,
  server: string,
  date: Date
}): Promise<AxiosResponse> => axios.post(constructURL('share'), params);

export const unshareSiege = async (params: {
  siegeId: string,
  password: string
}): Promise<AxiosResponse> => axios.post(constructURL(`unshare/${params.siegeId}`), { password: params.password });

export const getSieges = async (params: {
  server: string,
  date?: Date
}): Promise<AxiosResponse> => {
  const { server, date } = params;

  return axios.get(constructURL('siege?'), { params: { server, date } });
};

export const getSiege = async (siegeId: string): Promise<AxiosResponse> => axios.get(constructURL(`siege/${siegeId}`));
