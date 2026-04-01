
Application CertiChain - Certificats Numeriques 


Stack technologique 
Next.js : Frontend 
Laravel : Gerer la partie logique 
PostgreSQL : Va stocker les données
Docker : Permet de communiquer entre les differents composants
Nginx : Sa servir le frontend Next.js


Structure du projet :
    root
    |- backend : Laravel
    |-- fichiers laravel
    |-- Dockerfile
    |- frontend : Next.js
    |-- fichiers next.js
    |-- Dockerfile
    |- infra : 
    |-- docker-compose.yml
    |-|-nginx
    |-|-- default.conf