def descente(n):
    n = int(input("entre un nombre : "))
    if n > 1:
        n-1
    else :
        1- descente(n)
print(descente)
    
def somme_chiffre(n:int):
    if n < 10:
        return n
    else:
        return n % 10 + somme_chiffre(n)
print(somme_chiffre)