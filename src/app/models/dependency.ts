export interface Dependency {
  project: string;
  version: string;
  dependencyReleaseId: string;
}

export interface Dependencies {
  [releaseId: string]: Dependency[];
}
