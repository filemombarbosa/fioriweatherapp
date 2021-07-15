<p align="center">
  <a href="#">
    <img src="https://iili.io/oRYR6J.png" width="234" height="163" alt="" />
  </a>
</p>

<p align="center">Simple Weather App for Fiori Like Needs! 🚀</p>


## Overview
Fiori Weather App is an web application developed using SAPUI5 freestyle, which provides information about the weather for a given city. The application is designed using the TDD (Test-Driven Development) approach and others best practices development techniques. 

- **Weather API** - https://openweathermap.org

## How to use

### How to setup the development environment

### API Configuration
- Go to the file located at **/webapp/config/openweathermap.json** 
- Enter your **API Key** or get one in case you don't have, at https://home.openweathermap.org/users/sign_up (The free one is enough).

### How run locally:
**Prerequisites to run locally**
- Git.
- Nodejs.

Run the following commands in your console:
```bash
# Download the App from the Repository
git clone https://github.com/filemombarbosa/fioriweatherapp.git
```

```bash
# Start the App at port 9190
npm start
```

```bash
# Optional - Start the App at any port of your choice
PORT=[PORT NUMBER] npm start
```

Open the URL shown in the console:
```bash
http://localhost:[PORT NUMBER]/index.html 
```

<!-- ### How run in Docker:
**Prerequisites to run in Docker**
- Docker environment installed (https://docs.docker.com/get-started/)

```bash
$ docker run filemombarbosa/latest
``` 

Open the URL shown in the console:
```bash
http://localhost:9091/index.html
```
-->

### How run the Unit Tests 
Run the following command in your console:
```bash
# Get the url of the Unit Tests runner
npm test
```
Open the URL shown in the console:
```bash
http://localhost:[PORT NUMBER]/test/unit/unitTests.qunit.html
```

### How to deploy the app

#### Option 1 - Generic Web Hosting:
  Host the content of the **webapp folder** by exposing the index like at the **public_html** folder of the server.

<!-- #### Option 2 - Docker Hosting:
  Deploy the Docker image in the server. -->

#### Option 2 - Deploy the app on the SAP Netweaver AS as an BSP Application:
  Import the content of the **webapp folder** to the SAP Netweaver AS using the **/ui5/ui5_repository_load** ABAP report program.

### Autor

<a href="https://www.linkedin.com/in/filemom-barbosa-14095372/">
 <img style="border-radius: 50%;" src="https://avatars.services.sap.com/images/filemombarbosa.png" width="100px;" alt=""/>
 <br />
 <sub><b>Filemom Barbosa</b></sub></a> <a href="https://github.com/filemombarbosa title="Github">🚀</a>  <br />

[![Sap Badge](https://img.shields.io/badge/-@filemombarbosa-1ca0f1?style=flat-square&labelColor=1ca0f1&logo=sap&logoColor=white&link=https://twitter.com/filemombarbosa)](https://people.sap.com/filemombarbosa) 
[![Linkedin Badge](https://img.shields.io/badge/-Filemom-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/filemombarbosa/)](https://www.linkedin.com/in/filemom-barbosa-14095372/) 
[![Gmail Badge](https://img.shields.io/badge/-filemombarbosa@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:filemombarbosa@gmail.com)](mailto:filemombarbosa@gmail.com)