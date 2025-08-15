from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import Flask, request, jsonify
from twilio.rest import Client
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_jwt_extended import (
    JWTManager, create_access_token, get_jwt_identity, jwt_required
)
from dotenv import load_dotenv
import os

load_dotenv()



app = Flask(__name__)
CORS(app)

load_dotenv()
jwt = JWTManager(app)
# 🔐 JWT Config

print("DB URI:", os.getenv('DATABASE_URL'))  # debug

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy()




# 👤 Modèle Utilisateur
class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False, unique=True)
    role = db.Column(db.String(20), nullable=False, default='client')
    disponible = db.Column(db.Boolean, default=False)  # <- ICI

    def __repr__(self):
        return f'<User {self.username}>'
    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

# 📦 Modèle Commande
class Commande(db.Model):
    __tablename__ = 'commande'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    depart = db.Column(db.String(200), nullable=False)
    arrivee = db.Column(db.String(200), nullable=False)
    produits = db.Column(db.Text, nullable=False)
    montant_colis = db.Column(db.Float, nullable=True)
    frais = db.Column(db.Float, nullable=False)
    montant_total = db.Column(db.Float, nullable=False)
    tracking_code = db.Column(db.String(50), unique=True, nullable=False)
    statut = db.Column(db.Integer, default=0)
    date_commande = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'type': self.type,
            'depart': self.depart,
            'arrivee': self.arrivee,
            'produits': self.produits,
            'montant_colis': self.montant_colis,
            'frais': self.frais,
            'montant_total': self.montant_total,
            'tracking_code': self.tracking_code,
            'statut': self.statut,
            'date_commande': self.date_commande.isoformat(),
            'user_id': self.user_id,
        }



# 🔍 Modèle Historique (lecture seule)
class CommandeHistorique(db.Model):
    __tablename__ = 'commandes'
    id = db.Column(db.Integer, primary_key=True)
    nom_client = db.Column(db.String(100))
    code_commande = db.Column(db.String(50))
    statut_livraison = db.Column(db.String(50))
    rating = db.Column(db.Float)
    tracking_code = db.Column(db.String(50))
    adresse_depart = db.Column(db.Text)
    adresse_arrivee = db.Column(db.Text)
    avatar_url = db.Column(db.Text, default='https://i.pravatar.cc/100')

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, nullable=False)
    receiver_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Restau(db.Model):
    __tablename__ = 'restau'
    id = db.Column(db.Integer, primary_key=True)
    nom_plat = db.Column(db.String(255), nullable=False)
    prix = db.Column(db.Integer, nullable=False)
    composition = db.Column(db.Text)
    quantite = db.Column(db.Integer, default=1)
    date_commande = db.Column(db.DateTime, default=datetime.utcnow)


# 🔹 Modèle Resto
class Resto(db.Model):
    __tablename__ = "Resto"
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    panier = db.Column(db.JSON, nullable=False)
    adresse_livraison = db.Column(db.Text, nullable=False)
    frais_livraison = db.Column(db.Numeric(10, 2), nullable=False)
    montant_total = db.Column(db.Numeric(10, 2), nullable=False)
    date_commande = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)




# 📝 Enregistrement
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    phone = data.get('phone')
    role = data.get('role', 'client')

    if not all([username, password, phone]):
        return jsonify({'error': 'Champs manquants'}), 400

    if Users.query.filter((Users.username == username) | (Users.phone == phone)).first():
        return jsonify({'error': 'Utilisateur déjà existant'}), 409

    hashed_password = generate_password_hash(password)
    user = Users(username=username, password=hashed_password, phone=phone, role=role)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Inscription réussie'}), 201
class PromoCode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(255))
    type = db.Column(db.String(20))  
    value = db.Column(db.Float)
    date_expiration = db.Column(db.DateTime)
    usage_max = db.Column(db.Integer, default=1)  # combien max d’utilisations
    usage_count = db.Column(db.Integer, default=0)
    active = db.Column(db.Boolean, default=True)

    def is_valid(self):
        if not self.active:
            return False
        if self.date_expiration and self.date_expiration < datetime.utcnow():
            return False
        if self.usage_max and self.usage_count >= self.usage_max:
            return False
        return True

db.init_app(app)
with app.app_context():
    db.create_all()


@app.route('/promo-codes', methods=['GET'])
@jwt_required()
def get_promo_codes():
    # On récupère l’utilisateur si besoin avec get_jwt_identity()
    codes = PromoCode.query.filter_by(active=True).all()
    result = []
    for code in codes:
        result.append({
            "code": code.code,
            "description": code.description,
            "type": code.type,
            "value": code.value,
            "expiryDate": code.date_expiration.strftime('%Y-%m-%d') if code.date_expiration else None,
            "expired": not code.is_valid(),
        })
    return jsonify(result), 200

@app.route('/promo-codes/<string:code>/redeem', methods=['POST'])
@jwt_required()
def redeem_promo_code(code):
    user_id = get_jwt_identity()
    promo = PromoCode.query.filter_by(code=code, active=True).first()
    if not promo or not promo.is_valid():
        return jsonify({"message": "Code promo invalide ou expiré"}), 400

    # TODO: ajouter logique pour vérifier si user a déjà utilisé ce code, etc.
    promo.usage_count += 1
    db.session.commit()
    return jsonify({"message": "Code promo utilisé avec succès"}), 200


# 🔐 Connexion
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    phone = data.get('telephone')
    password = data.get('password')

    user = Users.query.filter_by(phone=phone).first()
    if user and check_password_hash(user.password, password):
        token = create_access_token(identity=str(user.id))
        return jsonify({
            "success": True,
            "role": user.role,
            "username": user.username,
            "id": user.id,
            "token": token
        })
    return jsonify({"success": False, "message": "Identifiants invalides"}), 401

# ➕ Créer une commande
@app.route('/commande', methods=['POST'])
@jwt_required()
def create_commande():
    try:
        data = request.get_json()
        user_id = int(get_jwt_identity()) 

        required_fields = ['type', 'depart', 'arrivee', 'produits', 'frais', 'montant_total', 'tracking_code']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Le champ {field} est requis.'}), 400

        commande = Commande(
            type=data['type'],
            depart=data['depart'],
            arrivee=data['arrivee'],
            produits=data['produits'],
            montant_colis = float(data['montant_colis']) if data.get('montant_colis') not in [None, ''] else 0.0,
            frais=float(data['frais']),
            montant_total=float(data['montant_total']),
            tracking_code=data['tracking_code'],
            user_id=user_id
        )

        db.session.add(commande)
        db.session.commit()

        return jsonify({'message': 'Commande enregistrée avec succès', 'commande': commande.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de l’enregistrement : {str(e)}'}), 500

# 📄 Obtenir les commandes d’un utilisateur
@app.route('/commandes', methods=['GET'])
@jwt_required()
def get_commandes():
    try:
        user_id = get_jwt_identity()
        commandes = Commande.query.filter_by(user_id=user_id).order_by(Commande.date_commande.desc()).all()
        return jsonify({"commandes": [cmd.serialize() for cmd in commandes]}), 200
       
    except Exception as e:
        return jsonify({"error": f"Erreur lors de la récupération des commandes : {str(e)}"}), 500
#pour le chat message 



@app.route('/commande', methods=['GET'])
@jwt_required()  # si tu utilises JWT
def get_commandes123():
    commandes = Commande.query.all()
    commandes_list = [
        {
            "id": c.id,
            "type": c.type,
            "depart": c.depart,
            "arrivee": c.arrivee,
            "produits": c.produits,
            "montant_colis": float(c.montant_colis),
            "frais": float(c.frais),
            "montant_total": float(c.montant_total),
            "tracking_code": c.tracking_code,
            "statut": c.statut,
            "user_id": c.user_id
        }
        for c in commandes
    ]
    return jsonify({"commandes": commandes_list})

# ✅ Envoyer un message
@app.route('/api/chat/send', methods=['POST'])
def send_message():
    data = request.get_json()
    sender_id = data.get('sender_id')
    receiver_id = data.get('receiver_id')
    content = data.get('content')

    if not all([sender_id, receiver_id, content]):
        return jsonify({'error': 'Champs manquants'}), 400

    message = ChatMessage(
        sender_id=sender_id,
        receiver_id=receiver_id,
        content=content
    )
    db.session.add(message)
    db.session.commit()
    return jsonify({'message': 'Message envoyé avec succès'}), 201

# ✅ Récupérer les messages entre 2 utilisateurs
@app.route('/api/chat/messages', methods=['GET'])
def get_messages():
    sender_id = request.args.get('sender_id')
    receiver_id = request.args.get('receiver_id')

    if not all([sender_id, receiver_id]):
        return jsonify({'error': 'IDs manquants'}), 400

    messages = ChatMessage.query.filter(
        ((ChatMessage.sender_id == sender_id) & (ChatMessage.receiver_id == receiver_id)) |
        ((ChatMessage.sender_id == receiver_id) & (ChatMessage.receiver_id == sender_id))
    ).order_by(ChatMessage.created_at.asc()).all()

    result = [{
        'id': msg.id,
        'sender_id': msg.sender_id,
        'receiver_id': msg.receiver_id,
        'content': msg.content,
        'created_at': msg.created_at.isoformat()
    } for msg in messages]

    return jsonify(result), 200


#livreur 



# 📦 Obtenir une commande par tracking code
@app.route('/commande/by-tracking-code/<code>', methods=['GET'])
def get_commande_by_tracking(code):
    commande = Commande.query.filter_by(tracking_code=code).first()
    if commande:
        return jsonify({'commande': commande.serialize()}), 200
    return jsonify({'error': 'Commande introuvable'}), 404

@app.route('/api/livreur/<int:user_id>/disponibilite', methods=['PUT'])
def changer_disponibilite(user_id):
    data = request.get_json()
    disponible = data.get('disponible')

    user = Users.query.get(user_id)
    if user and user.role == 'livreur':
        user.disponible = disponible
        db.session.commit()
        return jsonify({"message": "Disponibilité mise à jour"}), 200
    else:
        return jsonify({"error": "Livreur introuvable"}), 404

# 📦 Liste complète des commandes (admin uniquement)
@app.route('/admin/commandes', methods=['GET'])
@jwt_required()
def get_all_commandes():
    user_id = get_jwt_identity()
    user = Users.query.get(user_id)

    if not user or user.role != 'admin':
        return jsonify({'error': 'Accès non autorisé'}), 403
    commandes = Commande.query.order_by(Commande.date_commande.desc()).all()
    return jsonify({'commandes': [cmd.serialize() for cmd in commandes]}), 200

@app.route('/commande/<int:id>/etat', methods=['PUT'])
@jwt_required()
def changer_etat_commande(id):
    data = request.get_json()
    nouvel_etat = data.get('etat')  # string: 'en attente', 'en cours', 'livree'

    # Map string -> int (selon ta définition)
    etat_map = {
        'en attente': 0,
        'en cours': 1,
        'livree': 2
    }

    if nouvel_etat not in etat_map:
        return jsonify({'msg': 'État invalide'}), 400

    commande = Commande.query.get(id)
    if commande:
        commande.statut = etat_map[nouvel_etat]
        db.session.commit()
        return jsonify({'msg': 'État mis à jour avec succès'}), 200

    return jsonify({'msg': 'Commande non trouvée'}), 404




@app.route('/api/users', methods=['GET'])
def get_all_users():
    users = Users.query.all()
    result = [{
        'id': u.id,
        'username': u.username,
        'phone': u.phone,
        'role': u.role,
        'disponible': u.disponible,
    } for u in users]
    return jsonify(result), 200


@app.route('/users', methods=['GET'])
def get_users():
    users = Users.query.all()
    result = []
    for u in users:
        result.append({
            'id': u.id,
            'username': u.username,
            'role': u.role
        })
    return jsonify({'users': result})


#Modifier Commande

@app.route('/admin/commandes/<int:commande_id>', methods=['PUT'])
@jwt_required()
def modifier_commande(commande_id):
    data = request.get_json()
    commande = Commande.query.get(commande_id)
    if not commande:
        return jsonify({'msg': 'Commande non trouvée'}), 404

    # Mettre à jour les champs si présents
    commande.type = data.get('type', commande.type)
    commande.depart = data.get('depart', commande.depart)
    commande.arrivee = data.get('arrivee', commande.arrivee)
    commande.produits = data.get('produits', commande.produits)
    commande.montant_colis = data.get('montant_colis', commande.montant_colis)
    commande.frais = data.get('frais', commande.frais)
    commande.montant_total = data.get('montant_total', commande.montant_total)
    commande.tracking_code = data.get('tracking_code', commande.tracking_code)
    commande.statut = data.get('statut', commande.statut)

    db.session.commit()
    return jsonify({'msg': 'Commande modifiée avec succès'}), 200

@app.route('/update-profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.json
    user = Users.query.get(user_id)

    if not user:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    # Mettre à jour uniquement les champs existants dans le modèle
    user.username = data.get("username", user.username)
    user.phone = data.get("phone", user.phone)

    if data.get("password"):
        # Assure-toi que la méthode set_password existe bien
        user.set_password(data["password"])

    db.session.commit()
    return jsonify({"message": "Profil mis à jour"}), 200




# Route pour enregistrer une commande
@app.route('/commandeRestau', methods=['POST'])
def ajouter_commandeResto():
    data = request.get_json()

    try:
        nouvelle_commande = Restau(
            nom_plat=data.get('nom_plat'),
            prix=data.get('prix'),
            composition=data.get('composition'),
            quantite=data.get('quantite', 1)
        )
        db.session.add(nouvelle_commande)
        db.session.commit()
        return jsonify({"message": "Commande enregistrée avec succès"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

# Route pour voir toutes les commandes
@app.route('/commandesRestau', methods=['GET'])
def lister_commandesResto():
    commandes = Restau.query.order_by(Restau.date_commande.desc()).all()
    resultats = []
    for c in commandes:
        resultats.append({
            "id": c.id,
            "nom_plat": c.nom_plat,
            "prix": c.prix,
            "composition": c.composition,
            "quantite": c.quantite,
            "date_commande": c.date_commande.strftime("%Y-%m-%d %H:%M:%S")
        })
    return jsonify(resultats)


#pour enregistrer commande Campement .

# 🔹 Endpoint pour enregistrer une commande
@app.route('/commandesResto', methods=['GET', 'POST', 'PUT'])
def commandes_resto():
    # 📌 1 - Récupérer toutes les commandes
    if request.method == 'GET':
        commandes = Resto.query.order_by(Resto.date_commande.desc()).all()
        data = []
        for cmd in commandes:
            data.append({
                "id": cmd.id,
                "nom": cmd.nom,
                "prenom": cmd.prenom,
                "phone": cmd.phone,
                "panier": cmd.panier,
                "adresse_livraison": cmd.adresse_livraison,
                "frais_livraison": str(cmd.frais_livraison),
                "montant_total": str(cmd.montant_total),
                "date_commande": cmd.date_commande.isoformat()
            })
        return jsonify(data), 200

    # 📌 2 - Ajouter une commande
    elif request.method == 'POST':
        data = request.get_json()
        try:
            nouvelle_commande = Resto(
                nom=data['nom'],
                prenom=data['prenom'],
                phone=data['phone'],
                panier=data['panier'],
                adresse_livraison=data['adresse_livraison'],
                frais_livraison=data['frais_livraison'],
                montant_total=data['montant_total'],
                date_commande=datetime.fromisoformat(
                    data['date_commande'].replace('Z', '+00:00')
                )
            )
            db.session.add(nouvelle_commande)
            db.session.commit()
            return jsonify({"message": "Commande enregistrée avec succès"}), 201
        except Exception as e:
            return jsonify({"message": "Erreur lors de l'enregistrement", "error": str(e)}), 400

    # 📌 3 - Modifier une commande existante
    elif request.method == 'PUT':
        data = request.get_json()
        commande_id = data.get('id')
        if not commande_id:
            return jsonify({"message": "ID de la commande manquant"}), 400

        commande = Resto.query.get(commande_id)
        if not commande:
            return jsonify({"message": "Commande introuvable"}), 404

        # Mettre à jour tous les champs si fournis
        commande.nom = data.get('nom', commande.nom)
        commande.prenom = data.get('prenom', commande.prenom)
        commande.phone = data.get('phone', commande.phone)
        commande.panier = data.get('panier', commande.panier)
        commande.adresse_livraison = data.get('adresse_livraison', commande.adresse_livraison)
        commande.frais_livraison = data.get('frais_livraison', commande.frais_livraison)
        commande.montant_total = data.get('montant_total', commande.montant_total)

        if 'date_commande' in data:
            commande.date_commande = datetime.fromisoformat(
                data['date_commande'].replace('Z', '+00:00')
            )

        db.session.commit()
        return jsonify({"message": "Commande mise à jour avec succès"}), 200


# 🚀 Démarrage
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)

