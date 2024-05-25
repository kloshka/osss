//считывание данные с форм ввода
let Password = document.querySelector('#Password');
let RepeatPassword = document.querySelector('#RepeatPassword');
let Name = document.querySelector('#UserName'); 

let submit = document.querySelector('.button') //для кнопки зарегаться

let users = {};

//функция для создания объекта для нового пользователя
function User(Name, Password){
    this.Name = Name;
    this.Password = Password;
}

function createId(users){
    return Object.keys(users).length;
}

//Что происходит при нажатии на кнопку зарегистрироваться
submit.addEventListener('click', () => {
    const UserName = Name.value;
    const UserPassword = Password.value;
    const UserRepeatPassword = RepeatPassword.value;

    if (UserPassword === UserRepeatPassword){ 
        const user = new User(UserName, UserPassword);
        const UserId = 'User' + createId(users);
        if (Object.values(users).some(existingUser => existingUser.name === user.name && existingUser.password === user.password)) {
            alert('Пользователь с таким именем и паролем уже существует.');
        }
        else{
            users[UserId] = user;
            console.log(users); // нужен для проверки
        }
    }
    else{
        alert('Пароли не совпадают')
    }
})

