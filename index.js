const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { MongoClient, Binary,ObjectId} = require("mongodb");
const session = require("express-session");
const app = express();
const port = process.env.PORT || 3000;

// MongoDB Create, Delete, Modify, Fetch Functions

const mongoURI = process.env.MONGODB_URI;
const dbName = "userBase";
const collectionName = "users";

// Connect to MongoDB and create db and collection if not present
async function connectToMongo() {
    let client = await MongoClient.connect(mongoURI)
    console.log("Connected to MongoDB");
    const adminDb = client.db("admin");
    if (
      await adminDb
        .admin()
        .listDatabases({ nameOnly: true, filter: { name: dbName } })
        .then((output) => output.databases.length == 0)
    ) {
      await adminDb.admin().command({ create: dbName });
    }
    const db = client.db(dbName);
    if (
      await db
        .listCollections({ name: "users" }).toArray()
        .then((output) => output.length == 0)
    ) {
      await db.createCollection(collectionName, {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["userID", "password"],
            properties: {
              userID: {
                bsonType: "string",
                description: "userID must be a string",
              },
              password: {
                bsonType: "string",
                description: "Password must be an string",
              },
              photo: {
                bsonType: "binData",
                description: "Photo must be a binary file",
              },
            },
          },
        },
      });
    }
    return db.collection(collectionName);
}

//Declare Collection
let collection = connectToMongo();
//Create user
async function createUser(userID, password) {
  (await collection).insertOne({
    userID: userID,
    password: password,
  });
}
//Delete user
async function deleteUser(_id) {
  (await collection).deleteOne({ _id:new ObjectId(_id)});
}
//Fetch users
async function fetchUsers() {
  return (await collection).find({}).toArray();
}

//Modify user
async function modifyUser(userID, photo) {
  const photoBuffer = fs.readFileSync(photo);
  await collection.updateOne({ userID: userID }, { $set: { photo: photo } });
}

async function findUser(userID) {
  return await (await collection).findOne({ userID});
}

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.set("view engine", "pug");
app.set("views", "public/views");
app.use("/res", express.static("public"));
// Use session middleware
app.use(session({
  secret: 'secret-secret',
  resave: false,
  saveUninitialized: true,
}));

app.get("/", (req, res) => {
  res.redirect("/admin");
});

app.get("/user", (req, res) => {
  if (req.query.logout){
    req.session.userLoggedIn=false;
    req.session.userID=null;
  }
  req.session.userLoggedIn=false;
  res.render("user");
});

app.post("/processUserLogin", async (req, res) => {
  let user = await findUser(req.body.userID)
  if (!user) {
    res.redirect("/user?error=1");
  }
  if (req.body.password == user.password) {
    req.session.userLoggedIn = true;
    req.session.userID=req.body.userID;
    res.redirect("userHome");
  } else {
    res.redirect("/user?error=1");}
});

app.get("/userHome" , async(req,res) => {
  
  if(!req.session.userLoggedIn && !req.session.userID){
    res.redirect("/user")
    return
  }
  let user = await findUser(req.session.userID)
  res.render("userHome",{user:user});
})


app.get("/admin", (req, res) => {
  req.session.adminLoggedIn=false;
  res.render("admin");
});

app.post("/processAdminLogin", async (req, res) => {
  if (req.body.userID == "1234" && req.body.password == "admin") {
    req.session.adminLoggedIn = true;
    res.redirect("manageUsers");
  } else {
    res.redirect("/admin?error=1");
  }
});

app.get("/manageUsers", async (req, res) => {
  if(!req.session.adminLoggedIn){
    res.redirect("/admin")
  }
  res.render("manageUsers", {users:await fetchUsers()});
});



app.post("/accessDB", async (req, res) => {
  console.log(req.body);
  // Implement throw error if user action not found
  switch (req.body.action) {
    case "add":
      await createUser(req.body.userID, req.body.password);
      req.session.adminLoggedIn = true;
      res.send({users:(await fetchUsers())});
      break;
    case "delete":
      req.session.adminLoggedIn = true;
      await deleteUser(req.body._id);
      res.redirect("/manageUsers");
      break;
    case "modify":
      break;
    case "fetch":
      break;
  }
});

// Listen on port 3000
app.listen(port,"0.0.0.0",() => {console.log("listening on port 3000")}); 