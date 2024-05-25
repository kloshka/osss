//считывание данные с форм ввода
let Password = document.querySelector('#Password');
let Name = document.querySelector('#UserName'); 

let submit = document.querySelector('.button') //для кнопки войти

//функция для создания объекта для нового пользователя
function User(Name, Password){
    this.Name = Name;
    this.Password = Password;
}


submit.addEventListener('click', () => {
    const UserName = Name.value;
    const UserPassword = Password.value;

    const user = new User(UserName, UserPassword);

    console.log(user);
})
