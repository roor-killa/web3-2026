from math import*

n = int(input("donne un nombre entier : "))

def algo1(n):
    
    iteration=0
    res = 1
    
    for k in range(2, n-1):
        if n % k == 0:
            res = k
    return (res, iteration)

print("l'algo 1 donne : ")
print(algo1(n))

def algo2(n):
    
    iteration=0
    k = n - 1
    
    while k > 0 and n % k != 0:
        k = k - 1
    return (k,iteration)

print("l'algo 2 donne : ")
print(algo2(n))

def algo3(n):
    
    iteration=0
    k = 2
    
    while k<n and n % k !=0:
        k = k + 1
    return (n/k, iteration)

print("l'algo 3 donne : ")
print(algo3(n))


def algo4(n):
    iteration=0
    k = 2
    while k <= floor (n) and n % k != 0:
        k = k + 1
    if k > floor (n):
        return (1,iteration)
    else :
        return (n/k, iteration)

print("l'algo 4 donne : ")
print(algo4(n))