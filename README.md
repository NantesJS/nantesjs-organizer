[![Coverage Status](https://coveralls.io/repos/github/NantesJS/nantesjs-organizer/badge.svg)](https://coveralls.io/github/NantesJS/nantesjs-organizer)

# nantesjs-organizer

## Pré-requis 🧰

* Node >= 12.0.0

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

### Firestore :fire: (Optionnel)

Vous devez créer un projet [Firebase](https://firebase.google.com/) et [générer une clé privée pour votre compte de service](https://firebase.google.com/docs/admin/setup#initialize_the_sdk).

Une fois la clé privée téléchargée, vous devez l'enregistrer à la racine du projet sous le nom suivant : `serviceAccountKey.json`.

:warning: Ce fichier doit rester secret !  
:see_no_evil: C'est pour cela qu'il est ignoré par *git* grâce au fichier `.gitignore`.

### GitHub :octocat:

Vous devez créer un token pour pouvoir utiliser l'API GitHub et créer la Pull Request.

https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line

Les variables d'environnement suivantes doivent-être renseignées :

* `GITHUB_TOKEN`
* `GITHUB_WEBSITE_ORGA`
* `GITHUB_WEBSITE`

## Docker :whale:

### Construit l'image

```sh
docker image build -t nantesjs-organizer .
```

### Démarre le conteneur

```sh
docker container run -v "$PWD:/usr/local/nantesjs-organizer" -it nantesjs-organizer
```
