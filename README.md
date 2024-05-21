# Stijn's Burgers Webapplicatie 🍔

Tijdens periode 2.2 ligt de focus op het individueel ontwikkelen van een full-stack JavaScript/TypeScript webapplicatie voor **Stijn's Burgers**. Dit project omvat het bouwen van een backend server met NestJS, gevoed door een MongoDB NoSQL database met JSON-geformatteerde data. De frontend wordt gehost door een Angular webapplicatie, gebruikmakend van TypeScript en Bootstrap. Zowel de backend als de frontend zitten in één NX repository. Alles is gehost in Azure.

## Casus

**Stijn's Burgers**, gevestigd in Breda, is dé online bestemming voor culinaire burgerliefhebbers. Klanten kunnen zich aanmelden, hun favoriete burgers en sides selecteren, deze in hun winkelmand plaatsen en een bestelling afronden. Na ontvangst kunnen klanten hun ervaringen delen via reviews op de website.

## Functionaliteiten

### Aantrekkelijke homepage
- Klanten komen op een aantrekkelijke homepage zodat ze gelijk enthousiast zijn om bij Stijn's Burgers te bestellen.

### Account Registratie en Beheer
- Klanten kunnen zich registreren, inloggen, profielgegevens bewerken en hun account verwijderen.

### Menu Weergave
- Overzicht van burgers en sides met prijzen en beschrijvingen.

### Productpagina's met reviews
- Klanten kunnen reviews lezen en schrijven voor verschillende producten.

### Winkelmandje 🛒
- Producten toevoegen, hoeveelheden aanpassen en producten verwijderen.

### Responsive Design 📱💻
- De website werkt op zowel desktop- als mobiele apparaten.

<p float="left">
  <img src="https://stijnrobben.nl/img/home2.png" alt="Homepage" width="300">
  <img src="https://stijnrobben.nl/img/menu.png" alt="Menu Weergave" width="300">
  <img src="https://stijnrobben.nl/img/menuitem2.png" alt="Product Reviews" width="300">
</p>

## Installatie
 
Volg deze stappen om de applicatie lokaal te draaien in een NX monorepo:

1. **Clone de repository**:
    ```bash
    git clone https://github.com/jouw-gebruikersnaam/stijns-burgers.git
    ```

2. **Navigeer naar de project directory**:
    ```bash
    cd stijns-burgers
    ```

3. **Installeer de vereiste pakketten**:
    ```bash
    npm install
    ```

4. **Start de backend en frontend server**:
    ```bash
    nx run-many --target=serve --all
    ```

🎉 Veel plezier met het gebruiken van Stijn's Burgers webapplicatie! 🍔
