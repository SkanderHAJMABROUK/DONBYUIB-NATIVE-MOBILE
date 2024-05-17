import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Actualite } from 'src/app/interfaces/actualite';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-actualites-list',
  templateUrl: './actualites-list.page.html',
  styleUrls: ['./actualites-list.page.scss'],
})
export class ActualitesListPage implements OnInit {

  actualites: Actualite[] = [];
  allActualites: Actualite[] = [];
  searchTerm: string = '';

  constructor(private dataService: DataService,
    private router : Router, private route: ActivatedRoute,
    private firestore: AngularFirestore
  ) {
    this.dataService.getAcceptedActualites().subscribe(
      res => {
        console.log(res);
        this.allActualites = res;
        this.actualites = res;
      }
    )
  }
  ngOnInit() {
  }

  filterBySearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterAssociations();
  }

  filterAssociations(): void {
    let filtered = this.allActualites;

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(actualite => 
        actualite.titre.toLowerCase().includes(this.searchTerm)
      );
    }

    this.actualites = filtered;
  }

}
