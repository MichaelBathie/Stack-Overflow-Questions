const getData = (items) => {
  let div = document.getElementById("questionListContainer");
  let ul = document.createElement("ul");
  ul.id = "questionList";
  ul.className = "list-padding";

  for (let i = 0; i < items.length; i++) {
    //html elements
    let button = document.createElement("div");
    button.className = "card my-button highlight";
    let divContent = document.createElement("div");
    let pContent = document.createElement("p");
    let answers = document.createElement("ol");
    let qComments = document.createElement("ol");

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
        `${items[i].title} || Creation Date: ${newDate(
          items[i].creation_date
        )} || Score: ${items[i].score}`
      )
    );

    pContent.innerHTML = items[i].body;

    getAnswers(answers, items[i]); //grab all answers
    getComments(qComments, items[i], "Question Comments"); //grab all comments on the questions

    divContent.append(h);
    divContent.appendChild(pContent);
    divContent.appendChild(qComments);
    if (items[i].answer_count > 0) {
      divContent.appendChild(a);
    }
    divContent.appendChild(answers);

    ul.appendChild(button);
    ul.appendChild(divContent);
  }

  div.appendChild(ul);
};

const getAnswers = (answers, json) => {
  for (let j = 0; j < json.answer_count; j++) {
    let header = document.createElement("h6");
    let answer = document.createElement("li");
    let answerBody = document.createElement("p");
    header.innerHTML = `Creation Date: ${newDate(
      json.answers[j].creation_date
    )} || Score: ${json.answers[j].score}`;
    answerBody.innerHTML = json.answers[j].body;

    answer.appendChild(header);
    answer.appendChild(answerBody);

    getComments(answer, json.answers[j], "Answer Comments");

    answer.appendChild(document.createElement("br"));
    answers.appendChild(answer);
  }
};

const getComments = (append, json, title) => {
  let h = document.createElement("h4");
  h.innerHTML = title;

  let commentList = document.createElement("ol");
  for (let k = 0; k < json.comment_count; k++) {
    let header = document.createElement("h6");
    let comment = document.createElement("li");
    let commentBody = document.createElement("p");

    header.innerHTML = `Creation Date: ${newDate(
      json.comments[k].creation_date
    )} || Score: ${json.comments[k].score}`;
    commentBody.innerHTML = json.comments[k].body;

    comment.appendChild(header);
    comment.appendChild(commentBody);

    comment.appendChild(document.createElement("br"));
    commentList.appendChild(comment);
  }
  if (json.comment_count > 0) {
    append.appendChild(h);
    append.appendChild(commentList);
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
  let weekAgo = new Date(Date.now() - 604800000);
  weekAgo = Math.round(weekAgo.getTime() / 1000);

  const topVoted = `https://api.stackexchange.com/2.2/questions?page=1&pagesize=10&fromdate=${weekAgo}&order=desc&sort=votes&tagged=${tag}&site=stackoverflow&filter=!*PBR8nclYi)J1Y.yEkh5DVscPK_BbQgKnuB)FPIQtKjQxarST`;
  let topVotedResponse = await fetch(topVoted);
  let topVotedjson = await topVotedResponse.json();
  console.log(topVotedjson);

  const recent = `https://api.stackexchange.com/2.2/questions?page=1&pagesize=10&fromdate=${weekAgo}&order=desc&sort=creation&tagged=${tag}&site=stackoverflow&filter=!*PBR8nclYi)J1Y.yEkh5DVscPK_BbQgKnuB)FPIQtKjQxarST`;
  //`${api}/questions?fromdate=1613779200&todate=1614384000&order=desc&sort=creation&tagged=${tag}&site=stackoverflow&filter=!m)ASvzmwfr403f*F5dU1)8hbeB3Kgkc8rhKafuMzR-Es.)4fbDi5D6gX`;
  let recentResponse = await fetch(recent);
  let recentjson = await recentResponse.json();
  console.log(recentjson);

  deletePrevious(); //delete the previous list items if they exist

  let recentItems = recentjson.items;
  let votedItems = topVotedjson.items;

  let finalItems = recentItems.concat(votedItems);
  finalItems.sort(function (a, b) {
    return b.creation_date - a.creation_date;
  });

  getData(finalItems);
};

const newDate = (seconds) => {
  let time = new Date(1970, 0, 1);
  time.setSeconds(seconds);
  time.setHours(time.getHours() - 6);
  return time;
};
