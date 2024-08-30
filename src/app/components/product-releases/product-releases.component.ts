import { Component, OnInit } from '@angular/core';
import { KeyValuePipe, NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dependencies, Dependency } from '../../models/dependency';
import { Release } from '../../models/release';
import { ReleaseService } from '../../services/release.service';

@Component({
  selector: 'app-product-releases',
  templateUrl: './product-releases.component.html',
  styleUrls: ['./product-releases.component.scss'],
  imports: [KeyValuePipe, NgFor, NgIf, DatePipe, FormsModule],
  standalone: true,
})
export class ProductReleasesComponent implements OnInit {
  projectIds = ['CIS', 'MC', 'CC', 'NSBL', 'PUBS'];
  products: { [key: string]: Release[] } = {};
  dependencies: { [projectId: string]: Dependencies } = {};
  newDependency: { [key: string]: Dependency } = {};

  constructor(private releaseService: ReleaseService) {}

  ngOnInit() {
    this.loadReleases();
    this.loadDependencies();
  }

  loadReleases() {
    this.projectIds.forEach((projectId) => {
      this.releaseService.getReleases(projectId).subscribe((releases) => {
        this.products[projectId] = releases;
        // Initialize newDependency for each release
        releases.forEach((release) => {
          if (!this.newDependency[release.id]) {
            this.newDependency[release.id] = {
              project: '',
              release: '',
              dependencyReleaseId: '',
            };
          }
        });
        console.log(`Releases for ${projectId}:`, releases);
      });
    });
  }

  loadDependencies() {
    this.projectIds.forEach((projectId) => {
      this.releaseService.getDependencies(projectId).subscribe((deps) => {
        this.dependencies[projectId] = deps;
      });
    });
  }

  addDependency(projectId: string, releaseId: string) {
    const newDep = this.newDependency[releaseId];
    if (newDep && newDep.project && newDep.dependencyReleaseId) {
      newDep.release =
        this.products[newDep.project]?.find(
          (release) => release.id === newDep.dependencyReleaseId
        )?.name || '';
      const currentDeps = this.dependencies[projectId][releaseId] || [];
      const updatedDeps = [...currentDeps, newDep];

      this.releaseService
        .addDependencies(projectId, releaseId, updatedDeps)
        .subscribe((updatedDependencies) => {
          // Update the entire dependencies object for the project
          this.dependencies[projectId] = updatedDependencies;

          // Ensure the specific release's dependencies are updated
          if (!this.dependencies[projectId][releaseId]) {
            this.dependencies[projectId][releaseId] = [];
          }
          this.dependencies[projectId][releaseId] = updatedDeps;
          // Reset the form
          this.newDependency[releaseId] = {
            project: '',
            release: '',
            dependencyReleaseId: '',
          };
        });
    }
  }

  removeDependency(
    projectId: string,
    releaseId: string,
    dependencyToRemove: Dependency
  ) {
    console.log(
      `Removing dependency for project ${projectId}, release ${releaseId}`
    );
    console.log('Dependency to remove:', dependencyToRemove);

    const currentDeps = this.dependencies[projectId][releaseId] || [];
    console.log('Current dependencies:', currentDeps);

    const updatedDeps = currentDeps.filter(
      (dep) =>
        dep.project !== dependencyToRemove.project ||
        dep.release !== dependencyToRemove.release
    );
    console.log('Updated dependencies after removal:', updatedDeps);

    this.releaseService
      .addDependencies(projectId, releaseId, updatedDeps)
      .subscribe((updatedDependencies) => {
        console.log('Response from addDependencies:', updatedDependencies);

        // Update the entire dependencies object for the project
        this.dependencies[projectId] = updatedDependencies;
        console.log(
          `Updated dependencies for project ${projectId}:`,
          this.dependencies[projectId]
        );

        // Ensure the specific release's dependencies are updated
        if (!this.dependencies[projectId][releaseId]) {
          this.dependencies[projectId][releaseId] = [];
        }
        this.dependencies[projectId][releaseId] = updatedDeps;
        console.log(
          `Final updated dependencies for release ${releaseId}:`,
          this.dependencies[projectId][releaseId]
        );
      });
  }
}
