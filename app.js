require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:
//home route handler
app.get('/', (request, response) => {
  response.render('home.hbs');
});
//search route handler
app.get('/artist-search', (request, response) => {
  const term = request.query.term;
  spotifyApi
    .searchArtists(term)
    .then(data => {
      //console.log('The received data from the API: ', data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      const artists = data.body.artists.items;
      response.render('artist-search', { artists });
    })
    .catch(err =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.get('/artist-search-result', (request, response) => {
  const term = request.query.term;
  spotifyApi
    .searchAlbums(term)
    .then(data => {
      console.log('The received data from the API: ', data.body);
      const albums = data.body;
      response.render('artist-search-result', { albums });
    })
    .catch(err =>
      console.log('The error while searching artists occurred: ', err)
    );
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
