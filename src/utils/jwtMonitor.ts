import config from '../config';
import {authService} from '../services/AuthService';

let jwt = require('jsonwebtoken');

export async function jwtMonitor(onFailed?: () => void): Promise<string> {
  const accessToken: string | null = localStorage.getItem('access_token');
  if (!accessToken) return '';
  let decode = jwt.decode(accessToken);
  if (!decode) {
    return ''
  }
  if (Date.now() - decode.exp * 1000 <= config.jwtRefreshThreshold) {
    return accessToken;
  } else {
    const refresh = await authService.refresh();
    if (refresh)
      return localStorage.getItem('access_token') || '';
    // 刷新失败
    localStorage.removeItem('access_token');
    if (onFailed) onFailed();
    return '';
  }
}

export let monitorId: number = 0;

export function setMonitorId(value: number) {
  monitorId = value;
}