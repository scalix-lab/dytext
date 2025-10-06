import { DytextService } from './dytextService';

export async function initDytextService(dytextClientToken: string) {
  const service = DytextService.getInstance();
  return service.initialize(dytextClientToken);
}
