
const inquirer = require('inquirer');
const db = require('./config/connect');

async function promptMainMenu() {
  const questions =
  {
    type: 'list',
    message: 'What would you like to do?',
    name: 'mainMenu',
    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
  }
  const data = await inquirer.prompt(questions);
  console.log(data)
  if (data.mainMenu === 'View All Employees') {
    await getEmployee()
  }
  if (data.mainMenu === 'Add Employee') {
    await addEmployee()
  }
  if (data.mainMenu === 'View All Roles') {
    await getRoles()
  }
  if (data.mainMenu === 'View All Departments') {
    await getDepartments()
  }
  if (data.mainMenu === 'Quit') {
    process.exit()
  }
};

// async function promptDepartment() {
//   const question = {
//     type: 'list',
//     message: 'Which department does the role belong to?',
//     name: 'role',
//     choices: departmentChoices,
//   }
//   const deptData = await inquirer.prompt(question);
//   console.log(deptData)
// };

//Function runs the question prompt
async function initialize() {
  // const departmentNames = await getDepartmentName();
  // await promptMainMenu(departmentNames)
  await promptMainMenu()
  // console.log(departments)

};

//functions below query the db for requested information
async function getDepartmentForPrompt() {
  const [rows] = await db.promise().query('SELECT name FROM department');
  return rows.map(row => row.name);
};

async function getDepartments() {
  const [rows] = await db.promise().query('SELECT * FROM department');
  // const tableData = rows.map(row => Object.values(row))
  console.table(rows);
  promptMainMenu()
}

async function getEmployee() {
  const [rows] = await db.promise().query('SELECT * FROM employee');
  // const tableData = rows.map(row => Object.values(row))
  console.table(rows);
  promptMainMenu()
}

async function getManager() {
  const [rows] = await db.promise().query('SELECT * FROM employee WHERE manager_id IS NULL');
  // return rows.map(row => row.name)
  console.table(rows)
};

async function getManagerForPrompt() {
  const [rows] = await db.promise().query('SELECT name FROM employee WHERE manager_id IS NULL');
  return rows.map(row => row.name)
};

async function getRolesForPrompt() {
  const [rows] = await db.promise().query('SELECT * FROM roles');
  return rows.map(row => row.name)
};

//functions below will be the add/create functions

async function addEmployee() {
  const roles = await getRolesForPrompt();
  const managers = await getManagerForPrompt();
  const questions = [
    {
      type: 'input',
      message: "What is the employee's first name?",
      name: 'fname',
    },
    {
      type: 'input',
      message: "What is the employees first name?",
      name: 'lname',
    },
    {
      type: 'list',
      message: "What is the employee's role?",
      name: 'role',
      choices: roles,
    },
    {
      type: 'list',
      message: "What is the employee's role?",
      name: 'manager',
      choices: managers,
    },
  ]
  const answers = await inquirer.prompt(questions)
  await db.promise().query(`INSERT INTO employee(first_name, last_name, role_id, manager_id)
  VALUES(${answers.fname}, ${answers.lname}, ${role.id}, null);`)
}







initialize();


