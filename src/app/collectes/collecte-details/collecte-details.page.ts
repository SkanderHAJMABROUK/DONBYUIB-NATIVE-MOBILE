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
  amountLeft: number= 0;
  associationName: string | undefined;
  totalDonationAmount: number = 0;

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
        this.getCollecteById(this.id);
      });
    
      this.paymentSuccessful = localStorage.getItem('PaymentStatus'); // Retrieve payment status from localStorage
      console.log('oninit' + this.paymentSuccessful);
      this.orderId = localStorage.getItem('orderId') || '';
      console.log('order id', this.orderId);
    
      if (event) {
        event.target.complete();
      }
    
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          if (event.url.includes('/association-details/')) {

            this.getCollecteById(this.id);
          }
        }
      });
      
     this.getProgressPercentage();
     this.fetchTotalDonationAmount();

     this.orderId = localStorage.getItem('order-Id') || '';
     console.log('order id',this.orderId);
    }

  getCollecteById(id: string){
    this.dataService.getCollecteById(id).subscribe({
      next: (data: Collecte | undefined) => {
        if (data !== undefined) {
          this.selectedCollecte = data; 
          this.loadAssociationName();

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
    const returnUrl = `example1://collectes-list/${this.id}`;
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
        if (this.selectedCollecte && this.selectedCollecte.id) {
          console.log('Selected Association:', this.selectedCollecte);
          const date = new Date();
          this.paymentService.addDonCollecte(this.selectedCollecte.id, amount, date, this.donateurId)
            .then(() => {
              console.log('Don ajouté avec succès à la collection DonCollecte');
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
          this.presentToast(`Votre don à ${this.selectedCollecte?.nom} a été transmis avec succès`);
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
    if (this.selectedCollecte) {
      const nomAssociation = this.selectedCollecte.nom;

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

  loadAssociationName() {
    console.log('Loading association name...');
    console.log('Selected collecte:', this.selectedCollecte);
    if (this.selectedCollecte && this.selectedCollecte.id_association) {
      console.log('Selected collecte and association ID are defined.');
      console.log('Association ID:', this.selectedCollecte.id_association);
      this.dataService.getAssociationNameById(this.selectedCollecte.id_association)
        .subscribe(name => {
          console.log('Association name received from service:', name);
          if (name) {
            this.associationName = name;
            console.log('Association name:', this.associationName);
          } else {
            this.associationName = 'Default Association Name';
            console.log('Association name set to default:', this.associationName);
          }
        });
    } else {
      console.log('Selected collecte or association ID is undefined.');
    }
  }

  getTimeRemaining(endDate: Date): string {
    const now = new Date();
    const endTime = new Date(endDate);
    const timeDiff = endTime.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
    if (daysRemaining <= 0) {
      return 'Terminée';
    } else if (daysRemaining === 1) {
      return '1 jour restant';
    } else {
      return daysRemaining + ' jours restants';
    }
  }

  getProgressPercentage(): number {
    if (this.selectedCollecte && this.selectedCollecte.montant && this.selectedCollecte.cumul !== undefined) {
      const montant = this.selectedCollecte.montant;
      const cumul = this.selectedCollecte.cumul;
      if (montant > 0) {
        return (cumul / montant);
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  getAmountLeft(): number {
    if (this.selectedCollecte) {
      return (this.selectedCollecte.montant - this.selectedCollecte.cumul);
    } else { 
      console.log('Erreur');
    }
    return 0;
  }

  goToAssociationDetails(id: string) {
    console.log('clicked');
    this.router.navigate([id], { relativeTo: this.route });
  }

  fetchTotalDonationAmount(): void {
    this.paymentService.getTotalDonationAmountForCollecte(this.id)
      .subscribe(totalAmount => {
        this.totalDonationAmount = totalAmount;
        console.log('Total donation amount:', totalAmount);
        this.amountLeft = this.getAmountLeft();
        console.log('amount left', this.amountLeft);
        
  
      }, error => {
        console.error('Error fetching total donation amount:', error);
      });
  }

}
