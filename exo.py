from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required

# Initialiser l'application Flask
app = Flask(__name__)

# Configurer la base de données et JWT
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bibliotheque.db'
app.config['JWT_SECRET_KEY'] = 'votre_cle_secrete'

# Initialiser la base de données et JWT
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Modèles de données
class Livre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(255), nullable=False)

class Auteur(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(255), nullable=False)

class Emprunt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    livre_id = db.Column(db.Integer, db.ForeignKey('livre.id'), nullable=False)

@app.before_first_request
def create_tables():
    db.create_all()

# Route de connexion
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    if username == 'admin' and password == 'password':  # Remplacez par votre logique d'authentification
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Bad username or password"}), 401

# Route pour obtenir les livres
@app.route('/livres', methods=['GET'])
@jwt_required()
def get_livres():
    livres = Livre.query.all()
    return jsonify([{'id': livre.id, 'titre': livre.titre} for livre in livres])

# Route pour ajouter un livre
@app.route('/livres', methods=['POST'])
@jwt_required()
def add_livre():
    data = request.get_json()
    new_livre = Livre(titre=data['titre'])
    db.session.add(new_livre)
    db.session.commit()
    return jsonify({'id': new_livre.id}), 201

# Lancer l'application
if __name__ == '__main__':
    app.run(debug=True)
    