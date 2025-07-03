document.addEventListener('DOMContentLoaded', function () {

    let isUpdateMode = false;
    let updateMovieId = null;

    // Handle form submission
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();

        let movietitle = document.getElementById('movieTitle').value;
        let movietid = document.getElementById('movieId').value;
        let movieposter = document.getElementById('movieImage').value;
        let movieplot = document.getElementById('moviePlot').value;

        const movieObject = {
            id: movietid,
            Title: movietitle,
            Poster: movieposter,
            Plot: movieplot
        };

        if (isUpdateMode) {
            // UPDATE
            fetch(`http://localhost:3000/movies/${updateMovieId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(movieObject)
            })
            .then(res => res.json())
            .then(() => {
                isUpdateMode = false;
                updateMovieId = null;
                getMovies(); // Refresh list
                document.querySelector('form').reset();
            });

        } else {
            // CREATE
            fetch('http://localhost:3000/movies', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(movieObject)
            })
            .then(res => res.json())
            .then(data => {
                loadMovie(data); // add new movie to UI
                document.querySelector('form').reset();
            });
        }
    });

    // Load one movie as a card
    function loadMovie(movie) {
        let card = document.createElement('div');
        card.classList.add('card', 'col-3', 'm-3');
        card.innerHTML = `
          <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
          <div class="card-body">
            <h5 class="card-title">${movie.Title}</h5>
            <p class="card-text">${movie.Plot}</p>
            <p class="card-text">${movie.id}</p>
            <a href="#" class="btn btn-dark">Watch</a>
            <a href="#" class="btn btn-danger delete-btn">Delete</a>
            <a href="#" class="btn btn-warning update-btn">Update</a>
          </div>
        `;

        // Delete button event
        card.querySelector('.delete-btn').addEventListener('click', function () {
            deleteMovie(movie.id, card);
        });

        // Update button event
        card.querySelector('.update-btn').addEventListener('click', function () {
            document.getElementById('movieTitle').value = movie.Title;
            document.getElementById('movieId').value = movie.id;
            document.getElementById('movieImage').value = movie.Poster;
            document.getElementById('moviePlot').value = movie.Plot;
            isUpdateMode = true;
            updateMovieId = movie.id;
        });

        document.getElementById('movies-container').appendChild(card);
    }

    // Delete a movie by ID
    function deleteMovie(id, cardElement) {
        fetch(`http://localhost:3000/movies/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete movie');
            }
            cardElement.remove();
            console.log('Movie deleted successfully');
        })
        .catch(error => {
            console.error('Error deleting movie:', error);
            alert('Failed to delete movie. Please try again.');
        });
    }

    // Load all movies
    function getMovies() {
        fetch('http://localhost:3000/movies')
            .then(response => response.json())
            .then(movies => {
                document.getElementById('movies-container').innerHTML = '';
                movies.forEach(movie => loadMovie(movie));
            })
            .catch(error => console.error('Error loading movies', error));
    }

    getMovies();

});
