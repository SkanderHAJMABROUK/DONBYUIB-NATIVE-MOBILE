import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Association } from 'src/app/interfaces/association';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-associations-list',
  templateUrl: './associations-list.page.html',
  styleUrls: ['./associations-list.page.scss'],
})
export class AssociationsListPage implements OnInit {

  associations: Association[] = [];
  allAssociations: Association[] = [];
  selectedCategory = 'Toutes les catégories';
  categories: string[] = ['Toutes les catégories'];
  searchTerm: string = '';

  constructor(private dataService: DataService,
    private router : Router, private route: ActivatedRoute,
    private firestore: AngularFirestore
  ) {
    this.dataService.getActiveAssociations().subscribe(
      res => {
        console.log(res);
        this.allAssociations = res;
        this.associations = res;
      }
    )
  }

  ngOnInit() {
    this.fetchCategories();
  }

  filterAssociations(): void {
    let filtered = this.allAssociations;

    // Apply category filter
    if (this.selectedCategory !== 'Toutes les catégories') {
      filtered = filtered.filter(association => association.categorie === this.selectedCategory);
    }

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(association => 
        association.nom.toLowerCase().includes(this.searchTerm) ||
        association.categorie.toLowerCase().includes(this.searchTerm)
      );
    }

    this.associations = filtered;
  }

  filterByCategory(): void {
    this.filterAssociations();
  }

  filterBySearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterAssociations();
  }

  fetchCategories(): void {
    this.firestore.collection('Categorie').valueChanges()
      .subscribe((categories: any[]) => {
        this.categories.push(...categories.map(category => category.nom));
      });
  }

  goToDetails(id: string) {
    console.log('clicked');
    this.router.navigate([id], { relativeTo: this.route });
  } 
}