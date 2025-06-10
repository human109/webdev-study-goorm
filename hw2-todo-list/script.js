document.querySelector('#btnAddTodo').addEventListener('click', handleAddTodo, false);

function handleAddTodo() {
    // #example-todo-item을 복사하여 새로운 todo 항목을 만들기
    const todoItem = document.querySelector('#example-todo-item').cloneNode(true);
    todoItem.removeAttribute('id'); // ID 제거
    todoItem.classList.remove('hidden'); // 숨김 클래스 제거
    todoItem.querySelector('.todo-text').textContent = document.querySelector('#inputTodoText').value; // 입력된 텍스트 설정
    todoItem.querySelector('.todo-text').setAttribute('contenteditable', 'true'); // 편집 가능하게 설정
    todoItem.querySelector('.delete-todo-button').addEventListener('click', handleDeleteTodo, false); // 삭제 버튼 이벤트 리스너 추가
    todoItem.querySelector('.edit-todo-button').addEventListener('click', handleEditTodo, false); // 편집 버튼 이벤트 리스너 추가
    document.querySelector('#todo-items').appendChild(todoItem); // todoList에 새 항목 추가

    todoItem.querySelector('.todo-text').focus(); // 텍스트 입력 필드에 포커스 설정
}

function handleEditTodo(event) {
    // 편집 버튼이 클릭된 todo 항목을 찾아서 편집 가능하게 설정
    const todoItem = event.target.closest('.todo-item');
    if (todoItem) {
        // complete 상태가 아닌 경우만 편집 가능하도록 설정
        if (todoItem.classList.contains('completed')) return;
        const todoText = todoItem.querySelector('.todo-text');
        todoText.setAttribute('contenteditable', 'true'); // 편집 가능하게 설정
        todoText.removeAttribute('readonly'); // 읽기 전용 속성 제거
        todoText.focus(); // 포커스 설정
        todoText.classList.add('edit-mode'); // 편집 상태 클래스 추가
    }
}

function handleDeleteTodo(event) {
    // 삭제 버튼이 클릭된 todo 항목을 찾아서 제거
    const todoItem = event.target.closest('.todo-item');
    if (todoItem) {
        todoItem.remove();
    }
}

// todo-items를 blur했을 때 편집 불가능하도록 설정
document.querySelector('.todo-items').addEventListener('blur', handleTodoInputBlur, true); 

function handleTodoInputBlur(event) {
    if (event.target.classList.contains('todo-text')) {
        todoText = event.target.value;
        if (todoText.trim() !== '') {    
            event.target.classList.remove('edit-mode'); // 편집 상태 클래스 제거
            event.target.setAttribute('readonly', 'true'); // 읽기 전용으로 설정
            event.target.setAttribute('contenteditable', 'false'); // 편집 불가능하게 설정
        }
    }
}

// todo-checkbox를 클릭했을 때 완료 상태로 변경
document.querySelector('.todo-items').addEventListener('change', handleCheckboxChange, false);

function handleCheckboxChange(event) {
    if (event.target.classList.contains('todo-checkbox')) {
        // todo-checkbox가 클릭되었을 때, 해당 todo 항목의 완료 상태를 변경
        const todoItem = event.target.closest('.todo-item');
        if (event.target.checked) {
            todoItem.classList.add('completed'); // 완료 상태로 변경
        } else {
            todoItem.classList.remove('completed'); // 완료 상태 해제
        }
    }
}

// todo-text에서 엔터를 입력했을때 완료
document.querySelector('.todo-items').addEventListener('keydown', handleTodoTextKeydown, true);

function handleTodoTextKeydown(event) {
    if (event.target.classList.contains('todo-text') && event.key === 'Enter') {
        event.preventDefault(); // 기본 엔터 동작 방지
        event.target.blur(); // 블러 처리하여 편집 모드 종료
    }
}