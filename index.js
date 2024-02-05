
const inquirer = require('inquirer');
const db = require('./config/connect');

function getDepartmentName() {
   db.query('SELECT name FROM department', (err, result) => {
    if (err) {
      console.log(err)
      return
  }
  console.log(result)
  db.end()
})
  
  }

  

const departments = getDepartmentName()
// console.log(departments)

const questions = [
  {
    type: 'input',
    message: 'Please enter the test instructions.',
    name: 'testInstructions',
  },
  {
    type: 'list',
    message: 'What would you like to do?',
    name: 'mainMenu',
    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit', 'View All Employees'],
},
{
  type: 'list',
  message: 'Which department does the role belong to?',
  name: 'role',
  choices: departments,
  },
  ]

  async function promptQuestions() {
    const data = await inquirer.prompt(questions[2]);
    console.log(data)
  }

//Function runs the question prompt
function initialize() {
  // const data = await inquirer.prompt(questions);
  
  // console.log(departments)
  promptQuestions()
};









initialize();