[![Coverage Status](https://coveralls.io/repos/github/NantesJS/nantesjs-organizer/badge.svg)](https://coveralls.io/github/NantesJS/nantesjs-organizer)

# nantesjs-organizer


## Configuration :wrench:

Vous devez créer une clé API pour pouvoir utiliser l'API Google Maps et pouvoir récupèrer les informations de l'hébergeur.

https://github.com/googlemaps/google-maps-services-js#api-keys

Celle-ci doit-être utilisable à partir de la variable d'environnement `GOOGLE_MAPS_API_KEY`.

Pour ce faire, vous pouvez renommer le fichier `.env.sample` en `.env` et renseigner la variable.

## Docker :whale:

### Construit l'image

```sh
docker image build -t nantesjs-organizer .
```

### Démarre le conteneur

```sh
docker container run -v "$PWD:/usr/local/nantesjs-organizer" -it nantesjs-organizer
```