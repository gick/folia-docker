FROM node:8.9.4

MAINTAINER pgicquel <pygicq@kuniv-lemans.fr>

RUN npm install pm2 -g
RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list

RUN apt-get update 
RUN apt-get install -y unzip wget curl build-essential \
                cmake git pkg-config libswscale-dev \
                python3-dev python3-numpy \
                libtbb2 libtbb-dev libjpeg-dev \
                libpng-dev libtiff-dev libjasper-dev libgtk2.0-dev


RUN cd \
        && wget https://github.com/Itseez/opencv/archive/3.1.0.zip \
        && unzip 3.1.0.zip \
        && cd opencv-3.1.0 \
        && mkdir build \
        && cd build \
        && cmake .. \
        && make -j3 \
	      && make install \
	      && cd \
	      && rm 3.1.0.zip

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

ENV LD_LIBRARY_PATH /usr/local/lib
ENV NODE_ENV production

COPY . .
EXPOSE 8081 8082
CMD [ "pm2-runtime", "ecosystem.config.js","--only","folia-server","--env","production" ]
