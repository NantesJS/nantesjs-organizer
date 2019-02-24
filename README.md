[![Coverage Status](https://coveralls.io/repos/github/NantesJS/nantesjs-organizer/badge.svg)](https://coveralls.io/github/NantesJS/nantesjs-organizer)

# nantesjs-organizer

## Pré-requis 🧰

* Node >= 11.0.0

## Configuration :wrench:

* Copier le fichier `.env.sample` et nommez-le `.env`
* Renseignez les variables grâce à l'aide ci-dessous

### Google Maps :world_map:

Vous devez créer une clé API pour pouvoir utiliser l'API Google Maps et pouvoir récupèrer les informations de l'hébergeur.

https://github.com/googlemaps/google-maps-services-js#api-keys

Celle-ci doit-être utilisable à partir de la variable d'environnement `GOOGLE_MAPS_API_KEY`.

### Conference-Hall :loudspeaker:

Afin de pouvoir sélectionner sélectionner un talk, vous devez vous munir d'une clé API ainsi que de l'identifiant de votre évènement dans conference-hall.

Ces informations doivent-être récupérable à partir des variables d'environnement suivantes : `CONFERENCE_HALL_API_KEY` et `CONFERENCE_HALL_EVENT_ID`.


### Eventbrite 🎟

Vous devez créer une clé API pour pouvoir utiliser l'API eventbrite et pouvoir créer un évènement.

https://www.eventbrite.fr/platform/api-keys/

Celle-ci doit-être utilisable à partir de la variable d'environnement `EVENTBRITE_API_KEY`.

## Docker :whale:

### Construit l'image

```sh
docker image build -t nantesjs-organizer .
```

### Démarre le conteneur

```sh
docker container run -v "$PWD:/usr/local/nantesjs-organizer" -it nantesjs-organizer
```
