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
  filteredProducts: { [key: string]: Release[] } = {};
  dependencies: { [projectId: string]: Dependencies } = {};
  newDependency: { [key: string]: Dependency } = {};
  filterText: { [key: string]: string } = {};

  constructor(private releaseService: ReleaseService) {}

  ngOnInit() {
    this.loadReleases();
    this.loadDependencies();
    this.initializeFilterText();
  }

  initializeFilterText() {
    this.projectIds.forEach((projectId) => {
      this.filterText[projectId] = '';
    });
  }

  loadReleases() {
    this.projectIds.forEach((projectId) => {
      this.releaseService.getReleases(projectId).subscribe((releases) => {
        this.products[projectId] = releases;
        this.filteredProducts[projectId] = releases; // Initialize filtered products
        // Initialize newDependency for each release
        releases.forEach((release) => {
          if (!this.newDependency[release.id]) {
            this.newDependency[release.id] = { project: '', release: '' };
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
    if (newDep && newDep.project && newDep.release) {
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
          this.newDependency[releaseId] = { project: '', release: '' };
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

  filterReleases(projectId: string) {
    const filterValue = this.filterText[projectId].toLowerCase();
    this.filteredProducts[projectId] = this.products[projectId].filter(
      (release) =>
        release.name.toLowerCase().includes(filterValue) ||
        release.description.toLowerCase().includes(filterValue) ||
        release.releaseDate.toLowerCase().includes(filterValue)
    );
  }
}
