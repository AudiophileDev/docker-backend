# base image
FROM ubuntu:14.04

RUN apt-get update
# Install Node.js
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -
RUN apt-get install --yes nodejs
RUN apt-get install --yes build-essential
RUN apt-get install -y software-properties-common
# Install Java.
RUN \
  echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | debconf-set-selections && \
  add-apt-repository -y ppa:webupd8team/java && \
  apt-get update && \
  apt-get install -y oracle-java8-installer && \
  rm -rf /var/lib/apt/lists/* && \
  rm -rf /var/cache/oracle-jdk8-installer 


# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# Define commonly used JAVA_HOME variable
ENV JAVA_HOME /usr/lib/jvm/java-8-oracle

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json

RUN npm install --silent

COPY . /usr/src/app

EXPOSE 1247

# start app
CMD ["npm", "start"]