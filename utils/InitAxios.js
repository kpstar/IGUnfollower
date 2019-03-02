import axios from 'axios';
import { HOST } from '../constances/Api';

function getUserAgent() {
  return 'Instagram 9.2.0 Android (8.0.0/26; 420dpi; 1794x1080; Android SDK built for x86; Google; google; generic_x86; en_US)'; 
}
export default () => {
  axios.defaults.baseURL = HOST;
  axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  axios.defaults.headers.common['User-Agent'] = getUserAgent();
  axios.defaults.headers.common.Accept = '*/*';
  axios.defaults.headers.common.Cookie2 = '$Version=1';
};
