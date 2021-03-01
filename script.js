const getTitles = (json) => {
  let div = document.getElementById(
    "questionListContainer"
  );
  let ul = document.createElement("ul");
  ul.id = "questionList";

  for (let i = 0; i < json.items.length; i++) {
    //html elements
    let button = document.createElement("button");
    let divContent = document.createElement("div");
    let pContent = document.createElement("p");

    //div attributes + onclick function
    divContent.id = i;
    divContent.style.display = "none";
    button.onclick = function () {
      if (divContent.style.display === "block") {
        divContent.style.display = "none";
      } else {
        divContent.style.display = "block";
      }
    };

    //setup list buttons
    button.appendChild(
      document.createTextNode(
        `${
          json.items[i].title
        } || Creation Date: ${new Date(
          json.items[i].creation_date
        )} || Score: ${json.items[i].score}`
      )
    );

    //append concent onto html file
    pContent.appendChild(
      document.createTextNode("yo this is a test")
    );

    divContent.appendChild(pContent);

    ul.appendChild(button);
    ul.appendChild(divContent);
  }

  div.appendChild(ul);
};

const deletePrevious = () => {
  let list = document.getElementById("questionList");

  if (list != null) {
    list.remove();
  }
};

const getResponse = async () => {
  const tag = document.getElementById("tag").value;
  const api = "https://api.stackexchange.com/2.2";
  const questions = `${api}/questions?fromdate=1613779200&todate=1614384000&order=desc&sort=creation&tagged=${tag}&site=stackoverflow`;

  const myResponse = await fetch(questions);
  const json = await myResponse.json();

  deletePrevious();

  console.log(json);
  getTitles(json);
};
