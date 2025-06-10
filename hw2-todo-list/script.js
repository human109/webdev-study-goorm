document.querySelector('#btnAddTodo').addEventListener('click', handleAddTodo, false);

// 편집 모드를 설정하는 함수
function setTodoEditMode(todoTextElement) {
    todoTextElement.setAttribute('contenteditable', 'true'); // 편집 가능하게 설정
    todoTextElement.classList.add('edit-mode'); // 편집 상태 클래스 추가
    todoTextElement.focus(); // 포커스 설정
}

// 읽기 전용 모드로 설정하는 함수
function setTodoReadOnlyMode(todoTextElement) {
    todoTextElement.setAttribute('contenteditable', 'false'); // 편집 불가능하게 설정
    todoTextElement.classList.remove('edit-mode'); // 편집 상태 클래스 제거
}

function createTodoItem(text = '', completed = false) {
    const todoItem = document.querySelector('#example-todo-item').cloneNode(true);
    todoItem.removeAttribute('id'); // ID 제거
    todoItem.classList.remove('hidden'); // 숨김 클래스 제거
    todoItem.querySelector('.todo-text').value = text; // 텍스트 설정
    const todoTextEl = todoItem.querySelector('.todo-text');

    // storage에 저장된 todo 항목의 경우, 읽기 전용으로 설정
    if( text.trim() !== '') {
        setTodoReadOnlyMode(todoTextEl); // 텍스트가 있는 경우 읽기 전용 모드로 설정
    } else {
        setTodoEditMode(todoTextEl); // 텍스트가 없는 경우 편집 모드로 설정
        todoTextEl.setAttribute('placeholder', '할 일을 입력하세요'); // 플레이스홀더 설정
    }

    todoItem.querySelector('.delete-todo-button').addEventListener('click', handleDeleteTodo, false); // 삭제 버튼 이벤트 리스너 추가
    todoItem.querySelector('.edit-todo-button').addEventListener('click', handleEditTodo, false); // 편집 버튼 이벤트 리스너 추가

    if (completed) {
        todoItem.classList.add('completed'); // 완료 상태로 설정
        todoItem.querySelector('.todo-checkbox').checked = true; // 체크박스 체크
    }

    return todoItem;
}

function handleAddTodo() {
    const todoItem = createTodoItem(); // 새 todo 항목 생성
    document.querySelector('#todo-items').appendChild(todoItem); // todoList에 새 항목 추가
    todoItem.querySelector('.todo-text').focus(); // 텍스트 입력 필드에 포커스 설정
}

function handleEditTodo(event) {
    // 편집 버튼이 클릭된 todo 항목을 찾아서 편집 가능하게 설정
    const todoItem = event.target.closest('.todo-item');
    if (todoItem && !todoItem.classList.contains('completed')) {
        // complete 상태가 아닌 경우만 편집 가능하도록 설정
        const todoText = todoItem.querySelector('.todo-text');
        setTodoEditMode(todoText); // 편집 모드로 전환
    }
}

function handleDeleteTodo(event) {
    // 삭제 버튼이 클릭된 todo 항목을 찾아서 제거
    const todoItem = event.target.closest('.todo-item');
    if (todoItem) {
        todoItem.remove();
        saveTodoListToLocalStorage();
    }
}

// todo-items를 blur했을 때 편집 불가능하도록 설정
document.querySelector('.todo-items').addEventListener('blur', handleTodoInputBlur, true); 

function handleTodoInputBlur(event) {
    if (event.target.classList.contains('todo-text')) {
        todoText = event.target.value;
        if (todoText.trim() !== '') {    
            setTodoReadOnlyMode(event.target); // 편집 모드 종료
            saveTodoListToLocalStorage(); // todoList를 localStorage에 저장
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
        saveTodoListToLocalStorage(); // todoList를 localStorage에 저장
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

// todoList를 localStorage에 저장
function saveTodoListToLocalStorage() {
        const todoItems = document.querySelectorAll('.todo-item');
        const todos = [];
        todoItems.forEach(item => {
            const todoText = item.querySelector('.todo-text').value;
            if (!todoText.trim()) return; // 빈 텍스트는 저장하지 않음
            const isCompleted = item.classList.contains('completed');
            // index와 completed 상태를 포함한 todo 객체 생성
            todos.push({
                text: todoText,
                completed: isCompleted  
            })
        });
        localStorage.setItem('todos', JSON.stringify(todos)); // JSON 문자열로 변환하여 저장
}

// 페이지 로드 시 localstorage에서 todoList 불러오기
window.addEventListener('load', loadTodoListFromLocalStorage, false);
function loadTodoListFromLocalStorage() {
    const todos = JSON.parse(localStorage.getItem('todos')) || []; // 저장된 todoList 불러오기
    todos.forEach(todo => {
        const todoItem = createTodoItem(todo.text, todo.completed); // 기존 todo 항목 생성
        document.querySelector('#todo-items').appendChild(todoItem); // todoList에 추가
    });
}