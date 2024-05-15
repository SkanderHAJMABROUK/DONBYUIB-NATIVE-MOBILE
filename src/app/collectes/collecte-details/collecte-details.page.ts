import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Collecte } from 'src/app/interfaces/collecte';

@Component({
  selector: 'app-collecte-details',
  templateUrl: './collecte-details.page.html',
  styleUrls: ['./collecte-details.page.scss'],
})
export class CollecteDetailsPage implements OnInit {

  selectedCollecte: Collecte | undefined;
  donationAmount: number = 0;
  paymentSuccessful!: string|null;
  orderId: string = ''; 
  orderStatus: number = 0;
  donateurId: string= '';
  id!: string;
  value = 0;

  constructor(private dataService:DataService, 
    private route:ActivatedRoute, 
    private paymentService: PaymentService,
    public router:Router,
    public toastController: ToastController,
    private platform: Platform) { }

  
  ngOnInit() {
  }

}
