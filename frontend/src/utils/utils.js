export const defaultSubmitTitle = {
  save: 'Сохранить',
  add: 'Добавить',
  confirm: 'Да'
}

export const defaultSubmitButtons = {
  'auth-form': true,
  'edit-form': false,
  'add-form': true,
  'avatar-form': false,
}

export const defaultValidationMessage = {
  'email': '',
  'password': '',
  'person': '',
  'about': '',
  'avatar-link': '',
  'name': '',
  'link': ''
}

const errorMessage = {
  '^[а-яёЁА-Я\\w,.-]+(\\s[а-яёЁА-Я\\w,.-]+)*': 'Введите текст, содержащий буквенные символы',
  '^https?:\\/\\/(www\\.)?.+\\..+$': 'Введите корректный URL',
  '^[\\w.-]{2,}@([\\w-]{2,}\\.)+[\\w-]{2,}': 'Введите корректный email (например, example@pochta.com)',
  '^\\w{6,12}': 'Введите цифры или латинские буквы (6-12 символов)'
}

export function setCustomErrorMessages(input) {
  input.setCustomValidity('');
  if (input.validity.patternMismatch) input.setCustomValidity(errorMessage[input.pattern])
}

export const closeByOverlay = func => event => event.target === event.currentTarget && func()
