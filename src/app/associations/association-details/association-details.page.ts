import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Association } from 'src/app/interfaces/association';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-association-details',
  templateUrl: './association-details.page.html',
  styleUrls: ['./association-details.page.scss'],
})
export class AssociationDetailsPage implements OnInit {

  selectedAssociation: Association | undefined;

  constructor(private dataService:DataService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      const id = params['id'];
      console.log(id);
      this.dataService.getAssociationById(id).subscribe(
        res=>{
          console.log(res);
          this.selectedAssociation = res;
        }
      )
    })
  }

}
