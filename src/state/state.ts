/**
 * Library state structure - used by StateManager
 */
export interface LibraryState {
  initialized: boolean;
  dytextClientToken?: string;
  projectId?: string;
  token?: string;
}
