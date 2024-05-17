import { Component, Input, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { Association } from '../interfaces/association';
import { Actualite } from '../interfaces/actualite';
import { Collecte } from '../interfaces/collecte';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  collectes:Collecte[]=[];
  associations:Association[]=[];
  actualites:Actualite[]=[];

  constructor(private dataService : DataService,
    private router : Router, private route: ActivatedRoute
  ) {
    this.dataService.getActiveAssociations().subscribe(
      res => {console.log(res);
      this.associations=res}
    )
    this.dataService.getAcceptedActualites().subscribe(
      res => {console.log(res);
      this.actualites=res}
    )
    this.dataService.getAcceptedCollectes().subscribe(
      res => this.collectes=res
    )
  }

  goToAssociationDetails(id: string) {
    console.log('clicked');
    this.router.navigate([id], { relativeTo: this.route });
  }

}
