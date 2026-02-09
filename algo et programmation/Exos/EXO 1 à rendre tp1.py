import pylab

F=pylab.gca ( )

def Rectangle( x , y , longueur ) :
    rec = pylab.Rectangle((x,y),longueur, longueur, fill =False)
    F.add_patch( rec )

def RectangleRec ( x , y , longueur,  direction ) :
    Rectangle( x , y , longueur)
    if longueur > 1:
        if direction != 'gauche':
            RectangleRec(x+longueur, y+longueur/2 ,longueur / 2,'droite')
        if direction != 'bas':
            RectangleRec(x , y+longueur, longueur / 2, 'haut')
        if direction != 'droite':
            RectangleRec(x-longueur/2, y  ,longueur / 2,'gauche')
        if direction != 'haut':
            RectangleRec(x+longueur/2, y-longueur/2 ,longueur/2,'bas')
            
RectangleRec( 0 , 0 , 4 , 'c' )
RectangleRec( 0 , 0 , 8 , 'c' )
pylab.axis('scaled' )
pylab.show()