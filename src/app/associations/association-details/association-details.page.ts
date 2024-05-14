import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Association } from 'src/app/interfaces/association';
import { DataService } from 'src/app/services/data.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ToastController } from '@ionic/angular';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-association-details',
  templateUrl: './association-details.page.html',
  styleUrls: ['./association-details.page.scss'],
})
export class AssociationDetailsPage implements OnInit{

  selectedAssociation: Association | undefined;
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

    ngOnInit(event?: any) {
      this.route.params.subscribe(params => {
        this.id = params['id'];
        console.log(this.id);
        this.getAssociationById(this.id);
      });
    
      this.paymentSuccessful = localStorage.getItem('PaymentStatus'); // Retrieve payment status from localStorage
      console.log('oninit' + this.paymentSuccessful);
      this.orderId = localStorage.getItem('orderId') || '';
      console.log('order id', this.orderId);
    
      if (this.paymentSuccessful === 'true') {
        // A payment has been made
        // Refresh the page data
        this.getAssociationById(this.id);
    
        // Reset the payment status
        localStorage.setItem('PaymentStatus', 'false');
      }
    
      // If this is a refresh event, complete it
      if (event) {
        event.target.complete();
      }
    
      // Listen for navigation events
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          if (event.url.includes('/association-details/')) {

            this.getAssociationById(this.id);
          }
        }
      });
    }

  getAssociationById(id: string){
    this.dataService.getAssociationById(id).subscribe({
      next: (data: Association | undefined) => {
        if (data !== undefined) {
          this.selectedAssociation = data; 
          localStorage.setItem('service.showDetails', 'true');
          if (this.orderId) {
            this.getOrderStatus(this.orderId);
          }
        } else {
          console.error('Erreur: Aucune donnée n\'a été renvoyée.');
        }
      },
      error: error => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    });
  }

  updateDonationAmountFromButton(amount: number) {
    this.donationAmount = amount;
  }

  updateDonationAmountFromSlider(event: any) {
    this.donationAmount = event.value;
  }

  initiatePayment(): void {
    const returnUrl = `example://associations-list/${this.id}`;
    const randomIdentifier = Math.random().toString(36).substring(2, 10);
  
    this.paymentService.authorizePayment(randomIdentifier, this.donationAmount, returnUrl)
      .subscribe(response => {     
        window.open(response.formUrl, '_blank'); // Open the payment website in a new tab
        localStorage.setItem('orderId', response.orderId);
        this.orderId = response.orderId;
  
        this.confirmPayment(response.orderId, this.donationAmount);
  
      }, error => {
        console.error('Authorization failed:', error);
      });
  }

  confirmPayment(orderId: string, amount: number): void {
    this.paymentService.confirmPayment(orderId, amount)
      .subscribe(response => {
        if (this.selectedAssociation && this.selectedAssociation.id) {
          console.log('Selected Association:', this.selectedAssociation);
          const date = new Date();
          this.paymentService.addDonAssociation(this.selectedAssociation.id, amount, date, this.donateurId)
            .then(() => {
              console.log('Don ajouté avec succès à la collection DonAssociation');
              this.paymentSuccessful = localStorage.getItem('PaymentStatus')// Retrieve payment status from localStorage
              console.log('confimed '+this.paymentSuccessful)
              console.log('Don ajouté avec succès à la collection');
              window.close();
            })
            .catch(error => {
              console.error('Erreur lors de l\'ajout du don à la collection :', error);
            });      
          } else {
          console.error('Erreur: Aucune association sélectionnée ou ID non défini.');
        }
        console.log('Payment confirmed:', response);
      }, error => {
        // Handle error
        console.error('Confirmation failed:', error);
      });
  }

  getOrderStatus(orderId: string): void {
    this.paymentService.getOrderStatus(orderId)
      .subscribe(response => {
        // Extract order status
        console.log(response);
        this.orderStatus = response.OrderStatus as number;
        console.log('order status in function', this.orderStatus);

        if (this.orderStatus == 2) {
          this.presentToast(`Votre don à ${this.selectedAssociation?.nom} a été transmis avec succès`);
          localStorage.removeItem('orderId');
        } 
      }, error => {
        console.error('Error fetching order status:', error);
      });
  }

  validateDonationAmount() {
    if (this.donationAmount === 0) {
      this.presentToast('Le montant du don ne peut pas être zéro!');
    } else {
      this.initiatePayment();
    }
  }

  showSuccessMessage() {
    if (this.selectedAssociation) {
      const nomAssociation = this.selectedAssociation.nom;
      const imageAssociation = this.selectedAssociation.logo;
  
      this.presentToast(`Votre don à ${nomAssociation} a été transmis avec succès`);
    } else {
      console.log('selectedAssociation is null or undefined');
    };
    localStorage.removeItem('orderId');
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'warning',
    });
    toast.present();
  }
}