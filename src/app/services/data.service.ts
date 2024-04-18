import { Injectable } from '@angular/core';
import { Firestore, Timestamp, collection, collectionData } from '@angular/fire/firestore';
import { Association } from '../interfaces/association';
import { Actualite } from '../interfaces/actualite';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private fs: Firestore) { }

  getActiveAssociations(): Observable<Association[]> {
    let associationCollection = collection(this.fs, 'Association');
    return collectionData(associationCollection, { idField: 'id' }).pipe(
      map((associations: any[]) => {
        return associations
        .filter(association => association.etat === 'actif') // Filter associations with etat 'en_attente'
          .map(association => ({
            id: association.id,
            nom: association.nom,
            etat: association.etat,
            categorie: association.categorie,
            adresse: association.adresse,
            gouvernerat: association.gouvernerat,
            description: association.description,
            email: association.email,
            id_fiscale: association.id_fiscale,
            logo: association.logo,
            mdp: association.mdp,
            rib: association.rib,
            telephone: association.telephone,
            salt: association.salt,
          }));
      })
    );
  }

  getAssociationById(id: string): Observable<Association | undefined> {
    return this.getActiveAssociations().pipe(
      map(associations => associations.find(association => association.id === id))
    );
  }

  getAcceptedActualites(): Observable<Actualite[]> {
    let actualiteCollection = collection(this.fs, 'Actualite');
   return collectionData(actualiteCollection, { idField: 'id' }).pipe(
     map((actualites: any[]) => {
        return actualites
        .filter(actualite => actualite.etat === 'accepté')
        .map(actualite => ({
          id: actualite.id,
          etat:actualite.etat,
          titre: actualite.titre,
          description: actualite.description,
          image: actualite.image,
          date_publication: actualite.date_publication instanceof Timestamp ? actualite.date_publication.toDate() : actualite.date_publication,
          id_association:actualite.id_association,
        }));
      })
    );
   }

}
