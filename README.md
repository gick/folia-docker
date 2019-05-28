# Utiliser folia-docker 

## Générer l'image initiale
Depuis le dossier source, utiliser la commande `docker build -t username/folia-service:latest` en remplaçant username par le username de dockerhub.

L'image prend un certain temps à se générer mais le processus est automatique.

## Envoyer l'image sur Dockerhub
Se connecter sur dockerhub
`docker login --username=yourhubusername --email=youremail@company.com`
Une fois la connection validée, faire un push vers dockerhub :
`docker push username/folia-service:latest`


## Récupérer l'image sur le serveur (Albiziapp ou Moggle-game)
`docker pull username/folia-service:latest`
Lancer un container basé sur l'image en bindant le port host et container 8081
`docker run -d -p 8081:8081 username/foliaback:latest`