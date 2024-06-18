const axios = require('axios');

const revokeToken = async (token) => {
    const revokeUrl = `https://oauth2.googleapis.com/revoke?token=${token}`;
    try {
        await axios.post(revokeUrl, {}, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log('Token revoked successfully');
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error === 'invalid_token') {
            console.log('Token is already expired or revoked');
        } else {
            console.error('Error revoking token', error);
        }
    }
};

module.exports = revokeToken;