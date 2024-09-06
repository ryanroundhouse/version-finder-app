import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReleaseService } from '../../services/release.service';
import { Release } from '../../models/release';
import { ReleaseItemComponent } from '../release-item/release-item.component';

@Component({
  selector: 'app-product-releases',
  standalone: true,
  imports: [CommonModule, FormsModule, ReleaseItemComponent],
  templateUrl: './product-releases.component.html',
  styleUrl: './product-releases.component.scss',
})
export class ProductReleasesComponent implements OnInit {
  products = ['CIS', 'MC', 'CSR'];
  productReleases: { [key: string]: Release[] } = {};
  filteredReleases: { [key: string]: Release[] } = {};
  filterText: { [key: string]: string } = {};

  constructor(private releaseService: ReleaseService) {}

  ngOnInit() {
    this.fetchReleases();
    this.initializeFilterText();
  }

  initializeFilterText() {
    this.products.forEach((product) => {
      this.filterText[product] = '';
    });
  }

  fetchReleases() {
    this.products.forEach((product) => {
      this.releaseService.getReleases(product).subscribe(
        (releases) => {
          this.productReleases[product] = releases;
          this.filterReleases(product);
        },
        (error) => {
          console.error(`Error fetching releases for ${product}:`, error);
        }
      );
    });
  }

  filterReleases(product: string) {
    this.filteredReleases[product] =
      this.productReleases[product]?.filter((release) =>
        release.name
          .toLowerCase()
          .includes(this.filterText[product].toLowerCase())
      ) || [];
  }
}
