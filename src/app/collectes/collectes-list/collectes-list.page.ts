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
  selectedCollecte!: Collecte |undefined; 

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

  selectedAssociation: string='Toutes les associations';
  associations: any[] = []; // Replace with your actual associations

  filterByAssociation(): void {
    if (this.selectedAssociation) {
      this.collectes = this.collectes.filter(collecte => collecte.id_association === this.selectedAssociation);
    } else {
      // Reset the collectes to the original list if no association is selected
      this.collectes = this.allCollectes;
    }
  }

  fetchAssociations(): void {
    this.dataService.getActiveAssociations().subscribe(associations => {
      this.associations = associations.map(association => {
        if (association.id) {
          return {
            id: association.id,
            nom: this.dataService.getAssociationNameById(association.id)
          };
        } else {
          return {
            id: 'unknown',
            nom: 'Unknown Association'
          };
        }
      });
    });
  }

  filterCollectes(event: any) {

    const searchTerm = event.target.value.toLowerCase();
  
    if (!searchTerm) {
      this.collectes = this.allCollectes;
    } else {
      this.collectes = this.allCollectes.filter(collecte => 
        collecte.nom.toLowerCase().includes(searchTerm)
      );
    }
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
      // If date_debut has already passed, calculate the number of days until date_fin
      const diffInTime = dateFin.getTime() - currentDate.getTime();
      const daysRemaining = Math.ceil(diffInTime / (1000 * 3600 * 24));
      return `Il reste ${daysRemaining} jours.`;
    } else {
      // If date_debut hasn't passed yet, calculate the number of days until date_debut
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
