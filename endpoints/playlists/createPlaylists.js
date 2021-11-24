'use strict';

const axios = require('axios');

const config = require('../../const');
const postgres = require('../../clients/postgres');
const { showResults } = require('../../middleware/showResults');

const SPOTIFY_URL = 'https://api.spotify.com/v1/users';

module.exports = async (req, res, next) => {
    const userId = req.body.user_id;

    try {
        let spotifyUserId = await postgres('users').select('spotify_id').where({ id: userId });
            spotifyUserId = spotifyUserId[0].spotify_id;
        const savedPlaylists = await postgres('playlist').where({ user_id: userId });
        let playlistResponse = [];

        for (const playlist of savedPlaylists) {
            const { data } = await axios({
                url: `${SPOTIFY_URL}/${spotifyUserId}/playlists`,
                method: 'POST',
                data: {
                    name: playlist.name,
                    public: true,
                    collaborative: false,
                    description: playlist.description
                },
                headers: {
                    'Authorization': `Bearer ${config.ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            })
            playlistResponse.push(data);
        }

        const playlistSpotifyIds = playlistResponse.map(playlist => playlist.id);

        let i = 0;
        let promises = [];
        for (const playlist of savedPlaylists) {
            promises.push( postgres('playlist').where({ id: playlist.id }).update({ spotify_id: playlistSpotifyIds[i] }) );
            i++;
        }

        const playlistUpdates = await Promise.all(promises);

        req.info = {
            spotifyUserId,
            savedPlaylists,
            playlistSpotifyIds,
            playlistResponse,
            playlistUpdates
        }

        return showResults(req, res)
    
    } catch (err) {
        next(err);
    }

};