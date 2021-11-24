'use strict';

const axios = require("axios");

const config = require('../../const');
const postgres = require("../../clients/postgres");
const { showResults } = require("../../middleware/showResults");

const SPOTIFY_URL = 'https://api.spotify.com/v1/playlists';

module.exports = async (req, res, next) => {
    const userId = req.body.user_id;

    try {
        const savedPlaylists = await postgres('playlist').where({ user_id: userId });

        let playlists = savedPlaylists.map((playlist) => ({
            spotifyId: playlist.spotify_id
        }));

        const tracksByPlaylists = await Promise.all(
            savedPlaylists.map((playlist) => {
                return postgres('track').where({ playlist_id: playlist.id })
            })
        );

        let i = 0;
        for (let playlist of playlists) {
            playlist = {
                ...playlist,
                tracksLength: tracksByPlaylists[i].length,
                tracks: tracksByPlaylists[i],
            }
            playlists[i] = playlist;
            i++;
        }

        for (const playlist of playlists) {
            let offset = 0;
            let limit = 50;
            const trackUris = playlist.tracks.map(track => track.spotify_uri);
            const playlistSize = playlist.tracksLength;

            while (offset <= playlistSize) {
                const { data } = await axios({
                    url: `${SPOTIFY_URL}/${playlist.spotifyId}/tracks`,
                    method: 'POST',
                    data: {
                        "uris": trackUris.slice(offset, offset+limit)
                    },
                    headers: {
                        'Authorization': `Bearer ${config.ACCESS_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                });

                offset += limit;
            }
        }

        req.info = {
            playlists
        }

        return showResults(req, res);

    } catch (err) {
        next(err);
    }
};