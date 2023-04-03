const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

//Добавление задачи
form.addEventListener("submit", addTask);

//Удаление задачи
tasksList.addEventListener("click", deleteTask);

//Отмечаем завершённые задачи
tasksList.addEventListener("click", doneTask);

//Функции
function addTask(e) {
  //Отмена отправки формы
  e.preventDefault();

  //Получение текста задачи из поля ввода
  const taskText = taskInput.value;

  //Описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  //Добавляем задачу в массив с задачами
  tasks.push(newTask);

  //Сохраняем массив в localStorage
  saveToLocalStorage();

  //Формирование css класса Формирование разметки для новой задачи Добавление задачи на страницу
  renderTask(newTask);

  //Очистка поля ввода и возвращение на него фокуса
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();

  /*Если в списке задач более одного элемента,картинка скрывается
  if (tasksList.children.length > 1) {
    emptyList.classList.add("none");
  }*/
}

function deleteTask(e) {
  //Если клик был НЕ по кнопке "удалить задачу", мы выходим из функции
  if (e.target.dataset.action !== "delete") return;

  //Проверка,что клик был по кнопке "удалить задачу"
  const parentNode = e.target.closest(".list-group-item");

  //Определяем id задачи
  const id = Number(parentNode.id);

  /*Находим индекс задачи в массиве
  const index = tasks.findIndex((task) => task.id === id);

  Удаляем задачу из массива с задачами
  tasks.splice(index, 1)*/

  //Удаление задачи через фильтрацию массива
  tasks = tasks.filter((task) => task.id !== id);

  //Сохраняем список задач в localStorage
  saveToLocalStorage();

  //Удаляем задачу из разметки
  parentNode.remove();

  checkEmptyList();

  /*Добавляем картинку пустого списка,если задач нет
  if (tasksList.children.length === 1) {
    emptyList.classList.remove("none");
  }*/
}

function doneTask(e) {
  //Проверяем,если клик был НЕ по кнопке "Задача выполнена"
  if (e.target.dataset.action !== "done") return;

  //Если клик был куда надо
  const parentNode = e.target.closest(".list-group-item");

  //Определяем id задачи
  const id = Number(parentNode.id);

  const task = tasks.find((task) => task.id === id);

  task.done = !task.done;

  //Сохраняем список задач в localStorage
  saveToLocalStorage();

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
    <div class="empty-list__title">Список дел пуст</div>
  </li>`;

    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  } else if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  //Формирование css класса
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  //Формирование разметки для новой задачи
  const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
<span class="${cssClass}">${task.text}</span>
<div class="task-item__buttons">
 <button type="button" data-action="done" class="btn-action">
   <img src="./img/tick.svg" alt="Done" width="18" height="18">
 </button>
 <button type="button" data-action="delete" class="btn-action">
   <img src="./img/cross.svg" alt="Done" width="18" height="18">
 </button>
</div>
</li>`;

  //Добавление задачи на страницу
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}

/*Неправильный вариант с сохранением в localStorage
(функцию после создания необходимо добавить в конец функций с добавлением,удаоением и выполнением задач)
function saveHTMLtoLS() {
  localStorage.setItem("tasksHTML", tasksList.innerHTML);
}*/

/*Добавление задач из хранилища на страницу после перезагрузки
if(localStorage.getItem('tasksHTML')){
  tasksList.innerHTML = localStorage.getItem('tasksHTML')
}*/
