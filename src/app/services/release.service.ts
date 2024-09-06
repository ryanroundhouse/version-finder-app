import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Release } from '../models/release';
import { Dependency, Dependencies } from '../models/dependency';

@Injectable({
  providedIn: 'root',
})
export class ReleaseService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getReleases(projectId: string): Observable<Release[]> {
    return this.http.get<Release[]>(`${this.apiUrl}/releases/${projectId}`);
  }

  getDependencies(projectId: string): Observable<Dependencies> {
    return this.http.get<Dependencies>(
      `${this.apiUrl}/dependencies/${projectId}`
    );
  }

  getDependenciesByRelease(
    projectId: string,
    releaseId: string
  ): Observable<Dependency[]> {
    return this.getDependencies(projectId).pipe(
      map((dependencies) => dependencies[releaseId] || [])
    );
  }

  addDependency(
    projectId: string,
    releaseId: string,
    dependency: Dependency
  ): Observable<Dependencies> {
    return this.getDependencies(projectId).pipe(
      switchMap((dependencies) => {
        const releaseDependencies = dependencies[releaseId] || [];
        if (
          !releaseDependencies.some(
            (dep) =>
              dep.project === dependency.project &&
              dep.version === dependency.version
          )
        ) {
          releaseDependencies.push(dependency);
          return this.http.post<Dependencies>(
            `${this.apiUrl}/dependencies/${projectId}/${releaseId}`,
            { dependencies: releaseDependencies }
          );
        }
        return this.getDependencies(projectId);
      })
    );
  }

  removeDependency(
    projectId: string,
    releaseId: string,
    dependency: Dependency
  ): Observable<Dependencies> {
    return this.getDependencies(projectId).pipe(
      switchMap((dependencies) => {
        const releaseDependencies = dependencies[releaseId] || [];
        const updatedDependencies = releaseDependencies.filter(
          (dep) =>
            dep.project !== dependency.project ||
            dep.version !== dependency.version
        );
        if (updatedDependencies.length !== releaseDependencies.length) {
          return this.http.post<Dependencies>(
            `${this.apiUrl}/dependencies/${projectId}/${releaseId}`,
            { dependencies: updatedDependencies }
          );
        }
        return this.getDependencies(projectId);
      })
    );
  }
}
