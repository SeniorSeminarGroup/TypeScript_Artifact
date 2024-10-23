import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { Task, easyTask, mediumTask, hardTask } from '../src/tasks/Task';
import { addListItem, renderTasks } from '../src/tasks/taskUI';
import { loadTasks, saveTasks } from '../src/tasks/taskStorage';

describe('Task Management', () => {
    let dom: JSDOM;
    let document: Document;
    let tasks: Task[];

    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html>
            <body>
                <form id="new-task-form">
                    <input type="text" id="new-task-title" />
                    <input type="radio" id="easy" name="difficulty" value="easy" />
                    <input type="radio" id="medium" name="difficulty" value="medium" />
                    <input type="radio" id="hard" name="difficulty" value="hard" />
                </form>
                <ul id="unfinished-tasks-list"></ul>
                <ul id="finished-tasks-list"></ul>
            </body>
            </html>
        `);
        document = dom.window.document;

        // Mock localStorage
        (global as any).localStorage = {
            getItem: (key: string) => {
                return (global as any).localStorage[key] || null;
            },
            setItem: (key: string, value: string) => {
                (global as any).localStorage[key] = value;
            },
            removeItem: (key: string) => {
                delete (global as any).localStorage[key];
            },
            clear: () => {
                (global as any).localStorage = {};
            }
        };

        tasks = [];
    });

    it('should add a new easy task', () => {
        const input = document.querySelector<HTMLInputElement>('#new-task-title');
        const easyRadio = document.querySelector<HTMLInputElement>('#easy');
        const form = document.querySelector<HTMLFormElement>('#new-task-form');
        const unfinishedList = document.querySelector<HTMLUListElement>('#unfinished-tasks-list');

        input!.value = 'Test Easy Task';
        easyRadio!.checked = true;

        form!.dispatchEvent(new dom.window.Event('submit'));

        const tasks: Task[] = loadTasks();
        expect(tasks.length).to.equal(1);
        expect(tasks[0]).to.be.instanceOf(easyTask);
        expect(tasks[0].title).to.equal('Test Easy Task');
        expect(unfinishedList!.children.length).to.equal(1);
    });

    it('should add a new medium task', () => {
        const input = document.querySelector<HTMLInputElement>('#new-task-title');
        const mediumRadio = document.querySelector<HTMLInputElement>('#medium');
        const form = document.querySelector<HTMLFormElement>('#new-task-form');
        const unfinishedList = document.querySelector<HTMLUListElement>('#unfinished-tasks-list');

        input!.value = 'Test Medium Task';
        mediumRadio!.checked = true;

        form!.dispatchEvent(new dom.window.Event('submit'));

        const tasks: Task[] = loadTasks();
        expect(tasks.length).to.equal(1);
        expect(tasks[0]).to.be.instanceOf(mediumTask);
        expect(tasks[0].title).to.equal('Test Medium Task');
        expect(unfinishedList!.children.length).to.equal(1);
    });

    it('should add a new hard task', () => {
        const input = document.querySelector<HTMLInputElement>('#new-task-title');
        const hardRadio = document.querySelector<HTMLInputElement>('#hard');
        const form = document.querySelector<HTMLFormElement>('#new-task-form');
        const unfinishedList = document.querySelector<HTMLUListElement>('#unfinished-tasks-list');

        input!.value = 'Test Hard Task';
        hardRadio!.checked = true;

        form!.dispatchEvent(new dom.window.Event('submit'));

        const tasks: Task[] = loadTasks();
        expect(tasks.length).to.equal(1);
        expect(tasks[0]).to.be.instanceOf(hardTask);
        expect(tasks[0].title).to.equal('Test Hard Task');
        expect(unfinishedList!.children.length).to.equal(1);
    });

    it('should render tasks correctly', () => {
        const unfinishedList = document.querySelector<HTMLUListElement>('#unfinished-tasks-list');
        const finishedList = document.querySelector<HTMLUListElement>('#finished-tasks-list');

        const tasks: Task[] = [
            new easyTask('1', 'Easy Task', false, new Date()),
            new mediumTask('2', 'Medium Task', true, new Date()),
            new hardTask('3', 'Hard Task', false, new Date())
        ];

        renderTasks(tasks, unfinishedList, finishedList);

        expect(unfinishedList!.children.length).to.equal(2);
        expect(finishedList!.children.length).to.equal(1);
    });

    it('should toggle task completion', () => {
        const unfinishedList = document.querySelector<HTMLUListElement>('#unfinished-tasks-list');
        const finishedList = document.querySelector<HTMLUListElement>('#finished-tasks-list');

        const task = new easyTask('1', 'Easy Task', false, new Date());
        tasks.push(task);
        addListItem(task, unfinishedList);

        const checkbox = unfinishedList!.querySelector<HTMLInputElement>('input[type="checkbox"]');
        checkbox!.checked = true;
        checkbox!.dispatchEvent(new dom.window.Event('change'));

        expect(task.completed).to.be.true;
        expect(unfinishedList!.children.length).to.equal(0);
        expect(finishedList!.children.length).to.equal(1);
    });

    it('should save and load tasks correctly', () => {
        const task = new easyTask('1', 'Easy Task', false, new Date());
        tasks.push(task);
        saveTasks(tasks);

        const loadedTasks: Task[] = loadTasks();
        expect(loadedTasks.length).to.equal(1);
        expect(loadedTasks[0].id).to.equal(task.id);
        expect(loadedTasks[0].title).to.equal(task.title);
        expect(loadedTasks[0].completed).to.equal(task.completed);
    });
});
