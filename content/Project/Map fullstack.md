# What is it?
This little test project is a fullstack web app that maps higher education establishments in France and lets you filter them by field of study directly on an interactive map.
It's built with Nuxt / Vue 3 for both the frontend and the backend API, with a local SQLite database storing every establishment.
[GitHub repo](https://github.com/Nardre/map_fullstack)

![[map_fullstack_1.png]]
# The Data
The establishments come from the "Cartographie des formations Parcoursup" dataset on [data.gouv.fr](https://www.data.gouv.fr/datasets/cartographie-des-formations-parcoursup), published by the Ministère de l'Enseignement supérieur.
The database is a local SQLite file, accessed through @libsql/client.

# The Backend
The server is a Nuxt API exposing two routes:
* `GET /api/etablissement`: returns establishments, dynamically filtered from the query string
* `POST /api/etablissement`: inserts a new establishment.

# The Frontend
The main page is split into two parts:
* A sidebar listing the establishments currently visible, with checkboxes to filter by specialites.
* An interactive Leaflet map via @vue-leaflet centered on France, with one marker per establishment.
# Technical Stack
* Nuxt 3 / Vue 3 for the frontend and backend
* SQLite via @libsql/client for storage
* Leaflet / OpenStreetMap for the map and tiles