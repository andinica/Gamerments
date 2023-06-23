# Gamerments

## About

Gamerments is a SPA created with React and .js. It is a gaming tournament creation and management application.
As of now, it has the following functionalities:
1. Create single-elimination tournaments, with up to 128 participant. Participants number should be a power of 2, greater than one. Possible games for the tournament are provided from [IGDB API](https://api-docs.igdb.com/).
2. Search through existing tournaments that are stored in the database (in the home page)
3. View and edit tournament details
   - tournament home page: you can see participant details, tournament info and generate the fixtures for the tournament (only after this will the fixtures and tournament table options appear in the header)
   - fixtures page: you can see the details of the current tournament phase, add scores of the fixtures, save the scores and advance to the next phase when all scores are inputted; after tournament is finished the winners are displayed here
   - tournament table page: view the tournament table as a bracket, with participant names, fixture name and scores

## Running the app

1. Run backend:
   - go to the root folder of the project in a terminal and run `npm start`, backend app should now be running on port 3000 and requests to the API should be working correctly. All requests should go to http://localhost:3000/
2. Run frontend:
   - go to the ./gamerments-frontend folder `cd .\gamerments-frontend\` and run `npm start`, frontend app should now be running on port 3001. [Home page](http://localhost:3001/) should now be accessible

## API

In this repo we have a "Postman" folder, where there's a postman collection which contains the following folders:
1. Twitch Auth
   - IGDB API requires use to use Twitch Developer for auth
   - here you can make a POST request with client_id, client_secret and grant_type as params to get an access token 
2. IGDB
   - POST to https://api.igdb.com/v4/games with body fields name, cover.url; where id = :id; and headers needed Client-ID (from Twitch Developer Portal) and Authorization Bearer (the access token from above)
   - a GET that retrieves an image for a game. Link is from the POST above
3. API
   - this contains three other folders with requests specific to tournament, matchup or participant details. I will not describe all of them, but we have GET, POST, PUT and DELETE (all) methods for them used in different locations of the app 
