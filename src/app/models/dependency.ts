export interface Dependency {
  project: string;
  release: string;
}

export interface Dependencies {
  [releaseId: string]: Dependency[];
}
