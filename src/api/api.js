import axios from 'axios';
import { API_URL } from '../config';

const axiosConfig = {};

export const getMainSlider = async () => {
  const data = await axios.get(`${API_URL}/main-slider?populate=deep`, axiosConfig);
  return data.data.data;
};
