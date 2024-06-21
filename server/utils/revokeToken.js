const axios = require('axios');

const revokeToken = async (token) => {
  const revokeUrl = `https://oauth2.googleapis.com/revoke?token=${token}`;
  try {
    await axios.post(
      revokeUrl,
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error === 'invalid_token'
    ) {
    } else {
      console.error('Error revoking token', error);
    }
  }
};

module.exports = revokeToken;
