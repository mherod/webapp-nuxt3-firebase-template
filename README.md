# webapp-nuxt3-firebase-template

> A template for a webapp using Nuxt 3, Vue, deployed to Firebase Hosting

## What's so special about this template?

Amongst actually working, this template is correctly configured to deploy to Firebase Hosting.

It includes a deployment fix for deploying the Nitro server to Firebase functions, as the officially advised method has
an issue.

It also includes a couple of opinion driven preferences, as a WebStorm user, for the project structure.

## Setup

Install dependencies with
`yarn` or `npm install`

``` bash
yarn install
```

### Configuring Firebase deploy target `!important`

Run the setup script to create a new project from this template. It will ask you for Firebase Project ID and the name of
the Firebase Hosting site.

``` bash
ts-node setup.ts
```

## Deploying

The project is configured to deploy to Firebase Hosting. To deploy, run:

``` bash
yarn deploy
```

This will build the project and deploy the result to Firebase via Hosting for static web resources and Cloud Functions
for the
Nitro server.
