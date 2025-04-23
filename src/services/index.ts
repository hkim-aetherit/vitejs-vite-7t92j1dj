import { IService } from './types';
import { serverService } from './server';

// Export the server service implementation
export const service: IService = serverService;