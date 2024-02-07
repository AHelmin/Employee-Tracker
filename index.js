
const inquirer = require('inquirer');
const db = require('./config/connect');

console.log(`
___________________________________________________________
      ______                 _                       
     |  ____|               | |                      
     | |__   _ __ ___  _ __ | | ___  _   _  ___  ___ 
     |  __| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\
     | |____| | | | | | |_) | | (_) | |_| |  __/  __/
     |______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|
                       | |            __/ |          
         __  __        |_|           |___/                                              
        |  \\/  |                                  
        | \\  / | __ _ _ __   __ _  __ _  ___ _ __ 
        | |\\/| |/ _\` | '_ \\ / _\` |/ _\` |/ _ \\ '__|
        | |  | | (_| | | | | (_| | (_| |  __/ |   
        |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|   
                                   __/ |          
                                  |___/           
___________________________________________________________
`);

async function promptMainMenu() {
  const questions =
  {
    type: 'list',
    message: 'What would you like to do?',
    name: 'mainMenu',
    choices: ['View All Departments',
      'View All Roles',
      'View All Employees',
      'Add Department',
      'Add Role',
      'Add Employee',
      'Update Employee Role',
      'See Budget by Department',
      'Update Employee Manager',
      'Quit']
  }
  const data = await inquirer.prompt(questions);
  if (data.mainMenu === 'View All Employees') {
    await getEmployee()
  }
  if (data.mainMenu === 'Add Employee') {
    await addEmployee()
  }
  if (data.mainMenu === 'Update Employee Role') {
    await updateEmployeeRole()
  }
  if (data.mainMenu === 'Add Role') {
    await addRole()
  }
  if (data.mainMenu === 'View All Roles') {
    await getRoles()
  }
  if (data.mainMenu === 'View All Departments') {
    await getDepartments()
  }
  if (data.mainMenu === 'Add Department') {
    await addDepartment()
  }
  if (data.mainMenu === 'See Budget by Department') {
    await departmentBudget()
  }
  if (data.mainMenu === 'Update Employee Manager') {
    await updateEmployeeManager();
  }
  if (data.mainMenu === 'Quit') {
    process.exit()
  }
};

//Function runs the question prompt
function initialize() {

  promptMainMenu();
};

//functions below query the db for requested information
async function getDepartmentForPrompt() {
  const [rows] = await db.promise().query('SELECT id, name FROM department');
  return rows
};

async function getDepartments() {
  const [rows] = await db.promise().query('SELECT * FROM department');
  // const tableData = rows.map(row => Object.values(row))
  console.table(rows);
  promptMainMenu()
};

async function getEmployee() {
  const [rows] = await db.promise().query("SELECT a.id AS id, a.first_name AS first_name, a.last_name AS last_name, `role`.title AS title, department.name AS department_name, `role`.salary AS salary, CONCAT(b.first_name, ' ', b.last_name) AS manager_name FROM employee a JOIN `role` ON a.role_id = `role`.id JOIN department ON `role`.department_id = department.id LEFT JOIN employee b ON a.manager_id = b.id;");
  // const tableData = rows.map(row => Object.values(row))
  console.table(rows, ['id', 'first_name', 'last_name', 'title', 'department_name', 'salary', 'manager_name']);
  promptMainMenu()
};

async function getManagerForPrompt() {
  const [rows] = await db.promise().query('SELECT first_name, last_name, id FROM employee WHERE manager_id IS NULL');
  return rows
};

async function getEmployeesForPrompt() {
  const [rows] = await db.promise().query('SELECT first_name, last_name, id FROM employee');
  return rows
};


async function getRoles() {
  const [rows] = await db.promise().query("SELECT `role`.title AS title, role.id AS id, department.name AS name, `role`.salary AS salary FROM `role` LEFT JOIN department ON `role`.department_id=department.id");
  console.table(rows)
  promptMainMenu()
};

async function getRolesForPrompt() {
  const [rows] = await db.promise().query('SELECT * FROM role');
  return rows
};

//functions below will be the add/create functions

async function updateEmployeeManager() {
  const managers = await getManagerForPrompt();
  const managerChoices = managers.map(({ first_name, last_name, id }) => ({
    name: first_name + ' ' + last_name,
    value: id
  }))
  const employees = await getEmployeesForPrompt();
  const employeeChoices = employees.map(({ first_name, last_name, id }) => ({
    name: first_name + ' ' + last_name,
    value: id
  }))
  const questions = [
    {
      type: 'list',
      message: "Which employee needs a new manager?",
      name: 'employee',
      choices: employeeChoices,
    },
    {
      type: 'list',
      message: "Who is the new manager for this employee?",
      name: 'manager',
      choices: managerChoices,
    },
  ]
  const answers = await inquirer.prompt(questions)
  await db.promise().query(`UPDATE employee SET manager_id = "${answers.manager}"
  WHERE id = "${answers.employee}";`)
  promptMainMenu()
};

async function departmentBudget() {
  const departments = await getDepartmentForPrompt();
  const departmentChoices = departments.map(({ name }) => ({
    name: name,
  }))
  const questions = [
    {
      type: 'list',
      message: "What is the employee's role?",
      name: 'role',
      choices: departmentChoices,
    },
  ]
  const answers = await inquirer.prompt(questions)
  const department = answers.role
  const [budget] = await db.promise().query(`SELECT department.name, SUM(\`role\`.salary) AS TotalBudget FROM \`role\` JOIN department ON \`role\`.department_id = department.id WHERE department.name = '${department}' GROUP BY department.name;`);
  if (budget.length === 0) {
    budget.push({ name: answers.role, TotalBudget: '0' })
  }
  console.table(budget)
  promptMainMenu();
};

async function addEmployee() {
  const roles = await getRolesForPrompt();
  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }))
  const managers = await getManagerForPrompt();
  let managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: first_name + ' ' + last_name,
    value: id,
  }))
  managerChoices.push({
    name: 'No Manager',
    value: null,
  })
  const questions = [
    {
      type: 'input',
      message: "What is the employee's first name?",
      name: 'fname',
    },
    {
      type: 'input',
      message: "What is the employees last name?",
      name: 'lname',
    },
    {
      type: 'list',
      message: "What is the employee's role?",
      name: 'role',
      choices: roleChoices,
    },
    {
      type: 'list',
      message: "Who is this employees manager?",
      name: 'manager',
      choices: managerChoices,
    },
  ]
  const answers = await inquirer.prompt(questions)
  await db.promise().query(`INSERT INTO employee(first_name, last_name, role_id, manager_id)
  VALUES("${answers.fname}", "${answers.lname}", "${answers.role}",${answers.manager});`)
  promptMainMenu();
};

async function updateEmployeeRole() {
  const employees = await getEmployeesForPrompt();
  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: first_name + ' ' + last_name,
    value: id,
  }))
  const roles = await getRolesForPrompt();
  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }))

  const questions = [
    {
      type: 'list',
      message: "Which employee would you like to change roles?",
      name: 'employee',
      choices: employeeChoices
    },
    {
      type: 'list',
      message: "What is the employee's role?",
      name: 'role',
      choices: roleChoices,
    },
  ]
  //how do i import the role id foreign key
  const answers = await inquirer.prompt(questions)
  await db.promise().query(`UPDATE employee SET role_id = "${answers.role}"
  WHERE id = "${answers.employee}";`)
  promptMainMenu()
};

async function addRole() {
  const departments = await getDepartmentForPrompt();
  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id,
  }))
  const questions = [
    {
      type: 'input',
      message: "What is the title of the role you want to add?",
      name: 'role',
    },
    {
      type: 'input',
      message: "What is the salary of the new role?",
      name: 'salary',
    },
    {
      type: 'list',
      message: "What department does this new role belong to?",
      name: 'department',
      choices: departmentChoices,
    },
  ]
  //how do i import the department foreign key
  const answers = await inquirer.prompt(questions);
  await db.promise().query(`INSERT INTO role (title, salary, department_id)
  VALUES("${answers.role}", "${answers.salary}", "${answers.department}");`)
  promptMainMenu()
};

async function addDepartment() {
  const questions = [
    {
      type: 'input',
      message: "What is the name of the department that you want to add?",
      name: 'department',
    },
  ]
  const answers = await inquirer.prompt(questions);
  await db.promise().query(`INSERT INTO department (name) VALUES ("${answers.department}");`)
  promptMainMenu()
};

initialize();


