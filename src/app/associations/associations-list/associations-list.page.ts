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

  filterAssociations(event: any) {

    const searchTerm = event.target.value.toLowerCase();
  
    if (!searchTerm || searchTerm === '') {
      this.associations = this.allAssociations;
    } else {
      this.associations = this.associations.filter(association => 
        association.nom.toLowerCase().includes(searchTerm) ||
        association.categorie.toLowerCase().includes(searchTerm)
      );
    }
  }

  filterByCategory(): void {
    if (this.selectedCategory && this.selectedCategory !== 'Toutes les associations') {
      this.associations = this.allAssociations.filter(association => association.categorie === this.selectedCategory);
    } else {
      this.associations = this.allAssociations;
    }
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