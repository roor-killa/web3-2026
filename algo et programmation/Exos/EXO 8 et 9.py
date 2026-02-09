F_fractal=matplotlib.gca ( ) 

def cercle_fractal(x , y , r ) :
    """ cercle de centre ( x , y ) e t de rayon r """
    # création du cercle :
    cir = pylab.Circle( [ x , y ] , radius=r , fill=False )
    # ajout du cercle à la figure :
    F.add_patch(cir)

def Rectangle_fractal( x , y , longueur ) :
    rec = pylab.Rectangle((x,y),longueur, longueur, fill =False)
    # ajout du cercle à la figure :
    F_fractal.aqdd_patch( rec )

def rec_rond(x,y,longueur):
    Rectangle_fractal( x , y , longueur)
    cercle_fractal(x+longueur/2, y+longueur/2, longueur/4)

def frac_rectangle_rec_figure_1(x , y , longueur):
    #construction récursive de la figure """
    rec_rond(x,y,longueur)

    if longueur > 1:
        frac_rectangle_rec_figure_1(x-longueur/4, y+(longueur/4)*3 , longueur / 2)
        frac_rectangle_rec_figure_1(x+(longueur/4)*3, y+(longueur/4)*3 ,longueur / 2)
        frac_rectangle_rec_figure_1(x-(longueur/4), y-(longueur/4) , longueur / 2)
        frac_rectangle_rec_figure_1(x+(longueur/4)*3, y-(longueur/4) , longueur / 2)

def frac_rectangle_rec_figure_2(x , y , longueur, direction):
    #construction récursive de la figure """
    rec_rond(x,y,longueur)

    if longueur > 1:
        if direction == 'centre':
            frac_rectangle_rec_figure_2(x-longueur/2, y+longueur , longueur / 2, 'nord-ouest')
            frac_rectangle_rec_figure_2(x+longueur, y+longueur ,longueur / 2, 'nord-est')
            frac_rectangle_rec_figure_2(x-longueur/2, y-longueur/2 , longueur / 2, 'sud-ouest')
            frac_rectangle_rec_figure_2(x+longueur, y-longueur/2 , longueur / 2, 'sud-est')
        
        if direction == 'nord-ouest':
            frac_rectangle_rec_figure_2(x-longueur/2, y+longueur , longueur / 2, 'nord-ouest')
            frac_rectangle_rec_figure_2(x+longueur, y+longueur ,longueur / 2, 'nord-est')
            frac_rectangle_rec_figure_2(x-longueur/2, y-longueur/2 , longueur / 2, 'sud-ouest')

        if direction == 'nord-est':
            frac_rectangle_rec_figure_2(x-longueur/2, y+longueur , longueur / 2, 'nord-ouest')
            frac_rectangle_rec_figure_2(x+longueur, y+longueur ,longueur / 2, 'nord-est')
            frac_rectangle_rec_figure_2(x+longueur, y-longueur/2 , longueur / 2, 'sud-est')
            
        if direction == 'sud-ouest':
            frac_rectangle_rec_figure_2(x-longueur/2, y+longueur , longueur / 2, 'nord-ouest')
            frac_rectangle_rec_figure_2(x-longueur/2, y-longueur/2 , longueur / 2, 'sud-ouest')
            frac_rectangle_rec_figure_2(x+longueur, y-longueur/2 , longueur / 2, 'sud-est')

        if direction == 'sud-est':
            frac_rectangle_rec_figure_2(x+longueur, y+longueur ,longueur / 2, 'nord-est')
            frac_rectangle_rec_figure_2(x-longueur/2, y-longueur/2 , longueur / 2, 'sud-ouest')
            frac_rectangle_rec_figure_2(x+longueur, y-longueur/2 , longueur / 2, 'sud-est')
pylab.axis('scaled')
pylab.show()