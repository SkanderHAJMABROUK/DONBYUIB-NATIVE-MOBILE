import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actualite } from 'src/app/interfaces/actualite';
import { Association } from 'src/app/interfaces/association';
import { Collecte } from 'src/app/interfaces/collecte';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-recherche',
  templateUrl: './recherche.page.html',
  styleUrls: ['./recherche.page.scss'],
})
export class RecherchePage implements OnInit {

  constructor(private dataService: DataService,
    private router : Router, 
    private route: ActivatedRoute) {
    this.dataService.getAcceptedCollectes().subscribe(
      res => {
        console.log(res);
        res.sort((a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime());
        this.collectes = res;
        // this.filteredCollectes = res;
      });
      this.dataService.getActiveAssociations().subscribe(
        res => {
          console.log(res);
          this.associations = res;
          // this.filteredAssociations = res;
        });
        this.dataService.getAcceptedActualites().subscribe(
          res => {
            console.log(res);
            res.sort((a, b) => new Date(b.date_publication).getTime() - new Date(a.date_publication).getTime());
            this.actualites = res;
            // this.filteredActualites = res;
          });
     }

  ngOnInit() {
  }


  searchTerm: string = '';
  collectes: Collecte[] = [];
  associations: Association[] = [];
  actualites: Actualite[] = [];
  filteredAssociations: Association[] = [];
  filteredCollectes: Collecte[] = [];
  filteredActualites: Actualite[] = [];

  filterData(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredAssociations = [];
      this.filteredCollectes = [];
      this.filteredActualites = [];
    } else {
      this.filteredAssociations = this.associations.filter(association => 
        association.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  
      this.filteredCollectes = this.collectes.filter(collecte => 
        collecte.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  
      this.filteredActualites = this.actualites.filter(actualite => 
        actualite.titre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
  }
  goToAssociationDetails(id: string) {
    console.log('clicked');
    this.router.navigate(['recherche', 'association', id]);
  }
  
  goToCollecteDetails(id: string) {
    console.log('clicked');
    this.router.navigate(['recherche', 'collecte', id]);
  }

}
