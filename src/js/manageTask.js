import State from "./currentState";
import SaveInStorage from "./saveInStorage";

export default class ManageTask {
    constructor() {
        this.containerEl = document.getElementsByClassName('container')[0];
        this.currentState = new State();
        this.storage = new SaveInStorage(localStorage);
        this.draggedEl = null;
        this.ghostEl = null;
        this.window = null;
        this.infoObj = {};
        this.gapTask = 0;
        this.addTaskEl = document.querySelector('.addtask_first');
        this.addTaskElSecond = document.querySelector('.addtask_second');
        this.addTaskElThird = document.querySelector('.addtask_third');
        this.blockEl = this.addTaskEl.closest('.block');
        this.blockElSecond = this.addTaskElSecond.closest('.block');
        this.blockElThird = this.addTaskElThird.closest('.block');
        this.formToDoEl = document.querySelector('.toDo');
        this.formProgressEl = document.querySelector('.progress');
        this.formDoneEl = document.querySelector('.done');

    }


    init() {
        let cardEl = document.querySelector('.task');
        const styles = window.getComputedStyle(cardEl);
        this.gapTask = parseInt(styles.margin);
        let obj = this.storage.getFromStorage();
        this.currentState = State.from(obj);
        this.addCurrentTask();
        this.addListeners();
        // this.storage.clearStorage();
    }

    removeTasks(blockEl) {
        let taskEls = blockEl.querySelectorAll('.task');
        if (taskEls) {
            for (const t of taskEls) {
                t.remove();
            }
        }
    }

    createTaskEl(elAdd, arrayState) {
        for (const task of arrayState) {
            let newTaskEl=document.createElement('div');
            newTaskEl.classList.add('task');
            newTaskEl.textContent = task;
            let newEl = document.createElement('span');
            newEl.classList.add('cross');
            newTaskEl.insertAdjacentElement('beforeend', newEl);
            elAdd.before(newTaskEl);
        }
    }

    addCurrentTask() {
        this.removeTasks(this.blockEl);
        this.createTaskEl(this.addTaskEl, this.currentState.taskArrayToDo);
        this.removeTasks(this.blockElSecond);
        this.createTaskEl(this.addTaskElSecond, this.currentState.taskArrayProgress);
        this.removeTasks(this.blockElThird);
        this.createTaskEl(this.addTaskElThird, this.currentState.taskArrayDone);
    }

    overwriteTasks () {
        let arrayToDo = this.blockEl.querySelectorAll('.task');
        this.currentState.taskArrayToDo = [];
        for (const el of arrayToDo) {
            this.currentState.taskArrayToDo.push(el.textContent);
        }
        let arrayProgress = this.blockElSecond.querySelectorAll('.task');
        this.currentState.taskArrayProgress = [];
        for (const el1 of arrayProgress) {
            this.currentState.taskArrayProgress.push(el1.textContent);
        }
        let arrayDone = this.blockElThird.querySelectorAll('.task');
        this.currentState.taskArrayDone = [];
        for (const el2 of arrayDone) {
            this.currentState.taskArrayDone.push(el2.textContent);
        }
    }

    addListeners() {
        
        const butNoneArray = document.querySelectorAll('.X');
        for (const but of butNoneArray) {
            but.addEventListener('click', () => {
                const form = but.closest('.addtext');
                form.style.display = 'none';
                form.querySelector('.text').value = '';
            })
        }

        let butAddArray = document.getElementsByClassName('Add');
        for (const button of butAddArray) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const form = button.closest('.addtext');
                let newTaskEl=document.createElement('div');
                newTaskEl.classList.add('task');
                let textEl = e.target.previousElementSibling.previousElementSibling;
                console.log("textEl", textEl.value)
                newTaskEl.textContent = textEl.value;
                let newEl = document.createElement('span');
                newEl.classList.add('cross');
                newTaskEl.insertAdjacentElement('beforeend', newEl);
                if (textEl.value.trim() !== "") {
                    if (form.classList.contains('toDo')) {
                        console.log('addTaskEl', this.addTaskEl);
                        this.currentState.taskArrayToDo.push(textEl.value);
                        this.addCurrentTask();
                    };
                    if (form.classList.contains('progress')) {
                        this.currentState.taskArrayProgress.push(textEl.value);
                        this.addCurrentTask();
                    }
                    if (form.classList.contains('done')) {
                        this.currentState.taskArrayDone.push(textEl.value);
                        this.addCurrentTask();
                    }
                    this.storage.setInStorage(this.currentState);
                }
                form.style.display = 'none';
                form.querySelector('.text').value = '';
                
            })
        }
        
        this.containerEl.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('cross')) {
                let removeEl = e.target.closest('.task');
                let blockTarget = e.target.closest('.block');
                let hEl = blockTarget.querySelector('h1');
                if (hEl.textContent === "TODO") {
                    this.currentState.taskArrayToDo = this.currentState.taskArrayToDo.filter(item => item !== removeEl.textContent);
                } else if (hEl.textContent === "PROGRESS") {
                    this.currentState.taskArrayProgress = this.currentState.taskArrayProgress.filter(item => item !== removeEl.textContent);
                } else {
                    this.currentState.taskArrayDone = this.currentState.taskArrayDone.filter(item => item !== removeEl.textContent);
                }
                removeEl.remove();
                this.storage.setInStorage(this.currentState);
                console.log('что в контейнере после удаления', this.containerEl);
                return;
            };


            if (e.target.classList.contains('addtask_first')) {
                this.formToDoEl.style.display = 'block';
                return;
            };

            if (e.target.classList.contains('addtask_second')) {
                this.formProgressEl.style.display = 'block';
                return;
            };
            if (e.target.classList.contains('addtask_third')) {
                this.formDoneEl.style.display = 'block';
                return;
            };

            let taskEl = e.target.closest('.task');
            if (!taskEl) {
                return;
            }
            this.draggedEl = taskEl;
            // сохраняем расположение карточки с задачей и курсора
            if (taskEl.nextElementSibling
                && taskEl.nextElementSibling.classList.contains('task')
            ) {
                this.infoObj.position = 'beforebegin';
                this.infoObj.nearEl = taskEl.nextElementSibling;
            } else if (
                taskEl.previousElementSibling
                && taskEl.previousElementSibling.classList.contains('task')
            ) {
                this.infoObj.position = 'afterend';
                this.infoObj.nearEl = taskEl.previousElementSibling;
            } else {
                this.infoObj.position = 'beforeend';
                this.infoObj.nearEl = taskEl.closest('.block');
            };
            console.log('this.infoObj.nearEl', this.infoObj.nearEl);
            console.log('this.infoObj.position', this.infoObj.position);
            console.log('this.draggedEl', this.draggedEl);
            let width = taskEl.offsetWidth;
            let height = taskEl.offsetHeight;
            let rect = taskEl.getBoundingClientRect();
            this.infoObj.mouseDifferLeft = e.clientX - rect.left;
            this.infoObj.mouseDiffertop = e.clientY - rect.top;

            this.infoObj.left = e.clientX - this.infoObj.mouseDifferLeft;
            this.infoObj.top = e.clientY - this.infoObj.mouseDiffertop;

            // создаём подвижную карточку
            this.ghostEl = taskEl.cloneNode(true);
            this.ghostEl.classList.add('dragged');
            document.body.append(this.ghostEl);
            this.ghostEl.style.maxWidth = `${width}px`;
            this.ghostEl.style.minHeight = `${height}px`;
            this.ghostEl.style.left = `${e.clientX-this.infoObj.mouseDifferLeft}px`;
            this.ghostEl.style.top = `${e.clientY-this.infoObj.mouseDiffertop}px`; 
            this.ghostEl.style.cursor = 'grabbing';
        
            // создаём пустую карточку на месте исходной
            this.window = taskEl.cloneNode(true);
            this.window.style.maxWidth = `${width}px`;
            this.window.style.minHeight = `${height}px`;
            this.window.textContent = "";
            this.window.style.backgroundColor = 'aliceblue';
            this.window.style.border = "1px solid lightgray";
            taskEl.replaceWith(this.window);

        });
        
        this.containerEl.addEventListener('mousemove', (event) => {
            event.preventDefault(); 
                if(!this.draggedEl) {
                        return;
                };
            //удаляем пустое окошко
            this.window.remove();
            // вставляем пустое окно в новое место
            this.ghostEl.hidden = true;
            let underMouseEl = document.elementFromPoint(event.clientX, event.clientY);
            this.ghostEl.hidden = false;
            if (!underMouseEl.classList.contains('block')&&!underMouseEl.classList.contains('task')) {
                return;
            };
            if (underMouseEl.classList.contains('task')) {
                let {top} = underMouseEl.getBoundingClientRect();
                if (event.clientY > (top + underMouseEl.offsetHeight/2)) {
                    underMouseEl.insertAdjacentElement('afterend', this.window);
                } else {
                    underMouseEl.before(this.window);
                } 
            } else {
                let checkEl = underMouseEl.querySelector('.task');
                if (!checkEl) {
                    underMouseEl.insertAdjacentElement('beforeend', this.window);
                } else {
                    this.ghostEl.hidden = true;
                    const upTask = document.elementFromPoint(event.clientX, event.clientY - this.gapTask);
                    const downTask = document.elementFromPoint(event.clientX, event.clientY + this.gapTask);
                    this.ghostEl.hidden = false;
                    if (upTask) {
                        if (upTask.classList.contains('task')) {
                            upTask.insertAdjacentElement('afterend', this.window);
                        } else {
                            upTask.insertAdjacentElement('beforeend', this.window); 
                        }
                    } else {
                        if (downTask) {
                        if (downTask.classList.contains('task')) {
                            downTask.before(this.window); 
                        } else {
                            downTask.insertAdjacentElement('beforeend', this.window);
                        }    
                        } else {
                            checkEl.insertAdjacentElement('afterend', this.window);
                        }
                    }
                }  
                  //передвигаем карточку с задачей
                this.ghostEl.style.left = `${event.clientX-this.infoObj.mouseDifferLeft}px`;
                this.ghostEl.style.top = `${event.clientY-this.infoObj.mouseDiffertop}px`;   
                }
            });
        this.containerEl.addEventListener('mouseleave', (e) => {
            // при уходе курсора за границы контейнера - отменяем перенос
            if (!this.draggedEl) {
                return;
            }
            // удаляем пустое окошко
            this.window.remove();
        
            // возвращаем карточку туда, откуда она была взята
            this.infoObj.nearEl.insertAdjacentElement(this.infoObj.position, this.draggedEl);
            // удаляем подвижную карточку
            this.ghostEl.remove();

            // очищаем исходные данные
            this.ghostEl = null;
            this.draggedEl = null;
            this.window = null;
            this.infoObj = {};
        });
    
        let addEl;
        this.containerEl.addEventListener ('mouseup', (evt) => {
            if (!this.draggedEl) {
                return;
            }
            this.window.remove();

            this.ghostEl.hidden = true;
            const closest = document.elementFromPoint(evt.clientX, evt.clientY);
            this.ghostEl.hidden = false;
            if (!closest) return;
            if (
                Math.trunc(this.infoObj.left) === parseInt(this.ghostEl.style.left, 10)
                && Math.trunc(this.infoObj.top) === parseInt(this.ghostEl.style.top, 10)
              ) {
                // если карточка в исходном положении, то вернём её обратно
                this.infoObj.nearEl.insertAdjacentElement(this.infoObj.position, this.draggedEl);
            } else {
                this.ghostEl.hidden = true;
                let underMouseEl = document.elementFromPoint(evt.clientX, evt.clientY);
                this.ghostEl.hidden = false;
                // console.log('underMouseEl', underMouseEl);
                // console.log('e_target', evt.target);

                if (!underMouseEl.classList.contains('block')&&!underMouseEl.classList.contains('task')) {
                    if (!this.draggedEl) {
                        return;
                    }
                    // удаляем пустое окошко
                    this.window.remove();
                
                    // возвращаем карточку туда, откуда она была взята
                    this.infoObj.nearEl.insertAdjacentElement(this.infoObj.position, this.draggedEl);
                    // удаляем подвижную карточку
                    this.ghostEl.remove();
        
                    // очищаем исходные данные
                    this.ghostEl = null;
                    this.draggedEl = null;
                    this.window = null;
                    this.infoObj = {};
                    return;
                };
                if (underMouseEl.classList.contains('block')) {
                    addEl = underMouseEl.querySelector('.but');
                    // console.log('addEl', addEl);
                };
                if (underMouseEl.classList.contains('task')) {
                    let {top} = underMouseEl.getBoundingClientRect();
                    if (evt.clientY > (top + underMouseEl.offsetHeight/2)) {
                        underMouseEl.insertAdjacentElement('afterend', this.draggedEl);
                    } else {
                        underMouseEl.before(this.draggedEl);
                    } 
                } else {
                    let checkEl = underMouseEl.querySelector('.task');
                    if (!checkEl) {
                        underMouseEl.insertAdjacentElement('beforeend', this.draggedEl);
                    } else {
                        this.ghostEl.hidden = true;
                        const upTask = document.elementFromPoint(evt.clientX, evt.clientY - this.gapTask);
                        const downTask = document.elementFromPoint(evt.clientX, evt.clientY + this.gapTask);
                        this.ghostEl.hidden = false;
                        if (upTask) {
                            if (upTask.classList.contains('task')) {
                                upTask.insertAdjacentElement('afterend', this.draggedEl);
                            } else {
                                upTask.insertAdjacentElement('beforeend', this.draggedEl); 
                                upTask.insertAdjacentElement('beforeend', addEl); 
                            }
                        } else {
                            if (downTask) {
                                if (downTask.classList.contains('task')) {
                                    downTask.before(this.draggedEl); 
                                } else {
                                    downTask.insertAdjacentElement('beforeend', this.draggedEl);
                                    downTask.insertAdjacentElement('beforeend', addEl);
                                }    
                            } else {
                                checkEl.insertAdjacentElement('afterend', this.draggedEl);
                            }
                        }
                    }
                }
            }

            // удаляем подвижную карточку
            this.ghostEl.remove();
            // очищаем исходные данные
            this.ghostEl = null;
            this.draggedEl = null;
            this.window = null;
            this.infoObj = {};
            this.overwriteTasks();
            this.storage.setInStorage(this.currentState);
        });
    }
}







