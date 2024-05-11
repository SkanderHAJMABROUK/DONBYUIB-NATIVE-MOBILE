import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Association } from 'src/app/interfaces/association';
import { DataService } from 'src/app/services/data.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-association-details',
  templateUrl: './association-details.page.html',
  styleUrls: ['./association-details.page.scss'],
})
export class AssociationDetailsPage implements OnInit {

  selectedAssociation: Association | undefined;
  donationAmount: number = 0;
  paymentSuccessful!: string|null;
  orderId: string = ''; 
  orderStatus: number = 0;
  donateurId!: string;
  id!: string;
  value = 0;

  constructor(private dataService:DataService, 
    private route:ActivatedRoute, 
    private paymentService: PaymentService,
    public router:Router,
    public popoverController: PopoverController) { }

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
    }); 

     this.paymentSuccessful = localStorage.getItem('PaymentStatus')// Retrieve payment status from localStorage
     console.log('oninit'+this.paymentSuccessful)
     this.orderId = localStorage.getItem('orderId') || '';
     console.log('order id',this.orderId);

  }

  updateDonationAmountFromButton(amount: number) {
    this.donationAmount = amount;
  }

  updateDonationAmountFromSlider(event: any) {
    this.donationAmount = event.value;
  }

  initiatePayment(): void {

    const returnUrl = `http://localhost:4200/associations-list/details/${this.id}`;
    const randomIdentifier = Math.random().toString(36).substring(2, 10);

    this.paymentService.authorizePayment(randomIdentifier, this.donationAmount, returnUrl)
      .subscribe(response => {     
        window.location.href = response.formUrl;
        localStorage.setItem('orderId', response.orderId);
        this.orderId = response.orderId;

        this.confirmPayment(response.orderId, this.donationAmount);

      }, error => {
        console.error('Authorization failed:', error);
      });
  }

  confirmPayment(orderId: string, amount: number): void {
    // Step 2: Confirmation
    this.paymentService.confirmPayment(orderId, amount)
      .subscribe(response => {
        if (this.selectedAssociation && this.selectedAssociation.id) {
          console.log('Selected Association:', this.selectedAssociation);
          // Pas besoin d'ajouter le don ici
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
            });      } else {
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
          // this.showSuccessMessage();
        } 
      }, error => {
        console.error('Error fetching order status:', error);
      });
  }

  validateDonationAmount() {
    if (this.donationAmount === 0) {
      this.presentPopover({ 
        component: 'Le montant du don ne peut pas être zéro!', 
        cssClass: 'my-custom-class',
        translucent: true 
      });
    } else {
      this.initiatePayment();
    }
  }

  showSuccessMessage() {
    if (this.selectedAssociation) {
      const nomAssociation = this.selectedAssociation.nom;
      const imageAssociation = this.selectedAssociation.logo;
  
      this.presentPopover({ 
        component: `Votre don à ${nomAssociation} a été transmis avec succès`, 
        cssClass: 'my-custom-class',
        translucent: true 
      });
    } else {
      console.log('selectedAssociation is null or undefined');
    };
    localStorage.removeItem('orderId');
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: AssociationDetailsPage, 
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }


}
