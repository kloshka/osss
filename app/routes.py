from flask import render_template, flash, redirect, url_for, request, jsonify
from app import app, db
from flask_login import current_user, login_user, logout_user, login_required
import sqlalchemy as sa
from app.models import User, FavoriteMovie, UserPreference, RateMovie
from urllib.parse import urlsplit, parse_qs
from sqlalchemy import func


@app.route('/liked_movies')
def liked_movies():
    return render_template('liked_movies.html')

@app.route('/search')
def search():
    return render_template('search.html')

@app.route('/recomendation')
def recomendation():
    user_preference = UserPreference.query.filter_by(user_id=current_user.id).first()
    if not user_preference or not user_preference.preferences_chosen:
        return render_template('recomendation.html')
    
    return render_template('main1.html')


@app.route('/main1')
def main1():
    return render_template('main1.html')

@app.route('/')
@app.route('/index')
@login_required
def index():
    return render_template('main1.html', title='Home')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('recomendation'))
    
    if request.method == 'POST':
        username = request.form['Username']
        password = request.form['Password']
        user = db.session.scalar(sa.select(User).where(User.username == username))
        if user is None or not user.check_password(password):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        
        login_user(user, remember=False)
        next_page = request.args.get('next', url_for('recomendation'))       
        if not next_page or urlsplit(next_page).netloc!= '':
            next_page = url_for('recomendation')
        return redirect(next_page)
    return render_template('login.html', title='Login')


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        username = request.form.get('Username')
        email = request.form.get('Email')
        password = request.form.get('Password')
        repeat_password = request.form.get('RepeatPassword')

        if not username or not password or not repeat_password or not email:
            flash('All fields are required')
            return redirect(url_for('register'))
        
        if password!= repeat_password:
            flash('Passwords do not match')
            return redirect(url_for('register'))
        
        if db.session.scalar(sa.select(User).where(User.username == username)):
            flash('Username already exists')
            return redirect(url_for('register'))
        
        if db.session.scalar(sa.select(User).where(User.email == email)):
            flash('Email already exists')
            return redirect(url_for('register'))
        
        new_user = User(username=username, email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    
    return render_template('registration.html', title='Register')


@app.route('/api/favorites/add', methods=['POST'])
def add_to_favorites():
    movie_data = request.json
    print(movie_data)
    print('aaaaaaaaaaaaaaaaaaaaaaaaaa')

    if not isinstance(movie_data, list):
        return jsonify({"error": "Expected list of movies"}), 400  # Проверяем, что movie_data - список

    # Обработка каждого фильма в списке
    for data in movie_data:
        existing_movie = FavoriteMovie.query.filter_by(
            user_id=current_user.id, 
            name=data['name']
        ).first()

        if existing_movie:
            # Если фильм уже в списке понравившихся, пропускаем его
            print('aaaaaaaaaaaaaaaaaa')
            continue

        movie = FavoriteMovie(
            kp_id=data['id'],
            name=data['name'],
            description=data['description'],
            shortDescription=data['shortDescription'],
            kp_rating=data['rating']['kp'],
            imdb_rating=data['rating']['imdb'],
            ageRating=data['ageRating'],
            posterUrl=data['poster']['url'],
            posterPreviewUrl=data['poster']['previewUrl'],
            genres=', '.join([genre['name'] for genre in data['genres']]),  # Преобразуем в строку
            countries=', '.join([country['name'] for country in data['countries']]),  # Преобразуем в строку
            releaseStart=data['releaseYears'][0]['start'],  # Год начала
            releaseEnd=data['releaseYears'][0]['end'],  # Год окончания
            user_id=current_user.id,  # Идентификатор текущего пользователя
        )
    db.session.add(movie)  # Добавляем фильм в базу данных
    # Сохраняем все изменения в базе данных
    db.session.commit()

    return jsonify({'message': 'Movies added to favorites'}), 200


@app.route('/api/favorites', methods=['GET'])
def get_favorites():
    favorites = db.session.query(FavoriteMovie).filter_by(user_id=current_user.id).all()
    return jsonify([
        {
            'id': favorite.kp_id,
            'name': favorite.name,
            'description': favorite.description,
            'shortDescription': favorite.shortDescription,
            'kp_rating': favorite.kp_rating,
            'imdb_rating': favorite.imdb_rating,
            'ageRating': favorite.ageRating,
            'posterUrl': favorite.posterUrl,
            'posterPreviewUrl': favorite.posterPreviewUrl,
            'genres': favorite.genres,
            'countries': favorite.countries,
            'releaseStart': favorite.releaseStart,
            'releaseEnd': favorite.releaseEnd,
        }
        for favorite in favorites
    ])


@app.route('/api/preferences/save', methods=['POST'])
@login_required
def save_preferences_from_url():
    data = request.json
    url = data.get('url', '')

    if not url:
        return jsonify({'error': 'No URL provided'}), 400
    
    query_params = parse_qs(urlsplit(url).query)

    release_years_start = ','.join(query_params.get('releaseYears.start', []))
    genres = ','.join(query_params.get('genres.name', []))
    countries = ','.join(query_params.get('countries.name', []))
    user_preference = UserPreference.query.filter_by(user_id=current_user.id).first()
    if not user_preference:
        user_preference = UserPreference(user_id=current_user.id)
        db.session.add(user_preference)
    
    user_preference.genres = genres
    user_preference.countries = countries
    user_preference.releaseYearsStart = release_years_start
    user_preference.preferences_chosen = True

    db.session.commit()

    return jsonify({'message': 'Preferences saved'}), 200


@app.route('/api/preferences', methods=['GET'])
@login_required
def get_preferences():
    user_preference = UserPreference.query.filter_by(user_id=current_user.id).first()
    if not user_preference:
        return jsonify({'error': 'User prefencts not found'}), 404
    
   
    genres = user_preference.genres.split(', ') if user_preference.genres else []
    countries = user_preference.countries.split(', ') if user_preference.countries else []
    release_years_start = user_preference.releaseYearsStart.split(', ') if user_preference.countries else []

    preferences_list = [genres, countries, release_years_start]

    return jsonify(preferences_list)


@app.route('/api/favorites/delete', methods=['POST'])
def delete_from_favorites():
    movie_id = request.json.get('id', None)

    if not movie_id:
        return jsonify({'error': 'No movie id provided'}), 400

    movie = FavoriteMovie.query.filter_by(kp_id=int(movie_id), user_id=current_user.id).first()

    if not movie:
        return jsonify({'error': 'Movie not found'}), 404

    db.session.delete(movie)
    db.session.commit()

    return jsonify({'message': 'Movie deleted from favorites'}), 200


@app.route('/api/rate/add', methods=['POST'])
@login_required
def add_rate():
    data = request.json
    movie_name = data.get('name', None)
    rate = data.get('rate', None)

    if not movie_name or not rate:
        return jsonify({'error': 'No movie id or rate provided'}), 400
    
    movie = RateMovie.query.filter_by(name=movie_name, user_id=current_user.id).first()
    if not movie:
        movie = RateMovie(user_id=current_user.id)
        db.session.add(movie)
    
    movie.rating = rate
    movie.name = movie_name
    db.session.commit()

    return jsonify({'message': 'Rate added'}), 200


@app.route('/api/rate/<int:movie_name>', methods=['GET'])
@login_required
def get_rate(movie_name):
    movie = RateMovie.query.filter_by(name=movie_name, user_id=current_user.id).first()

    if not movie:
        return jsonify({'error': 'Нет такого фильма в базе данных'}), 404
    
    average_rating = db.session.query(func.avg(RateMovie.rating)).filter_by(name=movie_name).scalar()
    return jsonify({
        'rate': movie.rating,
        'average_rate': average_rating
        })
