import { Component, Input, OnInit } from '@angular/core';
import { Release } from '../../models/release';
import { Dependency } from '../../models/dependency';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReleaseService } from '../../services/release.service';

@Component({
  selector: 'app-release-item',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './release-item.component.html',
  styleUrl: './release-item.component.scss',
})
export class ReleaseItemComponent implements OnInit {
  @Input() release!: Release;
  @Input() product!: string;
  @Input() products: string[] = [];
  dependencies: Dependency[] = [];
  selectedProduct: string = '';
  selectedRelease: string = '';
  productReleases: Release[] = [];

  constructor(private releaseService: ReleaseService) {}

  ngOnInit() {
    this.releaseService
      .getDependenciesByRelease(this.product, this.release.id)
      .subscribe(
        (dependencies) => (this.dependencies = dependencies),
        (error) => console.error('Error fetching dependencies:', error)
      );
  }

  onProductSelect() {
    if (this.selectedProduct) {
      this.releaseService.getReleases(this.selectedProduct).subscribe(
        (releases) => {
          this.productReleases = releases;
          this.selectedRelease = '';
        },
        (error) => console.error('Error fetching releases:', error)
      );
    } else {
      this.productReleases = [];
      this.selectedRelease = '';
    }
  }

  addDependency() {
    if (this.selectedProduct && this.selectedRelease) {
      const selectedReleaseObj = this.productReleases.find(
        (r) => r.id === this.selectedRelease
      );
      const newDependency: Dependency = {
        project: this.selectedProduct,
        version: selectedReleaseObj ? selectedReleaseObj.name : 'latest',
        dependencyReleaseId: this.selectedRelease,
      };
      this.releaseService
        .addDependency(this.product, this.release.id, newDependency)
        .subscribe(
          () => {
            this.dependencies.push(newDependency);
            this.selectedProduct = '';
            this.selectedRelease = '';
            this.productReleases = [];
          },
          (error) => console.error('Error adding dependency:', error)
        );
    }
  }

  removeDependency(dependency: Dependency) {
    this.releaseService
      .removeDependency(this.product, this.release.id, dependency)
      .subscribe(
        () => {
          this.dependencies = this.dependencies.filter(
            (dep) =>
              dep.project !== dependency.project ||
              dep.version !== dependency.version
          );
        },
        (error) => console.error('Error removing dependency:', error)
      );
  }
}
