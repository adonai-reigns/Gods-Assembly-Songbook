# song metadata

Standardise song metadata for import/export and backups

- title
- copyright (author/publisher/year/url)
- category/tags

# import/export

Ability to export songs:

- export selected songTemplates/all songTemplates
- export selected playlists/all playlists
- export format option:
    - json
    - text

Ability to import songs:

- multiple-file uploader for json or text files
- format validation of file structure with useful fail notices 

Ability to import/export wallpaper and settings
- format: json
- validation: implement document api version for forwards-compatibility

- zip compression for exports of multiple files

# upload/playback backing music

- Ability to upload a music file to the songTemplate
- Ability to play the backing music when the song changes
- UI to configure slide duration
- Update Import/export scripts to include slide duration & music

# next-slide preempt

- The first line of the next slide should show on the screen before the next slide begins

# slide repeat

- Ability to configure a repeat of a slide (eg: when a chorus should be repeated x times)

# songleader screens synchronisation

- Multiple songleaders can run the same songlist in playback mode without conflict
- Event listeners and emitters to propagate events (change slide, change song, etc)
- Screen username for event logs, record event log

# bandmember screen

- Ability to add chord names and position chord changes relative to the lyrics
- A new screen similar to audience view but for instrumentalists, that shows the chords 
- Update Import/export scripts to include chord changes relative to lyrics


