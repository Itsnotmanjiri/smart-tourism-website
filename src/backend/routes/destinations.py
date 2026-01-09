"""DESTINATION ROUTES"""
from flask import Blueprint, jsonify
from backend.models import Destination
from backend.app import cache

bp = Blueprint('destinations', __name__)

@bp.route('/', methods=['GET'])
@cache.cached(timeout=600)
def get_destinations():
    destinations = Destination.query.all()
    return jsonify({'destinations': [{
        'id': d.id, 'name': d.name, 'state': d.state,
        'category': d.category, 'popularity_score': d.popularity_score,
        'hero_image': d.hero_image, 'description': d.description
    } for d in destinations]}), 200
