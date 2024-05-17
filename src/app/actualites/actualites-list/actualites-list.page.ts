import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Actualite } from 'src/app/interfaces/actualite';
import { DataService } from 'src/app/services/data.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-actualites-list',
  templateUrl: './actualites-list.page.html',
  styleUrls: ['./actualites-list.page.scss'],
})
export class ActualitesListPage implements OnInit {

  actualites: Actualite[] = [];
  allActualites: Actualite[] = [];
  searchTerm: string = '';
  selectedAssociation: string = '';
  associations: {id: string, name: string}[] = [];
  associationNames: { [id: string]: string } = {};

  constructor(private dataService: DataService,
    private router : Router, private route: ActivatedRoute,
    private firestore: AngularFirestore
  ) {
    this.dataService.getAcceptedActualites().subscribe(
      res => {
        console.log(res);
        this.allActualites = res;
        this.actualites = res;

        // Fetch the association names for all actualites
        res.forEach(actualite => {
          if (actualite.id_association) {
            this.dataService.getAssociationNameById(actualite.id_association).subscribe(
              associationName => {
                if (actualite.id_association && associationName) {
                  this.associationNames[actualite.id_association] = associationName;
                }
              }
            );
          }
        });
      }
    )
  }
  ngOnInit() {
    this.fetchAssociations();
  }

  filterBySearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterActualites();
  }

  filterByAssociation(): void {
    this.filterActualites();
  }

  filterActualites(): void {
    let filtered = this.allActualites;

    if (this.selectedAssociation && this.selectedAssociation !== '') {
      filtered = filtered.filter(actualite => actualite.id_association === this.selectedAssociation);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(actualite => 
        actualite.titre.toLowerCase().includes(this.searchTerm)
      );
    }

    this.actualites = filtered;
  }

  fetchAssociations(): void {
    this.associations.push({id: '', name: 'Toutes les associations'});
    this.dataService.getActiveAssociations().subscribe(associations => {
      associations.forEach(association => {
        if (association.id) {
          this.dataService.getAssociationNameById(association.id).subscribe(associationName => {
            console.log('Association name:', associationName);
            if (association.id && associationName) {
              this.associations.push({id: association.id, name: associationName});
            }
          });
        }
      });
    });
  }

  @HostListener('swipeleft', ['$event']) public onSwipeLeft() {
    this.router.navigate(['../']);  // navigate back
  }
}