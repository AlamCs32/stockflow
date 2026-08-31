export interface Item {
  id: number;
  name: string;
}

export interface ApiResponse<T> {
  data: T;
}

export const APP_NAME = 'StockFlow';
export const API_PREFIX = '/api';
