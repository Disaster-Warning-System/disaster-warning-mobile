# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Hazard reports

Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` to the backend origin (without the `/api/hazard-reports` path) before starting the app. For local web development or an Android emulator, `http://localhost:5000` is usually correct. For Expo Go on a physical device, replace `localhost` with the computer's LAN IP address, for example `http://192.168.1.10:5000`, and make sure the device and computer are on the same network. Do not put credentials or secrets in this public Expo variable.

Hazard reports waiting for connectivity on Android and iOS are stored in a SQLCipher-encrypted SQLite database. The encryption key is held in SecureStore. SQLCipher is not supported in Expo Go, so use an Expo development build after applying the configured native plugins. The encrypted pending-report queue is mobile-only.

Photos are selected with the camera or gallery and remain local until a report can be sent. When online, the app uploads the photo as multipart form data to `POST /api/uploads/hazard-photo`, then submits the returned `photoFileId` with the report. Offline reports retain their local image URI and perform those steps when connectivity returns; a queued report is removed only after report creation succeeds. The backend stores photos in MongoDB GridFS (not Base64 or cloud storage). JPEG, PNG, and WebP are accepted up to 5 MB.

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
