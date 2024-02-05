INSERT INTO department (name)
VALUES ("Sales"),
      ("Finance"),
      ("Legal"),
      ("Engineering");
     
INSERT INTO `role` (title, salary, department_id)
VALUES ("Accountant", 100000, 2),
      ("Lawyer", 150000, 3),
      ("Software Engineer", 120000, 4),
      ("Sales Person", 80000, 1),
      ("Sales Manager", 120000, 1),
      ("Account Manager", 150000, 2),
      ("Legal Team Lead", 200000, 3),
      ("Lead Engineer", 160000, 4);
      
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ethan", "Martinez", 5, null),
      ("Isabella", "Garcia", 6, null),
      ("Jayden", "Smith", 7, null),
      ("Mia", "Johnson", 8, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Aiden", "Patel", 1, 2),
      ("Sofia", "Rodriguez", 2, 3),
      ("Liam", "Nguyen", 3, 4),
      ("Chloe", "Kim", 4, 1);