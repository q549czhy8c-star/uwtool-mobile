# UW Assessment Tool Mobile (v2.8.5)

This repo is a **mobile app scaffold (iOS/Android)** built with **Expo (React Native)**.

## Source of truth
- `assets/V2.8.5.txt` is the single source of truth.
- Run `npm run generate:data` to extract the built-in data tables/constants into `app/data/`.

## Setup
```bash
npm install
npm run generate:data
npm run start
```

## Notes
- Core constants and key rules are implemented:
  - `USD_RATE=7.8`, `FIN_USD_RATE=8.0`, `MED_CHECK_RATE=8.0`
  - Commission Spreading + PI checklist append (with prefix dedupe)
  - TSA(All) uses `FIN_USD_RATE`
  - Text Splitter / Pending / Exclusion / Occupation DB / Master Broker search
  - Local persistence uses AsyncStorage

## Build
Use EAS if you want distributable builds:
```bash
npm i -g eas-cli
npx eas-cli build -p android
npx eas-cli build -p ios
```

## GitHub release suggestion
- Create a private/public repo
- Upload everything in this folder
- Add a simple Release note with version `v2.8.5`
