const getData = (json) => {
  let div = document.getElementById(
    "questionListContainer"
  );
  let ul = document.createElement("ul");
  ul.id = "questionList";
  ul.className = "list-padding";

  for (let i = 0; i < json.items.length; i++) {
    //html elements
    let button = document.createElement("div");
    button.className = "card my-button highlight";
    let divContent = document.createElement("div");
    let pContent = document.createElement("p");
    let answers = document.createElement("ol");

    let h = document.createElement("h1");
    h.innerHTML = "Question";

    let a = document.createElement("h1");
    a.innerHTML = "Answers";

    //div attributes + onclick function
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

    //append content onto html file
    pContent.innerHTML = json.items[i].body;
    getAnswers(answers, i, json);

    divContent.append(h);
    divContent.appendChild(pContent);
    if (json.items[i].answer_count > 0) {
      divContent.appendChild(a);
    }
    divContent.appendChild(answers);

    ul.appendChild(button);
    ul.appendChild(divContent);
  }

  div.appendChild(ul);
};

const getAnswers = (answers, i, json) => {
  for (let j = 0; j < json.items[i].answer_count; j++) {
    let answer = document.createElement("li");
    let answerBody = document.createElement("p");
    answerBody.innerHTML = json.items[i].answers[j].body;

    answer.appendChild(answerBody);
    answer.appendChild(document.createElement("br"));
    answers.appendChild(answer);
  }
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
  const questions = `${api}/questions?fromdate=1613779200&todate=1614384000&order=desc&sort=creation&tagged=${tag}&site=stackoverflow&filter=!m)ASvzmwfr403f*F5dU1)8hbeB3Kgkc8rhKafuMzR-Es.)4fbDi5D6gX`;

  const response = await fetch(questions);
  const json = await response.json();
  console.log(json);

  deletePrevious(); //delete the previous list items if they exist

  getData(json);
};
