const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql");
const { body, validationResult } = require('express-validator');
const server = express();
server.use(bodyParser.json());
const cors = require('cors');
server.use(cors(
    {
        origin: 'http://localhost:4200'
    }
));

// Establish the database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: '3306',
    password: "Kavi@123",
    database: "inventorymanagement",
});

db.connect(function (error) {
    if (error) {
        console.error("Error Connecting to DB:", error);
    } else {
        console.log("Successfully Connected to DB");
    }
});

// Establish the Port
const PORT = 8085; // Change the port number here
server.listen(PORT, function check(error) {
    if (error) {
        console.log("Error starting server!");
    } else {
        console.log(`Server started on port ${PORT}`);
    }
});

// Employee APIs

// Create Employee
server.post("/api/employee/add", [
    body('loginid').notEmpty(),
    body('name').notEmpty(),
    body('role').notEmpty(),
    body('isactive').isBoolean(),
    body('phonenumber').isMobilePhone(),
    body('img').notEmpty(),
    body('password').isLength({ min: 6 })
], (req, res) => {
    console.log("Request Body:", req.body); // Log the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const details = {
        loginid: req.body.loginid,
        name: req.body.name,
        role: req.body.role,
        isactive: req.body.isactive,
        phonenumber: req.body.phonenumber,
        img: req.body.img,
        password: req.body.password,
    };
    const sql = "INSERT INTO employees SET ?";
    db.query(sql, details, (error) => {
        if (error) {
            console.log("Error:", error);
            res.send({ status: false, message: "Employee creation failed" });
        } else {
            res.send({ status: true, message: "Employee created successfully" });
        }
    });
});


server.post("/api/employee/validate", [
    body('loginid').notEmpty(),
    body('password').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { loginid, password } = req.body;
    const sql = "SELECT * FROM employees WHERE loginid = ? AND password = ?";
    db.query(sql, [loginid, password], (error, result) => {
        if (error) {
            res.send({ status: false, message: "User validation failed" });
        } else if (result.length > 0) {
            res.send({ status: true, message: "User validated successfully", data: result[0] });
        } else {
            res.send({ status: false, message: "Invalid loginid or password" });
        }
    });
});

// Get All Employees
server.get("/api/employees", (req, res) => {
    const sql = "SELECT * FROM employees where isActive = 1";
    db.query(sql, (error, result) => {
        if (error) {
            res.send({ status: false, message: "Failed to fetch employees" });
        } else {
            res.send({ status: true, data: result });
        }
    });
});

// Get Employee by ID
server.get("/api/employee/:id", (req, res) => {
    const employeeId = req.params.id;
    const sql = "SELECT * FROM employees WHERE id = ?";
    db.query(sql, [employeeId], (error, result) => {
        if (error) {
            res.send({ status: false, message: "Failed to fetch employee" });
        } else {
            res.send({ status: true, data: result });
        }
    });
});

// Update Employee
server.put("/api/employee/update", [
    body('loginid').notEmpty(),
    body('name').notEmpty(),
    body('role').notEmpty(),
    body('isactive').isBoolean(),
    body('phonenumber').isMobilePhone(),
    body('img').notEmpty(),
    body('password').isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const sql = "UPDATE employees SET loginid = ?, name = ?, role = ?, isactive = ?, phonenumber = ?, img = ?, password = ? WHERE id = ?";
    const values = [
        req.body.loginid,
        req.body.name,
        req.body.role,
        req.body.isactive,
        req.body.phonenumber,
        req.body.img,
        req.body.password,
        req.params.id,
    ];
    db.query(sql, values, (error, result) => {
        if (error) {
            res.send({ status: false, message: "Employee update failed" });
        } else {
            res.send({ status: true, message: "Employee updated successfully" });
        }
    });
});

// Delete Employee
server.delete("/api/employee/delete",  [
    body('loginid').notEmpty(),
    body('name').notEmpty(),
    body('role').notEmpty(),
    body('isactive').isBoolean(),
    body('phonenumber').isMobilePhone(),
    body('img').notEmpty(),
    body('password').isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const sql = "UPDATE employees SET loginid = ?, name = ?, role = ?, isactive = false, phonenumber = ?, img = ?, password = ? WHERE id = ?";
    const values = [
        req.body.loginid,
        req.body.name,
        req.body.role,
        req.body.isactive,
        req.body.phonenumber,
        req.body.img,
        req.body.password,
        req.params.id,
    ];
    db.query(sql, values, (error, result) => {
        if (error) {
            res.send({ status: false, message: "Employee update failed" });
        } else {
            res.send({ status: true, message: "Employee deactivated" });
        }
    });
});

// Food APIs

// Create Food Item
server.post("/api/food/add", [
    body('foodName').notEmpty(),
    body('category').notEmpty(),
    body('price').isFloat({ gt: 0 }),
    body('isveg').isBoolean(),
    body('isavailable').isBoolean()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const details = {
        foodName: req.body.foodName,
        category: req.body.category,
        price: req.body.price,
        isveg: req.body.isveg,
        isavailable: req.body.isavailable,
    };
    const sql = "INSERT INTO foods SET ?";
    db.query(sql, details, (error) => {
        if (error) {
            res.send({ status: false, message: "Food item creation failed" });
        } else {
            res.send({ status: true, message: "Food item created successfully" });
        }
    });
});

// Get All Food Items
server.get("/api/foods", (req, res) => {
    const sql = "SELECT id,price,foodName,category,isveg,quantity FROM foods where isavailable =true";
    db.query(sql, (error, result) => {
        if (error) {
            res.send({ status: false, message: "Failed to fetch food items" });
        } else {
            res.send({ status: true, data: result });
        }
    });
});

// Get Food Item by ID
server.get("/api/food/:id", (req, res) => {
    const foodId = req.params.id;
    const sql = "SELECT * FROM foods WHERE id = ?";
    db.query(sql, [foodId], (error, result) => {
        if (error) {
            res.send({ status: false, message: "Failed to fetch food item" });
        } else {
            res.send({ status: true, data: result });
        }
    });
});

// Update Food Item
server.put("/api/food/update", [
    body('foodName').notEmpty(),
    body('category').notEmpty(),
    body('price').isFloat({ gt: 0 }),
    body('isveg').isBoolean(),
    body('isavailable').isBoolean()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const sql = "UPDATE foods SET foodName = ?, category = ?, price = ?, isveg = ?, isavailable = ? WHERE id = ?";
    const values = [
        req.body.foodName,
        req.body.category,
        req.body.price,
        req.body.isveg,
        req.body.isavailable,
        req.body.id,
    ];
    db.query(sql, values, (error, result) => {
        if (error) {
            res.send({ status: false, message: "Food item update failed" });
        } else {
            res.send({ status: true, message: "Food item updated successfully" });
        }
    });
});

// Delete Food Item
server.put("/api/food/delete" , [
    body('foodName').notEmpty(),
    body('category').notEmpty(),
    body('price').isFloat({ gt: 0 }),
    body('isveg').isBoolean(),
    body('isavailable').isBoolean()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const sql = "UPDATE foods SET  isavailable = false WHERE id = ?";
    const values = [
        req.body.id,
    ];
    db.query(sql, values, (error, result) => {
        if (error) {
            res.send({ status: false, message: "Food item update failed" });
        } else {
            res.send({ status: true, message: "Food item deleted successfully" });
        }
    });
});

// Order APIs
server.post('/api/addcategories', (req, res) => {
    console.log(req.body);
    const  categoryName = req.body.categoryName;
    const descriptions  = req.body.descriptions;
    console.log(descriptions);
    console.log(categoryName);
    if (!categoryName) {
        return res.status(400).json({ error: 'categoryName is required' });
    }
    const sql = 'INSERT INTO category (categoryName,descriptions) VALUES (?,?)';
    db.query(sql, [categoryName, descriptions || 'update category description'], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Category added', id: result.insertId ,description : descriptions});
    });
});

 // DELETE category
server.delete('/api/deletecategories/:id', (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    const sql = 'DELETE FROM category WHERE id = ?';
    db.query(sql, [id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Category deleted' });
    });
});
server.get('/api/onemonthincome', (req, res) => {
    const sql = 'SELECT SUM(price) AS total_income_last_month FROM orders WHERE created_on >= NOW() - INTERVAL 1 MONTH;';
    db.query(sql, (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.send({ status: true, data: result[0].total_income_last_month });
        //res.status(200).json({ total_income_last_month: result[0].total_income_last_month });
    });
});
// Create Order
server.post("/api/order/add", [
    body('food_details').notEmpty(),
    body('price').isFloat({ gt: 0 }),
], (req, res) => {
    console.log(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Query to count the number of records in the orders table
    const countSql = "SELECT id FROM inventorymanagement.orders ORDER BY id DESC LIMIT 1";
    db.query(countSql, (countError, countResult) => {
        if (countError) {
            return res.send({ status: false, message: "Failed to generate order ID" });
        }

        // Generate the order_id
        const orderCount = countResult[0].count + 1;
        const orderId = `ord${orderCount}`;

        const details = {
            order_id: orderId,
            food_details: req.body.food_details,
            price: req.body.price,
            order_by: req.body.order_by,
            payment_mode: req.body.payment_mode,
            is_completed: req.body.is_completed || false
        };

        const sql = "INSERT INTO orders SET ?";
        db.query(sql, details, (error) => {
            if (error) {
                console.log(error)
                res.send({ status: false, message: "Order creation failed" ,data:error});
            } else {
                res.send({ status: true, message: "Order created successfully",data:details });
            }
        });
    });
});

// Get All Orders
server.get("/api/orders", (req, res) => {
    const sql = "SELECT * FROM orders";
    db.query(sql, (error, result) => {
        if (error) {
            res.send({ status: false, message: "Failed to fetch orders" });
        } else {
            res.send({ status: true, data: result });
        }
    });
});

server.get("/api/orders-by-period", (req, res) => {
    const sql = "SELECT * FROM orders where created_on between '23-02-2025' and '02-03-3035' ";
    db.query(sql, (error, result) => {
        if (error) {
            res.send({ status: false, message: "Failed to fetch orders" });
        } else {
            res.send({ status: true, data: result });
        }
    });
});
// Get Order by ID
server.get("/api/order/:id", (req, res) => {
    const orderId = req.params.id;
    const sql = "SELECT * FROM orders WHERE id = ?";
    db.query(sql, [orderId], (error, result) => {
        if (error) {
            res.send({ status: false, message: "Failed to fetch order" });
        } else {
            res.send({ status: true, data: result });
        }
    });
});

// Update Order
server.put("/api/order/update", [
   
    
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const sql = "UPDATE orders SET  payment_mode= ?, is_completed = true WHERE order_id= ?";
    const values = [
        req.body.payment_mode,
        req.body.orderId,
    ];
    db.query(sql, values, (error, result) => {
        if (error) {
            res.send({ status: false, message: "Order update failed",error });
        } else {
            res.send({ status: true, message: "Order updated successfully" });
        }
    });
});

// GET all categories
server.get('/api/categories', (req, res) => {
    const sql = 'SELECT * FROM category';
    db.query(sql, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });
  
  // GET category by ID
  server.get('/categories/:id', (req, res) => {
    const sql = 'SELECT * FROM category WHERE id = ?';
    db.query(sql, [req.params.id], (error, result) => {
      if (error) throw err;
      res.json(result[0]);
    });
  });
  
  
  // PUT (update) category
  server.put('/categories/:id', (req, res) => {
    const { categoryName } = req.body;
    const sql = 'UPDATE category SET categoryName = ? WHERE id = ?';
    db.query(sql, [categoryName, req.params.id], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Category updated' });
    });
  });
  
 


// Delete Order
server.delete("/api/order/delete/:id", (req, res) => {
    const sql = "DELETE FROM orders WHERE id = ?";
    db.query(sql, [req.params.id], (error) => {
        if (error) {
            res.send({ status: false, message: "Order deletion failed" });
        } else {
            res.send({ status: true, message: "Order deleted successfully" });
        }
    });
});

server.post("/api/employee/login", [
    body('loginid').notEmpty(),
    body('password').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { loginid, password } = req.body;
    

    const sql = "SELECT * FROM employees WHERE loginid = ? AND password = ?";
    db.query(sql, [loginid, password], (error, result) => {
        if (error) {
            res.send({ status: false, message: "User validation failed" });
        } else if (result.length > 0) {
            res.send({ status: true, message: "User validated successfully", data: result[0] });
        } else {
            res.send({ status: false, message: "Invalid loginid or password" });
        }
    });
});



// DELETE category
server.delete('/api/deletecategories/:id', (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    const sql = 'DELETE FROM category WHERE id = ?';
    db.query(sql, [id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: error });
        }
        res.status(200).json({ message: 'Category deleted' });
    });
});

// PUT (update) category
server.put('/api/categories/:id', (req, res) => {
    const { categoryName, descriptions } = req.body;
    const sql = 'UPDATE category SET categoryName = ?, descriptions = ? WHERE id = ?';
    db.query(sql, [categoryName, descriptions, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Category updated' });
    });
});