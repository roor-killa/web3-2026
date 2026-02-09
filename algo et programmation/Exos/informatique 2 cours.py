class Compte :
   
    def __init__(self,num):
        self.numero=num
        self.solde=0
   
    def crediter(self,montant):
        self.solde+=montant
    
    def debiter(self,montant):
        if self.solde>=montant:
            self.solde-=montant
        self.solde-=montant
        
    def afficher_solde(self):
        print(f"compte numéro : {self.numero} ; solde = {self.solde}")
        
        
C1=Compte("008877113")
C2=Compte("223111009")

print("C1-------------")
C1.afficher_solde()
C1.crediter(100)
C1.afficher_solde()

print("C2-------------")
C2.afficher_solde()
C2.crediter(10)
C2.afficher_solde()