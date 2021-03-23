class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers
  }

  _request(endPoint, method, body) {
    return fetch(
      `${this._baseUrl}/${endPoint}`,
      {
        method,
        credentials: "include",
        headers: this._headers,
        body:JSON.stringify(body)
      }
    ).then(res => res.json())
  }

  register(newData) {
    return this._request('signup', 'POST', newData)
  }

  authorize(data) {
    return this._request('signin', 'POST', data)
  }

  signOut() {
    return this._request('signout')
  }

  getUserData() {
    return this._request('users/me')
  }

  getInitialCards() {
    return this._request('cards')
  }

  updateUserData(newData) {
    return this._request('users/me', 'PATCH', newData)
  }

  updateAvatar(newAvatar) {
    return this._request('users/me/avatar', 'PATCH', newAvatar)
  }

  addCard(newCard) {
    return this._request('cards', 'POST', newCard)
  }

  deleteCard(cardId) {
    return this._request(`cards/${cardId}`, 'DELETE')
  }

  addLike(cardId) {
    return this._request(`cards/${cardId}/likes`, 'PUT')
  }

  deleteLike(cardId) {
    return this._request(`cards/${cardId}/likes`, 'DELETE')
  }
}

export const api = new Api(
  {
    // baseUrl: 'http://localhost:5000',
    baseUrl: 'https://api.happytravels.nomoredomains.icu',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    }
  }
)
