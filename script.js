const api = "https://api.stackexchange.com/2.2";
const questions = `${api}/questions?fromdate=1613779200&todate=1614384000&order=desc&sort=creation&tagged=python&site=stackoverflow`;

const getTitles = (json) => {
  let ul = document.getElementById("questionList");

  for (let i = 0; i < json.items.length; i++) {
    //html elements
    let li = document.createElement("button");
    let divContent = document.createElement("div");
    let pContent = document.createElement("p");

    //div attributes + onclick function
    divContent.id = i;
    divContent.style.display = "none";
    li.onclick = function () {
      if (divContent.style.display === "block") {
        divContent.style.display = "none";
      } else {
        divContent.style.display = "block";
      }
    };

    //setup list buttons
    li.appendChild(
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

    ul.appendChild(li);
    ul.appendChild(divContent);
  }
};

const getResponse = async () => {
  const myResponse = await fetch(questions);
  const json = await myResponse.json();
  console.log(json);
  getTitles(json);
};
