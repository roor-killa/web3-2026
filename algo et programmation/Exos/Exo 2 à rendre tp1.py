import matplotlib.pyplot as plt
import numpy as np

def dessiner_triangle(ax, p1, p2, p3, couleur='black'):
    triangle = plt.Polygon([p1, p2, p3], closed=True, edgecolor=couleur, facecolor='none')
    ax.add_patch(triangle)

def triangle_sierpinski(ax, p1, p2, p3, profondeur):
    if profondeur == 0:
        dessiner_triangle(ax, p1, p2, p3)
    else:
        m12 = ((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2)
        m23 = ((p2[0] + p3[0]) / 2, (p2[1] + p3[1]) / 2)
        m31 = ((p3[0] + p1[0]) / 2, (p3[1] + p1[1]) / 2)

        triangle_sierpinski(ax, p1, m12, m31, profondeur - 1)
        triangle_sierpinski(ax, m12, p2, m23, profondeur - 1)
        triangle_sierpinski(ax, m31, m23, p3, profondeur - 1)

if __name__ == "__main__":
    fig, ax = plt.subplots(figsize=(8, 8))
    ax.set_aspect('equal', adjustable='box')
    ax.set_title("Exercice 2:")

    p1_initial = (0, 0)
    p2_initial = (10, 0)
    p3_initial = (5, 10 * np.sqrt(3) / 2)

    triangle_sierpinski(ax, p1_initial, p2_initial, p3_initial, profondeur=4)

    ax.set_xlim(-1, 11)
    ax.set_ylim(-1, 10 * np.sqrt(3) / 2 + 1)
    ax.axis('off')
    plt.show()
