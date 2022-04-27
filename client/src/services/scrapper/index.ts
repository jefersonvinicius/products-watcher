import axios from 'axios';
import { ENV } from 'src/env';
console.log(ENV);
const api = axios.create({
  baseURL: ENV.SERVER_URL,
});

export class ScrapperService {
  static async scrap(url: string) {
    const response = await api.get(`/scrap?url=${url}`);
    return response.data;
  }
}
