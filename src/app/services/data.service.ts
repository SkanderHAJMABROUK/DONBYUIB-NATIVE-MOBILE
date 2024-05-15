import { Injectable } from '@angular/core';
import { Firestore, Timestamp, collection, collectionData } from '@angular/fire/firestore';
import { Association } from '../interfaces/association';
import { Actualite } from '../interfaces/actualite';
import { Observable, map } from 'rxjs';
import { Collecte } from '../interfaces/collecte';

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

   getAcceptedCollectes(): Observable<Collecte[]> {
    let collecteCollection = collection(this.fs, 'Collecte');
   return collectionData(collecteCollection, { idField: 'id' }).pipe(
     map((collectes: any[]) => {
        return collectes
        .filter(collecte => collecte.etat = 'accepté')
        .map(collecte => ({
          id: collecte.id,
          nom: collecte.nom,
          etat:collecte.etat,
          description: collecte.description,
          image: collecte.image,
          montant: collecte.montant,
          cumul:collecte.cumul,
          date_debut: collecte.date_debut instanceof Timestamp ? collecte.date_debut.toDate() : collecte.date_debut,
          date_fin: collecte.date_fin instanceof Timestamp ? collecte.date_fin.toDate() : collecte.date_fin,
          id_association:collecte.id_association,
        }));
      })
    );
   }

   getCollecteById(id: string): Observable<Collecte | undefined> {
    return this.getAcceptedCollectes().pipe(
      map(collectes => collectes.find(collecte => collecte.id === id))
    );
  }

  getAssociationNameById(id: string): Observable<string | undefined> {
    return this.getAssociationById(id).pipe(
      map(association => association?.nom)
    )
  }
  
  

}
