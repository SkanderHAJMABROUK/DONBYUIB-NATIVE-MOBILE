import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Association } from 'src/app/interfaces/association';
import { DataService } from 'src/app/services/data.service';
import { PaymentService } from 'src/app/services/payment.service';
import { HostListener } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-association-details',
  templateUrl: './association-details.page.html',
  styleUrls: ['./association-details.page.scss'],
})
export class AssociationDetailsPage implements OnInit {

  selectedAssociation: Association | undefined;
  donationAmount: number = 0;
  paymentSuccessful!: string | null;
  orderId: string = ''; 
  orderStatus: number = 0;
  donateurId: string = '';
  id!: string;
  value = 0;

  constructor(
    private dataService: DataService, 
    private route: ActivatedRoute, 
    private paymentService: PaymentService,
    public router: Router,
    private localNotifications: LocalNotifications,
    public toastController: ToastController
  ) {}

  ionViewDidEnter() {
    const orderId = localStorage.getItem('orderId');
    if (orderId) {
      this.checkPaymentStatus();
    }
  }

  ngOnInit(event?: any) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id);
      this.getAssociationById(this.id);
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('/association-details/')) {
          this.getAssociationById(this.id);
          this.checkPaymentStatus();  // New method to handle payment status check
        }
      }
    });

    if (event) {
      event.target.complete();
    }
  }


  getAssociationById(id: string) {
    this.dataService.getAssociationById(id).subscribe({
      next: (data: Association | undefined) => {
        if (data !== undefined) {
          this.selectedAssociation = data; 
          localStorage.setItem('service.showDetails', 'true');
          this.checkPaymentStatus();
        } else {
          console.error('Erreur: Aucune donnée n\'a été renvoyée.');
        }
      },
      error: error => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    });
  }

  checkPaymentStatus() {

    this.paymentSuccessful = localStorage.getItem('PaymentStatus');
    console.log('oninit' + this.paymentSuccessful);
    this.orderId = localStorage.getItem('orderId') || '';
    console.log('order id', this.orderId);

    if (this.orderId) {
      this.getOrderStatus(this.orderId);
    }
  }

  getOrderStatus(orderId: string): void {
    
    this.paymentService.getOrderStatus(orderId).subscribe(response => {
      console.log(response);
      this.orderStatus = response.OrderStatus as number;
      console.log('order status in function', this.orderStatus);

      if (this.orderStatus === 2) {
        this.presentNotification(`Votre don à ${this.selectedAssociation?.nom} a été transmis avec succès`);
        localStorage.removeItem('orderId');
      }

      this.orderStatus = 0;

    }, error => {
      console.error('Error fetching order status:', error);
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

    this.paymentService.authorizePayment(randomIdentifier, this.donationAmount, returnUrl).subscribe(response => {
      window.open(response.formUrl, '_blank'); // Open the payment website in a new tab
      localStorage.setItem('orderId', response.orderId);
      this.orderId = response.orderId;

      this.confirmPayment(response.orderId, this.donationAmount);
    }, error => {
      console.error('Authorization failed:', error);
    });
  }

  confirmPayment(orderId: string, amount: number): void {
    this.paymentService.confirmPayment(orderId, amount).subscribe(response => {
      if (this.selectedAssociation && this.selectedAssociation.id) {
        console.log('Selected Association:', this.selectedAssociation);
        const date = new Date();
        this.paymentService.addDonAssociation(this.selectedAssociation.id, amount, date, this.donateurId)
          .then(() => {
            console.log('Don ajouté avec succès à la collection DonAssociation');
            this.paymentSuccessful = localStorage.getItem('PaymentStatus');
            console.log('confimed ' + this.paymentSuccessful);
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
      console.error('Confirmation failed:', error);
    });
  }

  validateDonationAmount() {
    if (this.donationAmount === 0) {
      this.presentNotification('Le montant du don ne peut pas être zéro!');
    } else {
      this.initiatePayment();
    }
  }

  async presentNotification(message: string) {
    this.localNotifications.schedule({
      id: 1,
      text: message,
      sound: 'file://sound.mp3',
      data: { secret: 'key_data' }
    });
  }

  @HostListener('swipeleft', ['$event']) public onSwipeLeft() {
    this.router.navigate(['../']);  // navigate back
  }
}