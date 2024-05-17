import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Collecte } from 'src/app/interfaces/collecte';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-collectes-list',
  templateUrl: './collectes-list.page.html',
  styleUrls: ['./collectes-list.page.scss'],
})
export class CollectesListPage implements OnInit {

  collectes: Collecte[] = [];
  allCollectes: Collecte[] = [];
  selectedCollecte!: Collecte | undefined;
  
  selectedAssociation: string = '';
  associations: {id: string, name: string}[] = [];
  searchTerm: string = '';

  constructor(private dataService: DataService,
    private router : Router, private route: ActivatedRoute
  ) {
    this.dataService.getAcceptedCollectes().subscribe(
      res => {
        console.log(res);
        res.sort((a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime());
        this.allCollectes = res;
        this.collectes = res;
      }
    )
  }

  ngOnInit() {
    this.fetchAssociations();
  }

  filterCollectes(): void {
    let filtered = this.allCollectes;
  
    if (this.selectedAssociation && this.selectedAssociation !== '') {
      filtered = filtered.filter(collecte => collecte.id_association === this.selectedAssociation);
    }
  
    if (this.searchTerm) {
      filtered = filtered.filter(collecte => collecte.nom.toLowerCase().includes(this.searchTerm));
    }
  
    this.collectes = filtered;
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

  filterByAssociation(): void {
    this.filterCollectes();
  }

  filterBySearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.filterCollectes();
  }

  goToDetails(id: string) {
    console.log('clicked');
    this.router.navigate([id], { relativeTo: this.route });
  }

  getDaysRemaining(collecte:Collecte) {
    const currentDate = new Date();
    const dateDebut = new Date(collecte.date_debut);
    const dateFin = new Date(collecte.date_fin);
  
    if (currentDate >= dateDebut) {
      const diffInTime = dateFin.getTime() - currentDate.getTime();
      const daysRemaining = Math.ceil(diffInTime / (1000 * 3600 * 24));
      return `Il reste ${daysRemaining} jours.`;
    } else {
      const diffInTime = dateDebut.getTime() - currentDate.getTime();
      const daysUntilStart = Math.ceil(diffInTime / (1000 * 3600 * 24));
      return `Sera lancée dans ${daysUntilStart} jours.`;
    }
  }

  getProgressPercentage(collecte: any): number {
    if (collecte && collecte.montant && collecte.cumul !== undefined) {
      const montant = collecte.montant;
      const cumul = collecte.cumul;
      if (montant > 0) {
        const progress = cumul / montant;
        return progress;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

}