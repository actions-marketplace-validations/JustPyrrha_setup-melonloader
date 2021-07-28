# Setup MelonLoader Action
Download MelonLoader for building Unity mods in CI.

## Inputs

### `version`
This is the version of MelonLoader you want to download. Using `latest` will download the latest "stable" version from the MelonLoader [releases](https://github.com/LavaGang/MelonLoader/releases) page.\
To use a specific release you can put in the tag relating to a release in e.g: `v0.4.3` (`v` is optional)\
You can also use an `alpha-development` build: `alpha#<ci build number>`, omit `#000` for latest, e.g: `alpha#498` or `alpha`.\
Note: If the output artifact for the provided build number has expired the action will fail.

### `path`
The path you want to download MelonLoader to.\
This will default to the current working directory.

### `cache`
Whether or not to cache MelonLoader files.\
Either `true` or `false`, defaults to `true`.

