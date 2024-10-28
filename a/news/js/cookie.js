function waitUntilElementExists(selector, callback) {
  const el = document.querySelector(selector);
  if (el) {
    callback(el);
    const cookieButton = document.getElementById('cookie-bar-btn');
const additionBlock = document.querySelector('.addition');

// Функция для скрытия блока с сообщением об использовании куков
function hideAdditionBlock() {
  additionBlock.style.display = 'none';
}

// Функция для установки куки на 24 часа
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = 'expires=' + date.toUTCString();
  document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

// Функция для получения значения куки по имени
function getCookie(name) {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf(name + '=') === 0) {
      return cookie.substring(name.length + 1, cookie.length);
    }
  }
  return '';
}

// Проверяем, была ли установлена куки
if (!getCookie('cookieAccepted')) {
  // Если куки нет, показываем блок с сообщением об использовании куков
  additionBlock.style.display = 'block';

  // Назначаем обработчик события клика на кнопку
  cookieButton.addEventListener('click', function() {
    // Устанавливаем куки на 24 часа
    setCookie('cookieAccepted', 'true', 1);

    // Скрываем блок с сообщением об использовании куков
    hideAdditionBlock();
  });
} else {
  // Если куки уже есть, скрываем блок с сообщением об использовании куков
  hideAdditionBlock();
}
  } else {
    setTimeout(() => waitUntilElementExists(selector, callback), 500);
  }
}

waitUntilElementExists('.addition', (el) => {

});
