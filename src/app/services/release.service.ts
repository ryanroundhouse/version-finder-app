import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  addDependencies(
    projectId: string,
    releaseId: string,
    dependencies: Dependency[]
  ): Observable<Dependencies> {
    return this.http.post<Dependencies>(
      `${this.apiUrl}/dependencies/${projectId}/${releaseId}`,
      { dependencies }
    );
  }
}
