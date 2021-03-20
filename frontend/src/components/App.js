import { useState, useEffect, useRef } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import Loader from './Loader'
import Header from './Header'
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import AddPlacePopup from './AddPlacePopup';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import ImagePopup from './ImagePopup';
import InfoTooltip from './InfoTooltip';

import { api } from '../utils/api';
import { CurrentUserContext } from '../context/CurrentUserContext';
import { setCustomErrorMessages, defaultValidationMessage, defaultSubmitButtons, defaultSubmitTitle } from '../utils/utils';

function App() {
  const { push } = useHistory();

  // авторизация и лоадер
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(false);

  // модальные окна
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ isOpen: false, currentCard: {} });
  const [authInfo, setAuthInfo] = useState({ isOpen: false, message: '' });

  // данные пользователя и карточек
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  // кнопки и валидация
  const [saveButtonTitle, setSaveButtonTitle] = useState(defaultSubmitTitle.save);
  const [addButtonTitle, setAddButtonTitle] = useState(defaultSubmitTitle.add);
  const [confirmButtonTitle, setConfirmButtonTitle] = useState(defaultSubmitTitle.confirm);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(defaultSubmitButtons);
  const [validationMessage, setValidationMessage] = useState(defaultValidationMessage);

  const inputsRef = useRef(new Set());

  useEffect(() => {
    setIsAppLoading(true);

    api.getUserData()
      .then(user => {
        if (!user._id) return setIsAppLoading(false);

        setCurrentUser(user);
        setIsLoggedIn(true);
        push('/')
      })
      .catch(alert)
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return;

    api.getInitialCards()
      .then(setCards)
      .catch(alert)
      .finally(() => setIsAppLoading(false))
  }, [isLoggedIn])

  // регистрация, авторизация и выход
  function onRegister(newData) {
    api.register(newData)
      .then(({ message }) => {
        setAuthInfo({ isOpen: true, message });
        if (message === 'Вы успешно зарегистрировались!') push('/sign-in')
      })
      .catch(alert)
  }

  function onLogin(data) {
    setIsAppLoading(true);

    api.authorize(data)
      .then(user => {
        if (!user._id) {
          setAuthInfo({ isOpen: true, message: user.message });
          setIsAppLoading(false);
          return
        }

        setCurrentUser(user);
        setIsLoggedIn(true);
        push('/')
      })
      .catch(alert)
  }

  function onSignOut() {
    api.signOut()
      .then(({ message }) => {
        if (!message) return;

        setIsLoggedIn(false);
        push('/sign-in')
      })
      .catch(alert)
  }

  // валидация
  function handleChange(input) {
    setCustomErrorMessages(input);

    inputsRef.current.add(input);

    const isDisabled = !input.form.checkValidity();

    setIsSubmitDisabled(prevState => ({ ...prevState, [input.form.id]: isDisabled }));
    setValidationMessage(prevState => ({ ...prevState, [input.id]: input.validationMessage }));
  }

  // обработчики для сетевых запросов
  function handleUpdateUser(newUser) {
    setSaveButtonTitle('Сохранение <span class ="dot">.</span>')

    api.updateUserData(newUser)
      .then(user => {
        if (!user._id) return setAuthInfo({ isOpen: true, message: user.message });

        setCurrentUser(user);
        closeAllPopups()
      })
      .catch(alert)
      .finally(() => setSaveButtonTitle(defaultSubmitTitle.save))
  }

  function handleUpdateAvatar(newAvatar) {
    setSaveButtonTitle('Сохранение <span class ="dot">.</span>')

    api.updateAvatar(newAvatar)
      .then(user => {
        if (!user._id) return setAuthInfo({ isOpen: true, message: user.message });

        setCurrentUser(prevState => ({ ...prevState, avatar: user.avatar }));
        closeAllPopups()
      })
      .catch(alert)
      .finally(() => setSaveButtonTitle(defaultSubmitTitle.save))
  }

  function handleAddPlaceSubmit(newCard) {
    setAddButtonTitle('Добавление <span class ="dot">.</span>')

    api.addCard(newCard)
      .then(card => {
        setCards([card, ...cards])
        closeAllPopups()
      })
      .catch(alert)
      .finally(() => setAddButtonTitle(defaultSubmitTitle.add))
  }

  const idRef = useRef();

  function handleCardDelete(event) {
    event.preventDefault();
    setConfirmButtonTitle('Удаление <span class ="dot">.</span>')

    api.deleteCard(idRef.current)
      .then(({ message }) => {
        if (!/удалена$/.test(message)) return setAuthInfo({ isOpen: true, message });

        const newCards = cards.filter(item => item._id !== idRef.current);
        setCards(newCards)
        closeAllPopups()
      })
      .catch(alert)
      .finally(() => setConfirmButtonTitle(defaultSubmitTitle.confirm))
  }

  function handleCardLike(cardId, isLiked) {
    if (isLiked) {
      api.deleteLike(cardId)
        .then(card => {
          if (card.likes.some(item => item !== currentUser._id) || !card.likes.length) {
            setCards(prevState => prevState.map(item => item._id === cardId ? card : item))
          }
        })
        .catch(alert)
    } else {
      api.addLike(cardId)
        .then(card => {
          if (card.likes.some(item => item === currentUser._id)) {
            setCards(prevState => prevState.map(item => item._id === cardId ? card : item))
          }
        })
        .catch(alert)
    }
  }

  // открытие и закрытие модалок
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }

  function handleCardClick(card) {
    setSelectedCard({ isOpen: true, currentCard: card })
  }

  function handleConfirmClick(cardId) {
    idRef.current = cardId;
    setIsConfirmPopupOpen(true)
  }

  function closeAllPopups() {
    setIsSubmitDisabled(defaultSubmitButtons);
    setValidationMessage(defaultValidationMessage);
    inputsRef.current.forEach(input => input.setCustomValidity(''));
    inputsRef.current.clear();

    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmPopupOpen(false)
    setSelectedCard(prevState => ({ ...prevState, isOpen: false }));
    setAuthInfo(prevState => ({ ...prevState, isOpen: false }))
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        {isAppLoading && <Loader />}
        <Header isLoggedIn={isLoggedIn} onSignOut={onSignOut} />
        
        <Switch>
          <Route path="/sign-in">
            <Login
              isDisabled={isSubmitDisabled['auth-form']}
              errors={validationMessage}
              handleChange={handleChange}
              onLogin={onLogin}
            />
          </Route>

          <Route path="/sign-up">
            <Register
              isDisabled={isSubmitDisabled['auth-form']}
              errors={validationMessage}
              handleChange={handleChange}
              onRegister={onRegister}
            />
          </Route>

          <ProtectedRoute path="/" isLoggedIn={isLoggedIn}>
            <Main
              cards={cards}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleConfirmClick}
              onAddPlace={handleAddPlaceClick}
              onEditProfile={handleEditProfileClick}
              onEditAvatar={handleEditAvatarClick}
            />
            
            <Footer />

            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              isDisabled={isSubmitDisabled['add-form']}
              submitButton={addButtonTitle}
              errors={validationMessage}
              onClose={closeAllPopups}
              handleChange={handleChange}
              onAddPlace={handleAddPlaceSubmit}
            />

            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              isDisabled={isSubmitDisabled['edit-form']}
              submitButton={saveButtonTitle}
              errors={validationMessage}
              onClose={closeAllPopups}
              handleChange={handleChange}
              onUpdateUser={handleUpdateUser}
            />

            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              isDisabled={isSubmitDisabled['avatar-form']}
              submitButton={saveButtonTitle}
              errors={validationMessage}
              onClose={closeAllPopups}
              handleChange={handleChange}
              onUpdateAvatar={handleUpdateAvatar}
            />

            <PopupWithForm
              title='Вы уверены'
              name='confirm-form'
              button={confirmButtonTitle}
              isOpen={isConfirmPopupOpen}
              onClose={closeAllPopups}
              onSubmit={handleCardDelete}
            />

            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          </ProtectedRoute>

          <ProtectedRoute path="*" isLoggedIn={isLoggedIn}>
            <div>404(NotFound)</div>
          </ProtectedRoute>
        </Switch>

        <InfoTooltip info={authInfo} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App
