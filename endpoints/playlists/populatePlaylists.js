'use strict';

const postgres = require("../../clients/postgres");
const { showResults } = require("../../middleware/showResults");

module.exports = async (req, res, next) => {
    const userId = req.body.user_id;

    try {
        const savedPlaylists = await postgres('playlist').where({ user_id: userId });

        let playlists = savedPlaylists.map((playlist) => ({
            playlistId: playlist.spotify_id
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

        // for each array of tracks, send to spotify api
            // if tracks.length > 100, need to paginate


        req.info = {
            playlists
        }

        return showResults(req, res);

    } catch (err) {
        next(err);
    }
};