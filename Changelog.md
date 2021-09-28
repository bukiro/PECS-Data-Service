# Changelog

This log tracks only major changes.

## 1.0.0

- First published for other people to use, including a readme and a version number, and excluding development files.
- Can load, save and delete characters.

## 1.0.1

- Messages have been introduced.

## 1.0.2

- The app is now available as a standalone executable.
- The required database collections will be created automatically.

## 1.0.3

- Messages are now handled completely in the service and don't use the database connection anymore.
- The messages parameter is not used anymore. You can delete your MongoDB messages collection. All messages will disappear when you stop the service.
- The app now uses a local data file to store characters. The MongoDB connection remains an optional alternative.

## 1.0.4

- The service can now optionally protect PECS with a password.

## 1.0.5

- The path for the local data file has been changed, and the file will automatically be moved.