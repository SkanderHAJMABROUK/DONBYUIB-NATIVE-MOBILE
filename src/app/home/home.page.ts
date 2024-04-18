import { Component, Input, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { Association } from '../interfaces/association';
import { Actualite } from '../interfaces/actualite';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  associations:Association[]=[];
  // actualites:Actualite[]=[];
  @Input() actualites: Actualite[]=[]

  constructor(private dataService : DataService) {
    this.dataService.getActiveAssociations().subscribe(
      res => {console.log(res);
      this.associations=res}
    )
    this.dataService.getAcceptedActualites().subscribe(
      res => {console.log(res);
      this.actualites=res}
    )
  }



}
