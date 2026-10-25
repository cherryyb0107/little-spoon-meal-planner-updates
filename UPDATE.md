# Automatic app updates

The Windows desktop app checks the public GitHub Releases feed for `cherryyb0107/little-spoon-meal-planner-updates` when it starts. It downloads a published update and asks to restart to apply it. Planner settings remain in the user's Windows app-data directory.

To publish a future version:

1. Update `desktop/package.json` and `desktop/package-lock.json` to the next version.
2. Commit and push the changes to `main`.
3. Create and push the matching tag, for example `v2.0.4`.

The GitHub Actions workflow builds the Windows installer, update metadata, and block map, then uploads all three to a GitHub Release. The installed app applies later releases without downloading a separate installer manually.

The first version that includes this update feed must be installed once because earlier builds have no update feed configured.
