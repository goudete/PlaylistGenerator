'use strict';

const axios = require('axios');

const config = require('../../const');
const postgres = require('../../clients/postgres');
const { showResults } = require('../../middleware/showResults');

const SPOTIFY_URL = 'https://api.spotify.com/v1/users';

module.exports = async (req, res, next) => {
    const userId = req.body.user_id;

    try {
        const savedPlaylists = await postgres('playlist').where({ user_id: userId });

        const createPlaylistPromises = await Promise.all(
            savedPlaylists.map((playlist) => {
                return axios({
                    url: `${SPOTIFY_URL}/${userId}/playlists`,
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
            })
        )

        const playlistResponse = createPlaylistPromises.map(playlist => playlist.data.id);

        // grab playlists' ids and save
        // let i = 0;
        // const playlistUpdates = await Promise.all(
        //     playlistResponseIds.map((id) => {
        //         return postgres('playlist').where({spotify_id: track.id}).update({ spotify_id: })
        //     })
        // );

        req.info = {
            savedPlaylists,
            playlistResponse,
        }

        return showResults(req, res)
    
    } catch (err) {
        next(err);
    }

};