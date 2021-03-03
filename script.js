//retrieve and display all of the needed data
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

    //append data onto the div to add to the html
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

//get all the answers to a specific question
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

//gets all the comments on either the 10 most recent questions
//or the top 10 rated in the last week
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
  const tag = document.getElementById("tag").value.trim();
  let weekAgo = new Date(Date.now() - 604800000);
  weekAgo = Math.round(weekAgo.getTime() / 1000);

  if (!tag) {
    badInput();
    return;
  }

  let startTime = new Date().getTime();

  const topVoted = `https://api.stackexchange.com/2.2/questions?page=1&pagesize=10&fromdate=${weekAgo}&order=desc&sort=votes&tagged=${tag}&site=stackoverflow&filter=!*PBR8nclYi)J1Y.yEkh5DVscPK_BbQgKnuB)FPIQtKjQxarST`;
  let topVotedResponse = await fetch(topVoted);
  let topVotedjson = await topVotedResponse.json();
  const recent = `https://api.stackexchange.com/2.2/questions?page=1&pagesize=10&fromdate=${weekAgo}&order=desc&sort=creation&tagged=${tag}&site=stackoverflow&filter=!*PBR8nclYi)J1Y.yEkh5DVscPK_BbQgKnuB)FPIQtKjQxarST`;
  let recentResponse = await fetch(recent);
  let recentjson = await recentResponse.json();

  let requestTime = new Date().getTime() - startTime; //time for request

  deletePrevious(); //delete the previous list items if they exist

  //get the items from the json file to sort
  let recentItems = recentjson.items;
  let votedItems = topVotedjson.items;

  //merge the two lists and sort on creation date
  let finalItems = recentItems.concat(votedItems);
  finalItems.sort(function (a, b) {
    return b.creation_date - a.creation_date;
  });

  getData(finalItems);

  let displayTime = new Date().getTime() - startTime;
  setResponseTime(requestTime, displayTime);
};

const badInput = () => {
  alert("Please input a valid string into the tag field!");
};

//sets the response time at the bottom of the page
const setResponseTime = (requestTime, displayTime) => {
  let div = document.getElementById("responseTime");

  while (div.firstChild) {
    div.removeChild(div.lastChild);
  }

  div.appendChild(
    document.createTextNode(`Request response time: ${requestTime}ms`)
  );
  div.appendChild(
    document.createTextNode(`   ||   Time to display: ${displayTime}ms`)
  );
};

//get the current date -6 to convert to our time zone
const newDate = (seconds) => {
  let time = new Date(1970, 0, 1);
  time.setSeconds(seconds);
  time.setHours(time.getHours() - 6);
  return time;
};
