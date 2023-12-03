const btnNewTask = document.querySelector(".okTask");
const input = document.querySelector(".input");
const containerTask = document.querySelector("#container-list");
const popUp = document.querySelector(".pop-up");
const insertEdit = document.querySelector("#insert-edit");

const todoTasks = [];

class Task {
  constructor() {
    this.task = this.getTask();
    this.newTask();
  }

  getTask() {
    const task = input.value;
    if (task !== "") {
      input.value = "";
      todoTasks.push(task);
      return task;
    } else {
      console.error("Digite algo no campo input!");
      return null;
    }
  }

  newTask() {
    btnNewTask.textContent = "Adicionar"
    containerTask.innerHTML = "";
    todoTasks.forEach((task, index) => {
      const listItem = document.createElement("li");
      listItem.className = "task";
      listItem.innerHTML = `
        <button class="check"><i class="fa-solid fa-check"></i></button>
        <p id="task-value">${task}</p>
        <div class="buttons">
          <button class="remove" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
          <button class="edit"><i class="fa-solid fa-pen"></i></button>
        </div>
      `;

      containerTask.appendChild(listItem);

      // Adicionar ouvinte de evento para os botões de remoção
      const removeButton = listItem.querySelector(".remove");
      removeButton.addEventListener("click", () => {
        input.value = "";
        const index = parseInt(removeButton.dataset.index, 10);
        this.removeTask(index);
      });

      const checkButton = listItem.querySelector(".check");
      checkButton.addEventListener("click", () => {
        input.value = "";
        listItem.classList.remove("edit");
        listItem.classList.add("completed");
      });

      const editButton = listItem.querySelector(".edit");
      editButton.addEventListener("click", () => {
        btnNewTask.textContent = "Adicionar Edição"
        listItem.classList.remove("completed");
        listItem.classList.add("edit");

        const taskValue = listItem.querySelector("#task-value").textContent;
        input.value = taskValue.trim(); // Remover espaços em branco do início e do final

        const removeTaskOnClick = () => {
          // Remove a tarefa atual da lista
          this.removeTask(index);

          // Atualiza a lista após remover a tarefa
          this.newTask();

          // Remove o ouvinte de evento após a execução
          btnNewTask.removeEventListener("click", removeTaskOnClick);
        };

        // Adiciona o ouvinte de evento apenas uma vez para o botão "Ok"
        btnNewTask.addEventListener("click", removeTaskOnClick);
      });
    });

    localStorage.setItem("todoTasks", JSON.stringify(todoTasks));
  }

  removeTask(index) {
    todoTasks.splice(index, 1);
    this.newTask(); // Atualiza a interface do usuário após remover uma tarefa
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const storedTasks = JSON.parse(localStorage.getItem("todoTasks"));
  if (storedTasks) {
    todoTasks.push(...storedTasks);
    new Task(); // Atualiza a interface com as tarefas armazenadas
  }
});

btnNewTask.addEventListener("click", () => {
  new Task();
});

document.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    new Task();
  }
});
