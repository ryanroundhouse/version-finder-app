export interface Dependency {
  project: string;
  release: string;
  dependencyReleaseId: string;
}

export interface Dependencies {
  [releaseId: string]: Dependency[];
}
