let url = "/accessDB";
let helpTip = document.getElementById("helpTip");

let deleteUser = async (_id) => {
  let data = JSON.stringify({
    action: "delete",
    _id: _id,
  });
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  });

  document.getElementById(_id).remove();
};



let createUser = async () => {
  let form = new FormData(document.getElementById("userCreationForm"));
  if (form.get("userID").trim() == "" || form.get("password").trim() == "") {
    helpTip.style.display = "block";
    helpTip.innerHTML = "Fields cannot be empty/whitespaces";
    return false;
  }
  let data = {
    action: form.get("action"),
    userID: form.get("userID"),
    password: form.get("password"),
  };

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Convert the data to JSON format
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      data = data.users;
      updateTable(data);
    })
    .catch((error) => {
      console.log(error);
    });
};
let updateTable = (data) => {
  let table = document.getElementById("userTable");
  table.tBodies[0].innerHTML = "";
  data.forEach((user) => {
    table.tBodies[0].innerHTML += `<tr id=${user._id}>
    <td>${user.userID}</td>
    <td>${user.password}</td>
    <td>${user.photo ? user.photo : "No Photo"}</td>
    <td><button type="button" onclick=deleteUser('${
      user._id
    }') class="btn btn-danger")> Delete </button></td></tr>
    `;
  });
};
