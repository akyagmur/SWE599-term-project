# SWE599 Term Project - I am safe

## Introduction

This project is a part of SWE599 course. The aim of this project is to develop a web application that can be used to track the location of the user and send notifications to the user when the user is in a dangerous area. The application will be developed using React Native and Firebase. The application will be developed for iOS platform.

## Tools used

- React Native(https://reactnative.dev/)
- Expo(https://expo.io/)
- Firebase(https://firebase.google.com/)
    - Authentication(https://firebase.google.com/docs/auth)
    - Cloud Firestore(https://firebase.google.com/docs/firestore)
    - Cloud Functions(https://firebase.google.com/docs/functions)
- OneSignal(https://onesignal.com/)

## How to run

This project is developed using Expo. To run the project, you need to install Expo CLI. You can install Expo CLI by running the following command.

### Cloud Functions
Also, for backend, cloud functions are used. 
Functions are deployed using Firebase CLI. You can install Firebase CLI by running the following command.
```
npm install -g firebase-tools
```
You can find the repository of the cloud functions [here](https://github.com/akyagmur/SWE599-Term-Project-Cloud-Functions.git)

### OneSignal
OneSignal is used for push notifications. You need to create an account on OneSignal and create an app. You can find the documentation [here](https://documentation.onesignal.com/docs/react-native-sdk-setup)
Also, if you want to test push notifications you will need a p8 or p12 certificate. You can find the documentation [here](https://documentation.onesignal.com/docs/generate-an-ios-push-certificate)

### Installation
- Clone the repository
```
git clone {repository_url}
```

- Install dependencies
```
npm install
```

- Run the application
```
npm start
```

or

```
expo start
```
