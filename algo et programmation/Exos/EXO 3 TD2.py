n=int(input("entrez un nombre pour le triangle : "))

def triangle(n):
    if n>0:
        print("*"*n)
        triangle(n-1)
        
def triangle2(n):
    if n>0:
        triangle2(n-1)
        print("*"*n)
        
triangle(n)
triangle2(n)