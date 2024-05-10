import { Component, OnInit } from '@angular/core';
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

  constructor(private dataService: DataService) {
    this.dataService.getActiveAssociations().subscribe(
      res => {
        console.log(res);
        this.allAssociations = res;
        this.associations = res;
      }
    )
  }

  ngOnInit() {
  }

  filterAssociations(event: any) {
    
    const searchTerm = event.target.value.toLowerCase();
  
    if (!searchTerm) {
      this.associations = this.allAssociations;
    } else {
      this.associations = this.allAssociations.filter(association => 
        association.nom.toLowerCase().includes(searchTerm) ||
        association.categorie.toLowerCase().includes(searchTerm)
      );
    }
  }
  
}