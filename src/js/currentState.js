export default class State {
  constructor() {
    this.taskArrayToDo = [
      "Отображение input type = file в браузере обладает некоторыми недостатками: сложно стилизовать, по разному выглядит в разных браузерах. Поэтому input type = file часто скрывают и перекрывают другими элементами интерфейса",
      "Чтобы при перекрытии функциональность не пострадала можно выставить атрибут pointer-events в значение none.",
      "При mousedown клонируем элемент и привязываем к указателю мыши. При mouseup определяем, куда кинули элемент, и устанавливаем родителя",
      "input type = file требует для активации поведения по умолчанию именно MouseEvent , а не Event",
      "Если вы вызовете новое событие с помощью метода DispatchEvent просто так в произвольном месте кода, то событие не отправится, потому что вызов события click возможен только в том случае, если пользователь кликал куда-то в рамках текущей веб-страницы не позднее, чем ~5 секунд назад",
    ];
    this.taskArrayProgress = [
      "События которые возникают вследствие действий пользователя, и события которые генерируются программно отличаются друг от друга: isTrusted (true) ㄧ индикатор событий, исходящих от браузера, isnotTrusted (false) ㄧ индикатор событий, которые генерируются программно",
      "input type = file требует для активации поведения по умолчанию именно MouseEvent , а не Event",
    ];
    this.taskArrayDone = [
      "Drag and drop в Web традиционно делится на две реализации: имитация с помощью событий мыши/touch (перетаскивание элементов внутри веб-страницы), Drag and drop API (перетаскивание чего-либо снаружи внутрь окна браузера)",
    ];
  }

  static from(object) {
    if (typeof object === "object" && object !== null) {
      const instance = new State();
      instance.taskArrayToDo = object.taskArrayToDo || [];
      instance.taskArrayProgress = object.taskArrayProgress || [];
      instance.taskArrayDone = object.taskArrayDone || [];
      return instance;
    }
    return new State(); // Возвращаем новый экземпляр, если объект некорректен
  }
}
